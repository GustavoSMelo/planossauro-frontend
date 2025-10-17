<script setup lang="ts">
import { ref, inject } from 'vue';
import '../../styles/contents/planningcontent.style.scss';
import type { IPlan, IDays } from '../../interfaces/plans.interface';
import type { ILoadingContext } from '../../interfaces/context/loading.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
import { qsn } from '../../assets/qsn.json';
import axios from 'axios';
import PizZip from 'pizzip';
import Docxtemplater from "docxtemplater";
import type { IClassPlanResponse, IOllamaGemmaResponse } from '../../interfaces/ollama.res';
import { saveAs } from 'file-saver';

const plans = ref<IPlan>({ day1: [''], day2: [''], day3: [''], day4: [''], day5: [''] });
const planType = ref<'Diario' | 'Semanal'>('Semanal');
const isLoadingContext = inject('isLoading') as ILoadingContext;
const popupContext = inject('popup') as IPopupContext;

const handleChangePlanType = (event: Event) => {
    const target = event.target as HTMLInputElement;
    planType.value = target.value as 'Diario' | 'Semanal';
};

const handleChangePlanText = (day: IDays['days'], index: number, classAtv: string) => {
    plans.value[day][index] = classAtv.replaceAll(',', '');
    console.log(plans.value);
};

const handleAddNewClassInPlanning = (day: IDays['days']) => {
    plans.value[day].push('');
};

const handleRemoveClassAtvFromPlan = (day: IDays['days'], index: number) => {
    plans.value[day] = plans.value[day].filter((_, planIndex) => planIndex !== index);
};

