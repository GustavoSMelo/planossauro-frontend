<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import { useDark } from "@vueuse/core";
import backendApi from "../../api/api";
import type { ILoadingContext } from "../../interfaces/context/loading.interface";
import type { IDashboard } from "../../interfaces/dashboard.interface";
import type { IPageContent } from "../../interfaces/pageContents.interface";
import type { IPlanningTypeContext } from "../../interfaces/context/planningType.interface";

const { handleChangeCurrentContent } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent["contents"]) => void;
    handleOpenTutorialVideo: (opens: boolean) => void;
}>();

const isDark = useDark({
    attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
});

const dashboard = ref<IDashboard>({} as IDashboard);
const { handleChangeIsLoading } = inject("isLoading") as ILoadingContext;
const { handleChangePlanningType } = inject(
    "planningType",
) as IPlanningTypeContext;

const handleGetPercentual = (usedTokens: number, maxTokens: number): number => {
    return Math.round((usedTokens / maxTokens) * 100);
};

const handleGetDashboardInformation = async () => {
    try {
        handleChangeIsLoading(true);
        const uuid = JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid;
        const response = (
            await backendApi.get(`/subscription/dashboard/${uuid}`)
        ).data as IDashboard;

        dashboard.value = { ...response };
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
    <div class="homeContentContainer" id="homeContentContainer">
        <h1>{{ $t("home.homePage") }}</h1>
        <section
            id="tutorialContent"
            class="tutorialContent"
            :data-theme="isDark ? 'dark' : 'light'"
        >
            <img src="../../assets/tutor_dino.png" alt="tutorial" />

            <span>
                <h2>{{ $t("home.difficultiesUsingSystem") }}</h2>
                <button type="button" @click="handleOpenTutorialVideo(true)">
                    {{ $t("home.watchTutorial") }}
                </button>
            </span>
        </section>
        <section id="initialHomeContent" class="initialHomeContent">
            <div
                class="planInfoContainer"
                :data-theme="isDark ? 'dark' : 'light'"
            >
                <h1>{{ $t("home.currentPlan") }}</h1>

                <img
                    v-if="dashboard.current_plan === 'free'"
                    src="../../assets/profileDino.png"
                    alt="dino from plan"
                />
                <img
                    v-else-if="dashboard.current_plan === 'essential'"
                    src="../../assets/dino_party.png"
                    alt="dino from plan"
                />
                <img
                    v-else
                    src="../../assets/dino_premium.png"
                    alt="dino from plan"
                />
                <h2>{{ dashboard.current_plan }}</h2>
                <button
                    type="button"
                    @click="handleChangeCurrentContent('plan')"
                >
                    {{ $t("home.currentPlan") }}
                </button>
            </div>

            <aside class="fullColumnContentContainer">
                <h2 class="planningInfoTitle">
                    {{ $t("home.planningInformations") }}
                </h2>
                <div
                    :data-theme="isDark ? 'dark' : 'light'"
                    class="planningInfoContainer firstPlanningInfoContainer"
                >
                    <div
                        v-if="
                            handleGetPercentual(
                                dashboard.used_weekly_planning,
                                dashboard.max_amount_planning_week,
                            ) < 50
                        "
                    >
                        <img src="../../assets/tablet_green.png" />
                    </div>
                    <div
                        v-else-if="
                            handleGetPercentual(
                                dashboard.used_weekly_planning,
                                dashboard.max_amount_planning_week,
                            ) >= 50 &&
                            handleGetPercentual(
                                dashboard.used_weekly_planning,
                                dashboard.max_amount_planning_week,
                            ) < 90
                        "
                    >
                        <img src="../../assets/cracha_yellow.png" />
                    </div>
                    <div v-else>
                        <img src="../../assets/sad_sleep_blue.png" />
                    </div>
                    <div class="planningDetailsContainer">
                        <h2>{{ $t("home.weeklyPlannings") }}</h2>
                        <span>
                            <h4>
                                {{ dashboard.used_weekly_planning }} /
                                {{ dashboard.max_amount_planning_week }}
                            </h4>
                            <progress
                                :value="dashboard.used_weekly_planning"
                                :max="dashboard.max_amount_planning_week"
                            ></progress>
                        </span>
                    </div>
                    <button
                        type="button"
                        @click="
                            handleChangePlanningType('Semanal');
                            handleChangeCurrentContent('design');
                        "
                    >
                        {{ $t("home.design") }}
                    </button>
                </div>

                <div
                    class="planningInfoContainer"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    <div
                        v-if="
                            handleGetPercentual(
                                dashboard.used_daily_planning,
                                dashboard.max_amount_planning_daily,
                            ) < 50
                        "
                    >
                        <img src="../../assets/tablet_green.png" />
                    </div>
                    <div
                        v-else-if="
                            handleGetPercentual(
                                dashboard.used_daily_planning,
                                dashboard.max_amount_planning_daily,
                            ) >= 50 &&
                            handleGetPercentual(
                                dashboard.used_weekly_planning,
                                dashboard.max_amount_planning_week,
                            ) < 90
                        "
                    >
                        <img src="../../assets/cracha_yellow.png" />
                    </div>
                    <div v-else>
                        <img src="../../assets/sad_sleep_blue.png" />
                    </div>
                    <div class="planningDetailsContainer">
                        <h2>{{ $t("home.dailyPlannings") }}</h2>
                        <span>
                            <h4>
                                {{ dashboard.used_daily_planning }} /
                                {{ dashboard.max_amount_planning_daily }}
                            </h4>
                            <progress
                                :value="dashboard.used_daily_planning"
                                :max="dashboard.max_amount_planning_daily"
                            ></progress>
                        </span>
                    </div>
                    <button
                        type="button"
                        @click="
                            handleChangePlanningType('Diario');
                            handleChangeCurrentContent('design');
                        "
                    >
                        {{ $t("home.design") }}
                    </button>
                </div>
            </aside>
        </section>
        <!-- <section
            class="aditionalInformationsContainer"
            :data-theme="isDark ? 'dark' : 'light'"
        >
            <span>
                <h2>{{ $t("home.paymentDoubt") }}</h2>
                <button
                    type="button"
                    @click="handleChangeCurrentContent('plan')"
                >
                    {{ $t("home.checkPayments") }}
                </button>
            </span>
            <img src="../../assets/bills_dino.png" />
        </section> -->

        <section
            class="supportContainer"
            id="supportContainer"
            :data-theme="isDark ? 'dark' : 'light'"
        >
            <span>
                <h2>{{ $t("home.support") }}</h2>
                <button
                    type="button"
                    @click="handleChangeCurrentContent('support')"
                >
                    {{ $t("home.supportBtn") }}
                </button>
            </span>
            <img src="../../assets/DinoSupport.png" />
        </section>
    </div>
</template>

<style lang="scss" scoped src="../../styles/contents/homecontent.style.scss" />
