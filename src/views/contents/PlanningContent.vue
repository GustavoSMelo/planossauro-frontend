<script setup lang="ts">
import { ref, inject, nextTick, watch, watchEffect } from 'vue';
import '../../styles/contents/planningcontent.style.scss';
import type { IPlan, IDays } from '../../interfaces/plans.interface';
import type { ILoadingContext } from '../../interfaces/context/loading.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
import type { IClassPlanResponse, IOllamaGemmaResponse } from '../../interfaces/ollama.res';
import { qsn } from '../../assets/qsn.json';
import { saveAs } from 'file-saver';
import axios from 'axios';
import PizZip from 'pizzip';
import Docxtemplater from "docxtemplater";
import dayConverter from '../../helpers/dayConverter';
import type { IShowPreview, IShowPreviewContext } from '../../interfaces/context/showPreview.interface';
import { debounce } from 'lodash-es';
import type { ITemplateChooseContext } from '../../interfaces/context/templateChoose.interface';
import { isWeekend } from '../../helpers/isWeekend';

const plans = ref<IPlan>({ day1: [''], day2: [''], day3: [''], day4: [''], day5: [''] });
const selectedDay = ref<IDays['days']>('day1');
const planType = ref<IShowPreview['planType']>('Semanal');
const isOpenPlanMobileMenu = ref<boolean>(false);
const schoolName = ref('');
const className = ref('');
const planDateStart = ref('');
const planDateEnd = ref('');
const showAditionalInformation = ref(false);
const isLoadingContext = inject('isLoading') as ILoadingContext;
const popupContext = inject('popup') as IPopupContext;
const showPreviewContext = inject('showPreview') as IShowPreviewContext;
const templateChooseContext = inject('templateChoose') as ITemplateChooseContext;

const handleChangeSelectedDay = (changeSelectDay: IDays['days']): void => {
    selectedDay.value = changeSelectDay;
    isOpenPlanMobileMenu.value = !isOpenPlanMobileMenu.value;
};

const handleChangePlanType = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    planType.value = target.value as 'Diario' | 'Semanal';
};

const handleChangePlanText = (day: IDays['days'], index: number, classAtv: string): void => {
    plans.value[day][index] = classAtv.replaceAll(',', '');
};

const handleAddNewClassInPlanning = (day: IDays['days']): void => {
    plans.value[day].push('');
};

const handleRemoveClassAtvFromPlan = (day: IDays['days'], index: number): void => {
    if (index === 0) return;
    plans.value[day] = plans.value[day].filter((_, planIndex) => planIndex !== index);
};

const handleGoBack = debounce(async () => {
    const dayNumber = Number.parseInt(selectedDay.value.split('day')[1]);
    if (dayNumber === 1) {
        selectedDay.value = `day${5}`;
        await nextTick();
        return;
    }

    selectedDay.value = `day${dayNumber - 1}` as IDays['days'];
    await nextTick();
    return;
}, 300);

const handleGoFoward = debounce(async () => {
    const dayNumber = Number.parseInt(selectedDay.value.split('day')[1]);

    if (dayNumber === 5) {
        selectedDay.value = `day${1}`
        await nextTick();
        return;
    }

    selectedDay.value = `day${dayNumber + 1}` as IDays['days'];
    await nextTick();
    return;
}, 300)

const handleMobileMenu = (): void => {
    isOpenPlanMobileMenu.value = !isOpenPlanMobileMenu.value;
};

const hasEmptyStringsInClasses = (): Array<boolean> => {
    let day1IsEmpty = false;
    let day2IsEmpty = false;
    let day3IsEmpty = false;
    let day4IsEmpty = false;
    let day5IsEmpty = false;


    plans.value['day1'].forEach(element => element.length <= 0 ? day1IsEmpty = true : null);
    plans.value['day2'].forEach(element => element.length <= 0 ? day2IsEmpty = true : null);
    plans.value['day3'].forEach(element => element.length <= 0 ? day3IsEmpty = true : null);
    plans.value['day4'].forEach(element => element.length <= 0 ? day4IsEmpty = true : null);
    plans.value['day5'].forEach(element => element.length <= 0 ? day5IsEmpty = true : null);

    return [day1IsEmpty, day2IsEmpty, day3IsEmpty, day4IsEmpty, day5IsEmpty];
};

const hasEmptyStringsInDiary = (): boolean => {
    let dayIsEmpty = false;

    plans.value['day1'].forEach(element => element.length <= 0 ? dayIsEmpty = true : null);

    return dayIsEmpty;
}

