<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import type { ILoadingContext } from '../../interfaces/context/loading.interface';
import type { IDashboard } from '../../interfaces/dashboard.interface';
import backendApi from '../../api/api';

const dashboard = ref<IDashboard>({} as IDashboard);
const { handleChangeIsLoading } = inject('isLoading') as ILoadingContext;

const handleGetDashboardInformation = async () => {
    try {
        handleChangeIsLoading(true);
        const uuid = sessionStorage.getItem('uuid');
        const response = (await backendApi.get(`/subscription/dashboard/${uuid}`)).data as IDashboard;

        dashboard.value = { ...response }
        sessionStorage.setItem('subscriptionId', response.subscription_id);
        handleChangeIsLoading(false);
    } catch {
        handleChangeIsLoading(false);
    }
};

onMounted(() => {
    handleGetDashboardInformation();
});
</script>

<template>
    <div class="homeContentContainer">
        <h1>Home Page</h1>
        <section class="initialHomeContent">
            <div class="planInfoContainer">
                <h1>Seu plano atual </h1>

                <img src="../../assets/cellphone_pink.png" alt="dino from plan" />
                <h2>{{ dashboard.current_plan }}</h2>
                <button type="button">Gerenciar plano</button>
            </div>

            <aside class="fullColumnContentContainer">
                <h2 class="planningInfoTitle">Informacoes do planejamento</h2>
                <div class="planningInfoContainer firstPlanningInfoContainer">
                    <div>
                        <img src="../../assets/cracha_yellow.png" />
                    </div>
                    <div class="planningDetailsContainer">
                        <h2>Planejamento semanal</h2>
                        <span>
                            <h4>{{ dashboard.used_weekly_planning }} / {{ dashboard.max_amount_planning_week }}</h4>
                            <progress :value="dashboard.used_weekly_planning"
                                :max="dashboard.max_amount_planning_week"></progress>
                        </span>
                    </div>
                    <button type="button">Planejar</button>
                </div>

                <div class="planningInfoContainer">
                    <div>
                        <img src="../../assets/cracha_yellow.png" />
                    </div>
                    <div class="planningDetailsContainer">
                        <h2>Planejamento diario</h2>
                        <span>
                            <h4>{{ dashboard.used_daily_planning }} / {{ dashboard.max_amount_planning_daily }}</h4>
                            <progress :value="dashboard.used_daily_planning"
                                :max="dashboard.max_amount_planning_daily"></progress>
                        </span>
                    </div>
                    <button type="button">Planejar</button>
                </div>
            </aside>
        </section>
        <section class="aditionalInformationsContainer">
            <span>
                <h2>Duvidas sobre o pagamento ?</h2>
                <button type="button">Confirir pagamentos</button>
            </span>
            <img src="../../assets/bills_dino.png" />
        </section>
    </div>
</template>

<style lang="scss" scoped src="../../styles/contents/homecontent.style.scss" />
