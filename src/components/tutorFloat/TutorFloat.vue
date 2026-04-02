<script lang="ts" setup>
import "driver.js/dist/driver.css";
import { inject } from "vue";
import { useI18n } from "vue-i18n";
import { driver } from "driver.js";
import type { IPageContent } from "../../interfaces/pageContents.interface";
import type { ITutorStep } from "../../interfaces/tutor.interface";
import type { IHamburgueMenuToggleContext } from "../../interfaces/context/hamburgueMenuToggle.interface";
import type { IPlanningTypeContext } from "../../interfaces/context/planningType.interface";

const { t } = useI18n();
const { currentContent } = defineProps<{
    currentContent: IPageContent["contents"];
}>();
const { handleHamburgueMenuToggle }: IHamburgueMenuToggleContext = inject(
    "hamburgueMenuToggle",
) as IHamburgueMenuToggleContext;
const { planningType } = inject("planningType") as IPlanningTypeContext;

const tf = (key: string) => t(`tutorFloat.tutor.${key}`);

const drive = () => {
    const tutorSteps = () => {
        const widthDoc = window.innerWidth;

        switch (currentContent) {
            case "home":
                if (widthDoc > 620) {
                    return [
                        {
                            element: "#fullContentContainer",
                            popover: {
                                title: tf("home.welcome"),
                                description: tf("home.startTutorial"),
                            },
                        },
                        {
                            element: "#navbarContainer",
                            popover: {
                                title: tf("home.navigation"),
                                description: tf("home.navigationDescription"),
                            },
                        },
                        {
                            element: "#navbarProfile",
                            popover: {
                                title: tf("home.profile"),
                                description: tf("home.profileDescription"),
                            },
                        },
                        {
                            element: "#navbarPlans",
                            popover: {
                                title: tf("home.plans"),
                                description: tf("home.plansDescription"),
                            },
                        },
                        {
                            element: "#navbarPlannings",
                            popover: {
                                title: tf("home.plannings"),
                                description: tf("home.planningsDescription"),
                            },
                        },
                        {
                            element: "#navbarDesign",
                            popover: {
                                title: tf("home.create"),
                                description: tf("home.createDescription"),
                            },
                        },
                        {
                            element: "#tutorialContent",
                            popover: {
                                title: tf("home.tutorial"),
                                description: tf("home.tutorialDescription"),
                            },
                        },
                        {
                            element: "#initialHomeContent",
                            popover: {
                                title: tf("home.generalInfo"),
                                description: tf("home.generalInfoDescription"),
                            },
                        },
                        {
                            element: "#supportContainer",
                            popover: {
                                title: tf("home.support"),
                                description: tf("home.supportDescription"),
                            },
                        },
                        {
                            element: "#tutorFloatIcon",
                            popover: {
                                title: tf("home.tutorFloat"),
                                description: tf("home.tutorFloatDescription"),
                            },
                        },
                    ] as Array<ITutorStep>;
                }

                return [
                    {
                        element: "#fullContentContainer",
                        popover: {
                            title: tf("home.welcome"),
                            description: tf("home.startTutorial"),
                        },
                    },
                    {
                        element: "#navbarContainer",
                        popover: {
                            title: tf("home.navigation"),
                            description: tf("home.navigationDescription"),
                            onNextClick: () => {
                                handleHamburgueMenuToggle(true);
                                driverObj.moveNext();
                            },
                        },
                    },
                    {
                        element: "#navbarControlsMobile",
                        popover: {
                            title: tf("home.hamburgerMenu"),
                            description: tf("home.hamburgerMenuDescription"),
                        },
                    },
                    {
                        element: "#navbarProfile",
                        popover: {
                            title: tf("home.profile"),
                            description: tf("home.profileDescription"),
                        },
                    },
                    {
                        element: "#navbarPlans",
                        popover: {
                            title: tf("home.plans"),
                            description: tf("home.plansDescription"),
                        },
                    },
                    {
                        element: "#navbarPlannings",
                        popover: {
                            title: tf("home.plannings"),
                            description: tf("home.planningsDescription"),
                        },
                    },
                    {
                        element: "#navbarDesign",
                        popover: {
                            title: tf("home.create"),
                            description: tf("home.createDescription"),
                            onNextClick: () => {
                                handleHamburgueMenuToggle(false);
                                driverObj.moveNext();
                            },
                        },
                    },
                    {
                        element: "#tutorialContent",
                        popover: {
                            title: tf("home.tutorial"),
                            description: tf("home.tutorialDescription"),
                        },
                    },
                    {
                        element: "#initialHomeContent",
                        popover: {
                            title: tf("home.generalInfo"),
                            description: tf("home.generalInfoDescription"),
                        },
                    },
                    {
                        element: "#supportContainer",
                        popover: {
                            title: tf("home.support"),
                            description: tf("home.supportDescription"),
                        },
                    },
                    {
                        element: "#tutorFloatIcon",
                        popover: {
                            title: tf("home.tutorFloat"),
                            description: tf("home.tutorFloatDescription"),
                        },
                    },
                ] as Array<ITutorStep>;
            case "design":
                if (planningType.value === "Semanal" && widthDoc > 920) {
                    return [
                        {
                            element: "#fullContentContainer",
                            popover: {
                                title: tf("design.welcome"),
                                description: tf("design.startTutorial"),
                            },
                        },
                        {
                            element: "#planningSelect",
                            popover: {
                                title: tf("design.selectType"),
                                description: tf("design.selectTypeDescription"),
                            },
                        },
                        {
                            element: "#weeklyPlan",
                            popover: {
                                title: tf("design.planning"),
                                description: tf("design.planningDescription"),
                            },
                        },
                        {
                            element: "#weekDays",
                            popover: {
                                title: tf("design.planningDays"),
                                description: tf("design.planningDaysDescription"),
                            },
                        },
                        {
                            element: "#iconHelp",
                            popover: {
                                title: tf("design.planningProgress"),
                                description: tf("design.planningProgressDescription"),
                            },
                        },
                        {
                            element: ".iconReposition",
                            popover: {
                                title: tf("design.reposition"),
                                description: tf("design.repositionDescription"),
                            },
                        },
                        {
                            element: ".inputDescriptionText",
                            popover: {
                                title: tf("design.planningDescriptionText"),
                                description: tf("design.planningDescriptionTextDescription"),
                            },
                        },
                        {
                            element: ".timeInputStart",
                            popover: {
                                title: tf("design.startTime"),
                                description: tf("design.startTimeDescription"),
                            },
                        },
                        {
                            element: ".timeInputEnd",
                            popover: {
                                title: tf("design.endTime"),
                                description: tf("design.endTimeDescription"),
                            },
                        },
                        {
                            element: "#btnPreviousDay",
                            popover: {
                                title: tf("design.previousDay"),
                                description: tf("design.previousDayDescription"),
                            },
                        },
                        {
                            element: "#btnAddActivity",
                            popover: {
                                title: tf("design.addActivity"),
                                description: tf("design.addActivityDescription"),
                            },
                        },
                        {
                            element: "#btnForwardDay",
                            popover: {
                                title: tf("design.nextDay"),
                                description: tf("design.nextDayDescription"),
                            },
                        },
                        {
                            element: "#btnGeneratePlan",
                            popover: {
                                title: tf("design.generatePlan"),
                                description: tf("design.generatePlanDescription"),
                            },
                        },
                    ] as Array<ITutorStep>;
                } else if (
                    planningType.value === "Semanal" &&
                    widthDoc < 920 &&
                    widthDoc > 660
                ) {
                    return [
                        {
                            element: "#fullContentContainer",
                            popover: {
                                title: tf("design.welcome"),
                                description: tf("design.startTutorial"),
                            },
                        },
                        {
                            element: "#planningSelect",
                            popover: {
                                title: tf("design.selectType"),
                                description: tf("design.selectTypeDescription"),
                            },
                        },
                        {
                            element: "#weeklyPlan",
                            popover: {
                                title: tf("design.planning"),
                                description: tf("design.planningDescription"),
                            },
                        },
                        {
                            element: "#selectedDay",
                            popover: {
                                title: tf("design.planningDays"),
                                description: tf("design.planningDaysDescription"),
                            },
                        },
                        {
                            element: ".btnChangeWeekMobile",
                            popover: {
                                title: tf("design.weekChange"),
                                description: tf("design.weekChangeDescription"),
                            },
                        },
                        {
                            element: ".iconHelp",
                            popover: {
                                title: tf("design.planningProgress"),
                                description: tf("design.planningProgressDescription"),
                            },
                        },
                        {
                            element: ".iconReposition",
                            popover: {
                                title: tf("design.reposition"),
                                description: tf("design.repositionDescription"),
                            },
                        },
                        {
                            element: ".inputDescriptionText",
                            popover: {
                                title: tf("design.planningDescriptionText"),
                                description: tf("design.planningDescriptionTextDescription"),
                            },
                        },
                        {
                            element: ".timeInputStart",
                            popover: {
                                title: tf("design.startTime"),
                                description: tf("design.startTimeDescription"),
                            },
                        },
                        {
                            element: ".timeInputEnd",
                            popover: {
                                title: tf("design.endTime"),
                                description: tf("design.endTimeDescription"),
                            },
                        },
                        {
                            element: "#btnPreviousDay",
                            popover: {
                                title: tf("design.previousDay"),
                                description: tf("design.previousDayDescription"),
                            },
                        },
                        {
                            element: "#btnAddActivity",
                            popover: {
                                title: tf("design.addActivity"),
                                description: tf("design.addActivityDescription"),
                            },
                        },
                        {
                            element: "#btnForwardDay",
                            popover: {
                                title: tf("design.nextDay"),
                                description: tf("design.nextDayDescription"),
                            },
                        },
                        {
                            element: "#btnGeneratePlan",
                            popover: {
                                title: tf("design.generatePlan"),
                                description: tf("design.generatePlanDescription"),
                            },
                        },
                    ] as Array<ITutorStep>;
                } else if (planningType.value === "Semanal" && widthDoc < 660) {
                    return [
                        {
                            element: "#fullContentContainer",
                            popover: {
                                title: tf("design.welcome"),
                                description: tf("design.startTutorial"),
                            },
                        },
                        {
                            element: "#planningSelect",
                            popover: {
                                title: tf("design.selectType"),
                                description: tf("design.selectTypeDescription"),
                            },
                        },
                        {
                            element: "#weeklyPlan",
                            popover: {
                                title: tf("design.planning"),
                                description: tf("design.planningDescription"),
                            },
                        },
                        {
                            element: "#selectedDay",
                            popover: {
                                title: tf("design.planningDays"),
                                description: tf("design.planningDaysDescription"),
                            },
                        },
                        {
                            element: ".btnChangeWeekMobile",
                            popover: {
                                title: tf("design.weekChange"),
                                description: tf("design.weekChangeDescription"),
                            },
                        },
                        {
                            element: ".iconHelp",
                            popover: {
                                title: tf("design.planningProgress"),
                                description: tf("design.planningProgressDescription"),
                            },
                        },
                        {
                            element: ".buttonRepositionContainer",
                            popover: {
                                title: tf("design.repositionMobile"),
                                description: tf("design.repositionMobileDescription"),
                            },
                        },
                        {
                            element: ".inputDescriptionText",
                            popover: {
                                title: tf("design.planningDescriptionText"),
                                description: tf("design.planningDescriptionTextDescription"),
                            },
                        },
                        {
                            element: ".timeInputStart",
                            popover: {
                                title: tf("design.startTime"),
                                description: tf("design.startTimeDescription"),
                            },
                        },
                        {
                            element: ".timeInputEnd",
                            popover: {
                                title: tf("design.endTime"),
                                description: tf("design.endTimeDescription"),
                            },
                        },
                        {
                            element: "#btnPreviousDay",
                            popover: {
                                title: tf("design.previousDay"),
                                description: tf("design.previousDayDescription"),
                            },
                        },
                        {
                            element: "#btnAddActivity",
                            popover: {
                                title: tf("design.addActivity"),
                                description: tf("design.addActivityDescription"),
                            },
                        },
                        {
                            element: "#btnForwardDay",
                            popover: {
                                title: tf("design.nextDay"),
                                description: tf("design.nextDayDescription"),
                            },
                        },
                        {
                            element: "#btnGeneratePlan",
                            popover: {
                                title: tf("design.generatePlan"),
                                description: tf("design.generatePlanDescription"),
                            },
                        },
                    ] as Array<ITutorStep>;
                } else if (planningType.value === "Diario" && widthDoc > 825) {
                    return [
                        {
                            element: "#fullContentContainer",
                            popover: {
                                title: tf("design.welcome"),
                                description: tf("design.startTutorial"),
                            },
                        },
                        {
                            element: "#planningSelect",
                            popover: {
                                title: tf("design.selectType"),
                                description: tf("design.selectTypeDescription"),
                            },
                        },
                        {
                            element: ".dailyPlanContentContainer",
                            popover: {
                                title: tf("design.planning"),
                                description: tf("design.planningDescription"),
                            },
                        },
                        {
                            element: ".iconReposition",
                            popover: {
                                title: tf("design.repositionDrag"),
                                description: tf("design.repositionDragDescription"),
                            },
                        },
                        {
                            element: ".dailyInputDesign",
                            popover: {
                                title: tf("design.planning"),
                                description: tf("design.planningDescription"),
                            },
                        },
                        {
                            element: ".timeInputStart",
                            popover: {
                                title: tf("design.startTime"),
                                description: tf("design.startTimeDescription"),
                            },
                        },
                        {
                            element: ".timeInputEnd",
                            popover: {
                                title: tf("design.endTimeAlt"),
                                description: tf("design.endTimeAltDescription"),
                            },
                        },
                        {
                            element: ".btnAddClassAtv",
                            popover: {
                                title: tf("design.addActivity"),
                                description: tf("design.addActivityDescription"),
                            },
                        },
                        {
                            element: "#btnDiaryGenerate",
                            popover: {
                                title: tf("design.generateDaily"),
                                description: tf("design.generateDailyDescription"),
                            },
                        },
                    ];
                }

                return [
                    {
                        element: "#fullContentContainer",
                        popover: {
                            title: tf("design.welcome"),
                            description: tf("design.startTutorial"),
                        },
                    },
                    {
                        element: "#planningSelect",
                        popover: {
                            title: tf("design.selectType"),
                            description: tf("design.selectTypeDescription"),
                        },
                    },
                    {
                        element: ".dailyPlanContentContainer",
                        popover: {
                            title: tf("design.planning"),
                            description: tf("design.planningDescription"),
                        },
                    },
                    {
                        element: ".buttonRepositionContainer",
                        popover: {
                            title: tf("design.repositionButtons"),
                            description: tf("design.repositionButtonsDescription"),
                        },
                    },
                    {
                        element: ".dailyInputDesign",
                        popover: {
                            title: tf("design.planning"),
                            description: tf("design.planningDescription"),
                        },
                    },
                    {
                        element: ".timeInputStart",
                        popover: {
                            title: tf("design.startTime"),
                            description: tf("design.startTimeDescription"),
                        },
                    },
                    {
                        element: ".timeInputEnd",
                        popover: {
                            title: tf("design.endTimeAlt"),
                            description: tf("design.endTimeAltDescription"),
                        },
                    },
                    {
                        element: ".btnAddClassAtv",
                        popover: {
                            title: tf("design.addActivity"),
                            description: tf("design.addActivityDescription"),
                        },
                    },
                    {
                        element: "#btnDiaryGenerate",
                        popover: {
                            title: tf("design.generateDaily"),
                            description: tf("design.generateDailyDescription"),
                        },
                    },
                ];
            case "planning_list":
                return [
                    {
                        element: "#fullContentContainer",
                        popover: {
                            title: tf("planning_list.welcome"),
                            description: tf("planning_list.startTutorial"),
                        },
                    },
                    {
                        element: ".searchFormContainer",
                        popover: {
                            title: tf("planning_list.searchForm"),
                            description: tf("planning_list.searchFormDescription"),
                        },
                    },
                    {
                        element: ".notFoundContainer",
                        popover: {
                            title: tf("planning_list.noResults"),
                            description: tf("planning_list.noResultsDescription"),
                        },
                    },
                    {
                        element: "#fullTablePlanningList",
                        popover: {
                            title: tf("planning_list.planningList"),
                            description: tf("planning_list.planningListDescription"),
                        },
                    },
                    {
                        element: ".btnCellDownload",
                        popover: {
                            title: tf("planning_list.downloadPlanning"),
                            description: tf("planning_list.downloadPlanningDescription"),
                        },
                    },
                    {
                        element: ".btnCellEdit",
                        popover: {
                            title: tf("planning_list.editPlanning"),
                            description: tf("planning_list.editPlanningDescription"),
                        },
                    },
                    {
                        element: ".btnCellRemove",
                        popover: {
                            title: tf("planning_list.removePlanning"),
                            description: tf("planning_list.removePlanningDescription"),
                        },
                    },
                    {
                        element: ".loadMoreCell",
                        popover: {
                            title: tf("planning_list.loadMore"),
                            description: tf("planning_list.loadMoreDescription"),
                        },
                    },
                ] as Array<ITutorStep>;
            case "plan":
                return [
                    {
                        element: "#fullContentContainer",
                        popover: {
                            title: tf("plan.welcome"),
                            description: tf("plan.startTutorial"),
                        },
                    },
                    {
                        element: ".currentPlanContainer",
                        popover: {
                            title: tf("plan.planInfo"),
                            description: tf("plan.planInfoDescription"),
                        },
                    },
                    {
                        element: "#planName",
                        popover: {
                            title: tf("plan.planName"),
                            description: tf("plan.planNameDescription"),
                        },
                    },
                    {
                        element: "#nextBilling",
                        popover: {
                            title: tf("plan.nextBilling"),
                            description: tf("plan.nextBillingDescription"),
                        },
                    },
                    {
                        element: "#planPrice",
                        popover: {
                            title: tf("plan.planPrice"),
                            description: tf("plan.planPriceDescription"),
                        },
                    },
                    {
                        element: "#planStatus",
                        popover: {
                            title: tf("plan.planStatus"),
                            description: tf("plan.planStatusDescription"),
                        },
                    },
                    {
                        element: "#planCard",
                        popover: {
                            title: tf("plan.creditCard"),
                            description: tf("plan.creditCardDescription"),
                        },
                    },
                    {
                        element: "#planChangeCard",
                        popover: {
                            title: tf("plan.changeCard"),
                            description: tf("plan.changeCardDescription"),
                        },
                    },
                    {
                        element: "#planChangePlan",
                        popover: {
                            title: tf("plan.changePlan"),
                            description: tf("plan.changePlanDescription"),
                        },
                    },
                    {
                        element: "#planCancelPlan",
                        popover: {
                            title: tf("plan.cancelPlan"),
                            description: tf("plan.cancelPlanDescription"),
                        },
                    },
                    {
                        element: ".paymentHistoryListContainer",
                        popover: {
                            title: tf("plan.paymentHistory"),
                            description: tf("plan.paymentHistoryDescription"),
                        },
                    },
                ] as Array<ITutorStep>;
            case "profile":
                return [
                    {
                        element: ".profileContainer",
                        popover: {
                            title: tf("profile.profile"),
                            description: tf("profile.profileDescription"),
                        },
                    },
                    {
                        element: "#fullNameInputText",
                        popover: {
                            title: tf("profile.fullName"),
                            description: tf("profile.fullNameDescription"),
                        },
                    },
                    {
                        element: "#githubEmailInserted",
                        popover: {
                            title: tf("profile.githubEmail"),
                            description: tf("profile.githubEmailDescription"),
                        },
                    },
                    {
                        element: "#googleEmailInserted",
                        popover: {
                            title: tf("profile.googleEmail"),
                            description: tf("profile.googleEmailDescription"),
                        },
                    },
                    {
                        element: "#cellphoneInserted",
                        popover: {
                            title: tf("profile.cellphone"),
                            description: tf("profile.cellphoneDescription"),
                        },
                    },
                    {
                        element: "#updateInformations",
                        popover: {
                            title: tf("profile.updateInfo"),
                            description: tf("profile.updateInfoDescription"),
                        },
                    },
                    {
                        element: ".profileAdditionalDetails",
                        popover: {
                            title: tf("profile.additionalDetails"),
                            description: tf("profile.additionalDetailsDescription"),
                        },
                    },
                    {
                        element: "#validateEmail",
                        popover: {
                            title: tf("profile.validateEmail"),
                            description: tf("profile.validateEmailDescription"),
                        },
                    },
                    {
                        element: ".appSettings",
                        popover: {
                            title: tf("profile.settings"),
                            description: tf("profile.settingsDescription"),
                        },
                    },
                    {
                        element: "#languageSettings",
                        popover: {
                            title: tf("profile.languageSettings"),
                            description: tf("profile.languageSettingsDescription"),
                        },
                    },
                    {
                        element: "#themeSettings",
                        popover: {
                            title: tf("profile.themeSettings"),
                            description: tf("profile.themeSettingsDescription"),
                        },
                    },
                    {
                        element: "#documentationView",
                        popover: {
                            title: tf("profile.documentation"),
                            description: tf("profile.documentationDescription"),
                        },
                    },
                    {
                        element: "#helpView",
                        popover: {
                            title: tf("profile.helpSupport"),
                            description: tf("profile.helpSupportDescription"),
                        },
                    },
                    {
                        element: "#logoutView",
                        popover: {
                            title: tf("profile.logout"),
                            description: tf("profile.logoutDescription"),
                        },
                    },
                ] as Array<ITutorStep>;
            default:
                return [
                    {
                        element: "#fullContentContainer",
                        popover: {
                            title: tf("default.welcome"),
                            description: tf("default.startTutorial"),
                        },
                    },
                    {
                        element: ".logoContainer",
                        popover: {
                            title: tf("default.homePage"),
                            description: tf("default.homePageDescription"),
                        },
                    },
                ] as Array<ITutorStep>;
        }
    };

    const driverObj = driver({
        showProgress: true,
        steps: tutorSteps(),
    });
    driverObj.drive();
};
</script>

<template>
    <div class="tutor-float">
        <i
            id="tutorFloatIcon"
            class="pi pi-graduation-cap icon"
            @click="drive()"
        ></i>
    </div>
</template>

<style src="./tutorfloat.style.scss" />