const handleChangeSchoolName = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    schoolName.value = target.value;
};

const handleChangeClassName = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    className.value = target.value;
};

const handleChangeClassDateStart = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    planDateStart.value = target.value;
};

const handleChangeClassDateEnd = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    planDateEnd.value = target.value;
};

const isAditionInformationMissing = (): boolean => {
    return schoolName.value.length > 0 &&
        className.value.length > 0 &&
        planDateStart.value.length > 0 &&
        planDateEnd.value.length > 0
        ? false : true;
};

const stopPropagation = (event: Event): void => {
    event.stopPropagation();
};

const showTemplatePreviewChoose = () => {
    if (isAditionInformationMissing()) {
        popupContext.handleChangePopupInfo('Preencha todas as informacoes \n e tente novamente', 'warning', true);
        return;
    }

    if (isWeekend(planDateStart.value) || isWeekend(planDateEnd.value)) {
        popupContext.handleChangePopupInfo('O seu planejamento esta sendo inserido nos finais de semana', 'error', true);
        return;
    }

    const dateStart = new Date(planDateStart.value);
    const dateEnd = new Date(planDateEnd.value);
    const dateDiffInMilliseconds = new Date(Number(dateEnd) - Number(dateStart));

    const dateDiffInDays = (Number(dateDiffInMilliseconds) / (1000 * 60 * 60 * 24)) + 1;

    if (dateDiffInDays !== 5) {
        popupContext.handleChangePopupInfo('A data de inicio ou fim do planejamento, nao confere com uma semana', 'error', true);
        return;
    }

    showAditionalInformation.value = false;
    const showPreviewContextHelper = { isCustomDocs: 'false', showChooseTemplate: 'true', show: true, planType, customURLDoc: '' } as unknown as IShowPreview;

    showPreviewContext.handleChangeShowPreview({ ...showPreviewContextHelper });
};

const generatePlan = async () => {
    try {
        const hasEmptyStrings = hasEmptyStringsInClasses().find(element => element === true);
        if (hasEmptyStrings) {
            popupContext.handleChangePopupInfo('Preencha os campos para escolher o template', 'error', true);
            return;
        }

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

            await axios.post(import.meta.env.VITE_API_URL, {
                model: import.meta.env.VITE_LLM_MODEL,
                prompt,
                stream: false
            });

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
            }));

            const planejamentoQSNFetch = await fetch(`../../../public/planejamento${templateChooseContext.templateChoose.templateType}${templateChooseContext.templateChoose.templateStyle}.docx`);
            const [arrayBuffer] = await Promise.all([planejamentoQSNFetch.arrayBuffer()]);
            const planZip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(planZip, { paragraphLoop: true, linebreaks: true });

            const data = {
                // header
                nomeEscola: schoolName,
                sala: className,
                diaStart: planDateStart.value.split('-')[2],
                diaEnd: planDateEnd.value.split('-')[2],
                mes: planDateEnd.value.split('-')[1],
                ano: planDateEnd.value.split('-')[0],

                // day 1
                eixo1: responseDay1.eixo,
                saber1: `${responseDay1.saber01}\n \n${responseDay1.saber02}`,
                aprendizagem1: `${responseDay1.aprendizagem01}\n \n${responseDay1.aprendizagem02}`,
                atividade1: plans.value.day1.map(item => `${item.toString()} \n \n`),
                contextualizacao1: responseDay1.contextualizacao,
                foco1: responseDay1.foco_avaliativo,
                materiais1: responseDay1.materiais,

                // day 2
                eixo2: responseDay2.eixo,
                saber2: `${responseDay2.saber01}\n${responseDay2.saber02}`,
                aprendizagem2: `${responseDay2.aprendizagem01}\n${responseDay2.aprendizagem02}`,
                atividade2: plans.value.day2.map(item => `${item.toString()} \n \n`),
                contextualizacao2: responseDay2.contextualizacao,
                foco2: responseDay2.foco_avaliativo,
                materiais2: responseDay2.materiais,

                // day 3
                eixo3: responseDay3.eixo,
                saber3: `${responseDay3.saber01}\n \n${responseDay3.saber02}`,
                aprendizagem3: `${responseDay3.aprendizagem01}\n \n${responseDay3.aprendizagem02}`,
                atividade3: plans.value.day3.map(item => `${item.toString()} \n \n`),
                contextualizacao3: responseDay3.contextualizacao,
                foco3: responseDay3.foco_avaliativo,
                materiais3: responseDay3.materiais,

                // day 4
                eixo4: responseDay4.eixo,
                saber4: `${responseDay4.saber01}\n \n${responseDay4.saber02}`,
                aprendizagem4: `${responseDay4.aprendizagem01}\n \n${responseDay4.aprendizagem02}`,
                atividade4: plans.value.day4.map(item => `${item.toString()} \n \n`),
                contextualizacao4: responseDay4.contextualizacao,
                foco4: responseDay4.foco_avaliativo,
                materiais4: responseDay4.materiais,

                // day 5
                eixo5: responseDay5.eixo,
                saber5: `${responseDay5.saber01}\n \n${responseDay5.saber02}`,
                aprendizagem5: `${responseDay5.aprendizagem01}\n \n${responseDay5.aprendizagem02}`,
                atividade5: plans.value.day5.map(item => `${item.toString()} \n \n`),
                contextualizacao5: responseDay5.contextualizacao,
                foco5: responseDay5.foco_avaliativo,
                materiais5: responseDay5.materiais,
            };

            doc.render(data);
            const blob = new Blob([doc.toBlob()], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });

            saveAs(blob, 'planejamento.docx');
        }

        templateChooseContext.handleChangeTemplateChoose({ choosed: false, templateStyle: 1, templateType: 'Semanal' });
        isLoadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo('Documento gerado com sucesso', 'success', true);
    } catch (err) {
        isLoadingContext.handleChangeIsLoading(false);
    }
};