const generatePlan = async () => {
    if (planType.value === 'Diario') {
        let hasEmptyFields = false;

        plans.value.day1.forEach(element => {
            if (element.length <= 0) {
                hasEmptyFields = true
            }
        });

        if (hasEmptyFields) {
            popupContext.handleChangePopupInfo('Preencha todos os campos e tente novamente', 'warning', true);

            return;
        }
    } else {
        let hasEmptyFields = false;

        for (let i = 1; i < 6; i++) {
            const dayValue = `day${i}` as IDays['days'];
            plans.value[dayValue].forEach(element => {
                if (element.length <= 0) {
                    hasEmptyFields = true;
                }
            });
        }

        if (hasEmptyFields) {
            popupContext.handleChangePopupInfo('Preencha todos os campos e tente novamente', 'warning', true);

            return;
        }
    }

    await isLoadingContext.handleChangeIsLoading(true);

    if (planType.value === 'Diario') {
        let activities = [];
        activities.push({ day1: plans.value.day1.map(classAtv => classAtv) });

        const prompt = `
        -- ${JSON.stringify(qsn)}
        -- atividades: ${JSON.stringify(activities)}
        -- baseado no json e nas atividades que lhe enviei, gere uma resposta apenas em formato json as seguintes informacoes:
        contexto: gere o contexto da aula com todas as atividades de forma corrida, descreva como a atividade vai auxiliar na educacao do educando
        eixo: identifique qual o melhor eixo baseado no json fornecido
        saber: identifique qual o melhor saber que se encaixa nessa aula com base no eixo
        saber2: identifique outro saber qual o melhor saber que se encaixa nessa aula com base no eixo
        aprendizagem: identifique qual a melhor aprendizagem que se encaixa nessa aula com base no saber
        aprendizagem: identifique qual a melhor aprendizagem que se encaixa nessa aula com base no saber2
        foco_avaliativo: faca uma pergunta de nota mental para o educador que se encaixa dentro do contexto dessa aula
        materiais: identifique os materiais que foram utilizados nessa aula

        a resposta deve ser exatamente essa, nao gere texto a mais ou a menos: {
            contextualizacao: resposta,
            eixo: resposta
            saber01: resposta,
            saber02: resposta,
            aprendizagem01: resposta,
            aprendizagem02: resposta,
            foco_avaliativo: resposta,
            materiais: resposta
        }
        `;

        const response = await axios.post(import.meta.env.VITE_API_URL, {
            model: import.meta.env.VITE_LLM_MODEL,
            prompt,
            stream: false
        });

        console.log(response.data);
    } else {
        let activities = [];
        for (let i = 1; i < 6; i++) {

            const dayValue = `day${i}` as IDays['days'];
            const temp = {} as any;
            temp[dayValue] = plans.value[dayValue].map(classAtv => classAtv)

            activities.push({ ...temp });
        }

        const [responseDay1, responseDay2, responseDay3, responseDay4, responseDay5] = await Promise.all(activities.map(async (item, index) => {
            const prompt = `
                    -- ${JSON.stringify(qsn)}
                    -- atividades: ${JSON.stringify(item)}
                    -- baseado no json e nas atividades que lhe enviei, gere uma resposta apenas em formato json as seguintes informacoes:
                    contexto: gere o contexto da aula com todas as atividades de forma corrida, descreva como a atividade vai auxiliar na educacao do educando
                    eixo: identifique qual o melhor eixo baseado no json fornecido
                    saber: identifique qual o melhor saber que se encaixa nessa aula com base no eixo
                    saber2: identifique outro saber qual o melhor saber que se encaixa nessa aula com base no eixo
                    aprendizagem: identifique qual a melhor aprendizagem que se encaixa nessa aula com base no saber
                    aprendizagem: identifique qual a melhor aprendizagem que se encaixa nessa aula com base no saber2
                    foco_avaliativo: faca uma pergunta de nota mental para o educador que se encaixa dentro do contexto dessa aula
                    materiais: identifique os materiais que foram utilizados nessa aula

                    a resposta deve ser exatamente essa, nao gere texto a mais ou a menos: {
                        contextualizacao: resposta,
                        eixo: resposta
                        saber01: resposta,
                        saber02: resposta,
                        aprendizagem01: resposta,
                        aprendizagem02: resposta,
                        foco_avaliativo: resposta,
                        materiais: resposta
                    }
                    `;

            const response = await axios.post(import.meta.env.VITE_API_URL, {
                model: import.meta.env.VITE_LLM_MODEL,
                prompt,
                stream: false
            });

            return JSON.parse((response.data as IOllamaGemmaResponse)
                .response
                .replaceAll(/\\/g, '')
                .replaceAll('\n', '')
                .replaceAll('`', '')
                .replaceAll('json', '')) as IClassPlanResponse;
        }
        ));
        console.log(responseDay1, responseDay2, responseDay3, responseDay4, responseDay5);

        console.log(responseDay1);

        const planejamentoQSNFetch = await fetch('/planejamentoQSN.docx');
        const [arrayBuffer] = await Promise.all([planejamentoQSNFetch.arrayBuffer()]);
        const planZip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(planZip, { paragraphLoop: true, linebreaks: true });

        const data = {
            // day 1
            eixo1: responseDay1.eixo,
            saber1: `${responseDay1.saber01}\n \n${responseDay1.saber02}`,
            aprendizagem1: `${responseDay1.aprendizagem01}\n \n${responseDay1.aprendizagem02}`,
            atividade1_1: plans.value.day1[0],
            atividade1_2: plans.value.day1[1],
            atividade1_3: plans.value.day1[2],
            contextualizacao1: responseDay1.contextualizacao,
            foco1: responseDay1.foco_avaliativo,
            materiais1: responseDay1.materiais,

            // day 2
            eixo2: responseDay2.eixo,
            saber2: `${responseDay2.saber01}\n${responseDay2.saber02}`,
            aprendizagem2: `${responseDay2.aprendizagem01}\n${responseDay2.aprendizagem02}`,
            atividade2_1: plans.value.day2[0],
            atividade2_2: plans.value.day2[1],
            atividade2_3: plans.value.day2[2],
            contextualizacao2: responseDay2.contextualizacao,
            foco2: responseDay2.foco_avaliativo,
            materiais2: responseDay2.materiais,

            // day 3
            eixo3: responseDay3.eixo,
            saber3: `${responseDay3.saber01}\n \n${responseDay3.saber02}`,
            aprendizagem3: `${responseDay3.aprendizagem01}\n \n${responseDay3.aprendizagem02}`,
            atividade3_1: plans.value.day3[0],
            atividade3_2: plans.value.day3[1],
            atividade3_3: plans.value.day3[2],
            contextualizacao3: responseDay3.contextualizacao,
            foco3: responseDay3.foco_avaliativo,
            materiais3: responseDay3.materiais,

            // day 4
            eixo4: responseDay4.eixo,
            saber4: `${responseDay4.saber01}\n \n${responseDay4.saber02}`,
            aprendizagem4: `${responseDay4.aprendizagem01}\n \n${responseDay4.aprendizagem02}`,
            atividade4_1: plans.value.day4[0],
            atividade4_2: plans.value.day4[1],
            atividade4_3: plans.value.day4[2],
            contextualizacao4: responseDay4.contextualizacao,
            foco4: responseDay4.foco_avaliativo,
            materiais4: responseDay4.materiais,

            // day 5
            eixo5: responseDay5.eixo,
            saber5: `${responseDay5.saber01}\n \n${responseDay5.saber02}`,
            aprendizagem5: `${responseDay5.aprendizagem01}\n \n${responseDay5.aprendizagem02}`,
            atividade5_1: plans.value.day5[0],
            atividade5_2: plans.value.day5[1],
            atividade5_3: plans.value.day5[2],
            contextualizacao5: responseDay5.contextualizacao,
            foco5: responseDay5.foco_avaliativo,
            materiais5: responseDay5.materiais,
        };

        doc.render(data);
        console.log(responseDay1.eixo);

        const b64Document = doc.getZip().generate({ type: 'base64' });
        const byteChars = atob(b64Document);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([doc.toBlob()], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        saveAs(blob, 'planejamento.docx');
    }
    await isLoadingContext.handleChangeIsLoading(false);

};

</script>
<template>
    <div class="planningContainer">
        <div class="planningSelect">
            <img src="../../assets/dinoPlanejador.png" alt="Dino planejador" />
            <span>
                <h1>Gere seu planejamento: </h1>
                <select class="planSelect" :value="planType" @change="event => handleChangePlanType(event)">
                    <option value="Diario">Diario</option>
                    <option value="Semanal">Semanal</option>
                </select>
            </span>
        </div>

        <!-- Diario -->

        <form v-if="planType === 'Diario'" class="dailyPlan">
            <span v-for="(plano, index) in plans.day1">
                <label>📚 Aula/Atividade {{ index + 1 }}</label>
                <span class="row">
                    <input type="text" :value="plano" placeholder="Descreva sua aula/atividade sem usar virgulas"
                        @change="event => handleChangePlanText('day1', index, (event.target as HTMLInputElement).value)" />
                    <button v-if="index > 0" type="button" class="btnTrash"
                        @click="handleRemoveClassAtvFromPlan('day1', index)">
                        <i class="pi pi-trash"></i> Adicionar aula
                    </button>
                </span>
            </span>
            <div class="btnContainer">
                <button class="btnAddClassAtv" type="button" @click="handleAddNewClassInPlanning('day1')">
                    <i class="pi pi-plus-circle"></i>
                </button>

                <button type="button" @click="generatePlan">
                    Gerar planejamento
                </button>
            </div>
        </form>

        <!-- Semanal -->
        <div v-else class="weeklyPlan">
            <form class="day1Plan weekPlan">
                <h2>Dia 1 (Segunda)</h2>

                <span class="classContainer" v-for="(plan, indexPlan) in plans.day1">
                    <label>📚 Aula/Atividade {{ indexPlan + 1 }}</label>
                    <span class="row">
                        <input type="text" :value="plan" placeholder="Descreva sua aula/atividade sem usar virgulas"
                            @change="event => handleChangePlanText('day1', indexPlan, (event.target as HTMLInputElement).value)" />
                        <button v-if="indexPlan > 0" type="button" class="btnTrash"
                            @click="handleRemoveClassAtvFromPlan('day1', indexPlan)">
                            <i class="pi pi-trash"></i>
                        </button>
                        <div v-else class="ghostButton"></div>
                    </span>
                </span>

                <button type="button" class="btnAddClassAtv" @click="handleAddNewClassInPlanning('day1')">
                    <p class="btnAddClass">Adicionar aula</p> <i class="pi pi-plus-circle"></i>
                </button>
            </form>

            <form class="day2Plan weekPlan">
                <h2>Dia 2 (Terca)</h2>

                <span class="classContainer" v-for="(plan, indexPlan) in plans.day2">
                    <label>📚 Aula/Atividade {{ indexPlan + 1 }}</label>
                    <span class="row">
                        <input type="text" :value="plan" placeholder="Descreva sua aula/atividade sem usar virgulas"
                            @change="event => handleChangePlanText('day2', indexPlan, (event.target as HTMLInputElement).value)" />
                        <button v-if="indexPlan > 0" type="button" class="btnTrash"
                            @click="handleRemoveClassAtvFromPlan('day2', indexPlan)">
                            <i class="pi pi-trash"></i>
                        </button>
                        <div v-else class="ghostButton"></div>
                    </span>
                </span>

                <button type="button" class="btnAddClassAtv" @click="handleAddNewClassInPlanning('day2')">
                    <p class="btnAddClass">Adicionar aula</p> <i class="pi pi-plus-circle"></i>
                </button>
            </form>

            <form class="day3Plan weekPlan">
                <h2>Dia 3 (Quarta)</h2>

                <span class="classContainer" v-for="(plan, indexPlan) in plans.day3">
                    <label>📚 Aula/Atividade {{ indexPlan + 1 }}</label>
                    <span class="row">
                        <input type="text" :value="plan" placeholder="Descreva sua aula/atividade sem usar virgulas"
                            @change="event => handleChangePlanText('day3', indexPlan, (event.target as HTMLInputElement).value)" />
                        <button v-if="indexPlan > 0" type="button" class="btnTrash"
                            @click="handleRemoveClassAtvFromPlan('day3', indexPlan)">
                            <i class="pi pi-trash"></i>
                        </button>
                        <div v-else class="ghostButton"></div>
                    </span>
                </span>

                <button type="button" class="btnAddClassAtv" @click="handleAddNewClassInPlanning('day3')">
                    <p class="btnAddClass">Adicionar aula</p> <i class="pi pi-plus-circle"></i>
                </button>
            </form>

            <form class="day4Plan weekPlan">
                <h2>Dia 4 (Quinta)</h2>

                <span class="classContainer" v-for="(plan, indexPlan) in plans.day4">
                    <label>📚 Aula/Atividade {{ indexPlan + 1 }}</label>
                    <span class="row">
                        <input type="text" :value="plan" placeholder="Descreva sua aula/atividade sem usar virgulas"
                            @change="event => handleChangePlanText('day4', indexPlan, (event.target as HTMLInputElement).value)" />
                        <button v-if="indexPlan > 0" type="button" class="btnTrash"
                            @click="handleRemoveClassAtvFromPlan('day4', indexPlan)">
                            <i class="pi pi-trash"></i>
                        </button>
                        <div v-else class="ghostButton"></div>
                    </span>
                </span>

                <button type="button" class="btnAddClassAtv" @click="handleAddNewClassInPlanning('day4')">
                    <p class="btnAddClass">Adicionar aula</p> <i class="pi pi-plus-circle"></i>
                </button>
            </form>

            <form class="day5Plan weekPlan">
                <h2>Dia 5 (Sexta)</h2>

                <span class="classContainer" v-for="(plan, indexPlan) in plans.day5">
                    <label>📚 Aula/Atividade {{ indexPlan + 1 }}</label>
                    <span class="row">
                        <input type="text" :value="plan" placeholder="Descreva sua aula/atividade sem usar virgulas"
                            @change="event => handleChangePlanText('day5', indexPlan, (event.target as HTMLInputElement).value)" />
                        <button v-if="indexPlan > 0" type="button" class="btnTrash"
                            @click="handleRemoveClassAtvFromPlan('day5', indexPlan)">
                            <p class="btnAddClass">Adicionar aula</p> <i class="pi pi-trash"></i>
                        </button>
                        <div v-else class="ghostButton"></div>
                    </span>
                </span>

                <button type="button" class="btnAddClassAtv" @click="handleAddNewClassInPlanning('day5')">
                    <p class="btnAddClass">Adicionar aula</p> <i class="pi pi-plus-circle"></i>
                </button>
            </form>
        </div>
        <button class="btnGeneratePlan" v-if="planType === 'Semanal'" type="button" @click="generatePlan()">Gerar
            planejamento</button>
    </div>
</template>
