<script setup lang="ts">
import type { IPlan, IDays } from '../../interfaces/plans.interface';
import '../../styles/contents/planningcontent.style.scss';
import { ref } from 'vue';
const plans = ref<IPlan>({ day1: [''], day2: [''], day3: [''], day4: [''], day5: [''] });
const planType = ref<'Diario' | 'Semanal'>('Semanal');

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

        <form v-if="planType === 'Diario'" class="dailyPlan">
            <span v-for="(plano, index) in plans.day1">
                <label>Aula/Atividade {{ index + 1 }}</label>
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
                    <i class="pi pi-plus-circle"></i>
                </button>

                <button type="button">
                    Gerar planejamento
                </button>
            </div>
        </form>
        <div v-else class="weeklyPlan">
            <form class="day1Plan weekPlan">
                <h2>Dia 1 (Segunda)</h2>

                <span class="classContainer" v-for="(plan, indexPlan) in plans.day1">
                    <label>Aula/Atividade {{ indexPlan + 1 }}</label>
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
                    <i class="pi pi-plus-circle"></i>
                </button>
            </form>

            <form class="day1Plan weekPlan">
                <h2>Dia 2 (Terca)</h2>

                <span class="classContainer" v-for="(plan, indexPlan) in plans.day2">
                    <label>Aula/Atividade {{ indexPlan + 1 }}</label>
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
                    <i class="pi pi-plus-circle"></i>
                </button>
            </form>

            <form class="day1Plan weekPlan">
                <h2>Dia 3 (Quarta)</h2>

                <span class="classContainer" v-for="(plan, indexPlan) in plans.day3">
                    <label>Aula/Atividade {{ indexPlan + 1 }}</label>
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
                    <i class="pi pi-plus-circle"></i>
                </button>
            </form>

            <form class="day1Plan weekPlan">
                <h2>Dia 4 (Quinta)</h2>

                <span class="classContainer" v-for="(plan, indexPlan) in plans.day4">
                    <label>Aula/Atividade {{ indexPlan + 1 }}</label>
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
                    <i class="pi pi-plus-circle"></i>
                </button>
            </form>

            <form class="day1Plan weekPlan">
                <h2>Dia 5 (Sexta)</h2>

                <span class="classContainer" v-for="(plan, indexPlan) in plans.day5">
                    <label>Aula/Atividade {{ indexPlan + 1 }}</label>
                    <span class="row">
                        <input type="text" :value="plan" placeholder="Descreva sua aula/atividade sem usar virgulas"
                            @change="event => handleChangePlanText('day5', indexPlan, (event.target as HTMLInputElement).value)" />
                        <button v-if="indexPlan > 0" type="button" class="btnTrash"
                            @click="handleRemoveClassAtvFromPlan('day5', indexPlan)">
                            <i class="pi pi-trash"></i>
                        </button>
                        <div v-else class="ghostButton"></div>
                    </span>
                </span>

                <button type="button" class="btnAddClassAtv" @click="handleAddNewClassInPlanning('day5')">
                    <i class="pi pi-plus-circle"></i>
                </button>
            </form>
        </div>
    </div>
</template>