watchEffect(() => {
    if (templateChooseContext.templateChoose.choosed) {
        generatePlan();
        templateChooseContext
            .handleChangeTemplateChoose({ choosed: false, templateStyle: 1, templateType: 'Semanal' });
    }
});

</script>
<template>
    <div class="planningContainer">
        <section class="aditionalInformationsContainer" v-if="showAditionalInformation"
            @click="() => showAditionalInformation = false">
            <form class="aditionalInformationsForm" @click="event => stopPropagation(event)">
                <h2>Informacoes adicionais: </h2>

                <label>Nome da escola: </label>
                <input type="text" :value="schoolName" placeholder="Nome da escola..."
                    @change="event => handleChangeSchoolName(event)" />

                <label>Classe/Serie: </label>
                <input type="text" :value="className" placeholder="Classe ou Serie"
                    @change="event => handleChangeClassName(event)" />

                <label>Data do planejamento (inicio): </label>
                <input type="date" :value="planDateStart" @change="event => handleChangeClassDateStart(event)" />

                <label>Data do planejamento (fim): </label>
                <input type="date" :value="planDateEnd" @change="event => handleChangeClassDateEnd(event)" />

                <span class="btnControlsContainer">
                    <button :class="isAditionInformationMissing() ? 'btnChooseTemplateCancel' : 'btnChooseTemplate'"
                        type="button" @click="() => showTemplatePreviewChoose()">
                        Escolher Template
                    </button>
                    <button @click="() => showAditionalInformation = false" class="btnChooseTemplateCancel"
                        type="button">
                        Cancelar
                    </button>
                </span>
            </form>
        </section>

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
                        <i class="pi pi-trash"></i>
                    </button>
                </span>
            </span>
            <div class="btnContainer">
                <button class="btnAddClassAtv" type="button" @click="handleAddNewClassInPlanning('day1')">
                    <i class="pi pi-plus-circle"></i> Adicionar aula
                </button>

                <button :class="hasEmptyStringsInDiary() ? 'btnDiaryGenerateCancel' : 'btnDiaryGenerate'" type="button"
                    @click="() => showAditionalInformation = hasEmptyStringsInDiary() ? false : true">
                    Avancar
                </button>
            </div>
        </form>

        <!-- Semanal -->
        <div v-else class="weeklyPlan">
            <ul class="weekDays">
                <li @click="() => handleChangeSelectedDay('day1')"
                    :class="['btnWeekDays', selectedDay === 'day1' ? 'selected' : '']">
                    <i
                        :class="['pi', hasEmptyStringsInClasses()[0] ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>
                    Segunda
                </li>
                <li @click="() => handleChangeSelectedDay('day2')"
                    :class="['btnWeekDays', selectedDay === 'day2' ? 'selected' : '']">
                    <i
                        :class="['pi', hasEmptyStringsInClasses()[1] ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>
                    Terca
                </li>
                <li @click="() => handleChangeSelectedDay('day3')"
                    :class="['btnWeekDays', selectedDay === 'day3' ? 'selected' : '']">
                    <i
                        :class="['pi', hasEmptyStringsInClasses()[2] ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>
                    Quarta
                </li>
                <li @click="() => handleChangeSelectedDay('day4')"
                    :class="['btnWeekDays', selectedDay === 'day4' ? 'selected' : '']">
                    <i
                        :class="['pi', hasEmptyStringsInClasses()[3] ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>
                    Quinta
                </li>
                <li @click="() => handleChangeSelectedDay('day5')"
                    :class="['btnWeekDays', selectedDay === 'day5' ? 'selected' : '']">
                    <i
                        :class="['pi', hasEmptyStringsInClasses()[4] ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>
                    Sexta
                </li>
            </ul>

            <div class="weekDaysMobile">
                <div class="selectedDay">
                    <h2 class="selectedWeekDayMobile"><i :class="['pi', hasEmptyStringsInClasses()[Number.parseInt(selectedDay.split('day')[1]) - 1]
                        ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>{{
                            dayConverter(selectedDay) }}</h2>
                    <button class="btnChangeWeekMobile" @click="() => handleMobileMenu()"><i
                            :class="['pi', isOpenPlanMobileMenu ? 'pi-chevron-up' : 'pi-chevron-down']"></i></button>
                </div>
                <ul v-if="isOpenPlanMobileMenu === true" class="mobileDayLists">
                    <li :class="['mobileDayItemList', selectedDay === 'day1' ? 'mobileDaySelected' : '']"
                        @click="() => handleChangeSelectedDay('day1')">
                        <i
                            :class="['pi', hasEmptyStringsInClasses()[0] ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>
                        Segunda
                    </li>
                    <li :class="['mobileDayItemList', selectedDay === 'day2' ? 'mobileDaySelected' : '']"
                        @click="() => handleChangeSelectedDay('day2')">
                        <i
                            :class="['pi', hasEmptyStringsInClasses()[1] ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>
                        Terca
                    </li>
                    <li :class="['mobileDayItemList', selectedDay === 'day3' ? 'mobileDaySelected' : '']"
                        @click="() => handleChangeSelectedDay('day3')">
                        <i
                            :class="['pi', hasEmptyStringsInClasses()[2] ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>
                        Quarta
                    </li>
                    <li :class="['mobileDayItemList', selectedDay === 'day4' ? 'mobileDaySelected' : '']"
                        @click="() => handleChangeSelectedDay('day4')">
                        <i
                            :class="['pi', hasEmptyStringsInClasses()[3] ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>
                        Quinta
                    </li>
                    <li :class="['mobileDayItemList', selectedDay === 'day5' ? 'mobileDaySelected' : '']"
                        @click="() => handleChangeSelectedDay('day5')">
                        <i
                            :class="['pi', hasEmptyStringsInClasses()[4] ? 'pi-clock iconUncheck' : 'pi-verified iconCheck']"></i>
                        Sexta
                    </li>
                </ul>
                <span v-else></span>
            </div>

            <div class="classContentContainer">

                <div class="classContent">
                    <div v-for="value, index in plans[selectedDay]" class="classWrapper">
                        <span class="classDescription">
                            <h2>📚 Aula/Atividade {{ index + 1 }}: </h2>
                            <input type="text" placeholder="Insira a descricao da atividade... " :value="value"
                                @change="(event) => handleChangePlanText(selectedDay, index, (event.target! as HTMLInputElement).value)" />
                        </span>
                        <button @click="() => handleRemoveClassAtvFromPlan(selectedDay, index)"
                            :class="index === 0 ? 'btnRemoveClassCancel' : 'btnRemoveClass'"><i
                                class="pi pi-trash"></i></button>
                    </div>
                </div>

                <span class="btnControlsContainer">
                    <button @click="() => handleGoBack()"><i class="pi pi-arrow-left"></i> Voltar</button>
                    <button @click="() => handleAddNewClassInPlanning(selectedDay)"><i class="pi pi-plus-circle"></i>
                        Adicionar atividade</button>
                    <button @click="() => handleGoFoward()">Avancar <i class="pi pi-arrow-right"></i></button>
                </span>
            </div>
        </div>
        <button
            :class="hasEmptyStringsInClasses().find(element => element === true) ? 'btnGeneratePlanCancel' : 'btnGeneratePlan'"
            v-if="planType === 'Semanal'" type="button"
            @click="() => showAditionalInformation = hasEmptyStringsInClasses().find(element => element === true) ? false : true">Avancar</button>
    </div>
</template>
