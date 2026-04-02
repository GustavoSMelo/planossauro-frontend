<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import type { IHamburgueMenuToggleContext } from "../../interfaces/context/hamburgueMenuToggle.interface";
import type { IPageContent } from "../../interfaces/pageContents.interface";
import backendApi from "../../api/api";
import type {
    IPlan,
    ISubscription,
} from "../../interfaces/subscription.interface";

const { handleChangeCurrentContent, currentContent, handleChangeLogoutPage } =
    defineProps<{
        handleChangeCurrentContent: (
            newValue: IPageContent["contents"],
        ) => void;
        currentContent: IPageContent["contents"];
        handleChangeLogoutPage: (newValue: boolean) => void;
    }>();
const planName = ref("free");
const { handleHamburgueMenuToggle } = inject(
    "hamburgueMenuToggle",
) as IHamburgueMenuToggleContext;

const logout = () => {
    handleRemoveMenuHamburguer();
    handleChangeLogoutPage(true);
};

const getPlan = async () => {
    const uuid = JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid;
    const subscription = (await backendApi.get(`/subscription/${uuid}`)).data
        .subscription as ISubscription;
    const selectedPlan = (
        await backendApi.get(`/plans/${subscription.plans_id}`)
    ).data as IPlan;
    planName.value = selectedPlan.plan_name;
};

const handleRemoveMenuHamburguer = () => {
    const hamburgerMenu = window.document.querySelector(".hamburgerMenu");
    hamburgerMenu?.classList.add("menuCloseAnimation");

    setTimeout(() => {
        hamburgerMenu?.classList.remove("menuCloseAnimation");
        handleHamburgueMenuToggle(false);
    }, 500);
};

const handleChangeMobilePage = (page: IPageContent["contents"]) => {
    handleChangeCurrentContent(page);
    handleRemoveMenuHamburguer();
};

onMounted(() => {
    getPlan();
});
</script>

<template>
    <div class="navbarControlsMobile">
        <span class="blur" @click="handleRemoveMenuHamburguer"></span>
        <ul class="hamburgerMenu">
            <li @click="handleChangeMobilePage('home')">
                <img src="../../assets/DinoLogo.svg" />
                <h4>Planossauro</h4>
            </li>
            <li class="planInfo">Plano {{ planName }}</li>
            <hr />
            <li
                id="navbarDesign"
                @click="handleChangeMobilePage('design')"
                :class="[
                    currentContent === 'design' ? 'choosed' : '',
                    'btnNavbar',
                ]"
            >
                {{ $t("navbar.design") }}
            </li>
            <li
                id="navbarPlannings"
                @click="handleChangeMobilePage('planning_list')"
                :class="[
                    currentContent === 'planning_list' ? 'choosed' : '',
                    'btnNavbar',
                ]"
            >
                {{ $t("navbar.plannings") }}
            </li>
            <li
                id="navbarPlans"
                @click="handleChangeMobilePage('plan')"
                :class="[
                    currentContent === 'plan' ? 'choosed' : '',
                    'btnNavbar',
                ]"
            >
                {{ $t("navbar.plans") }}
            </li>
            <li
                id="navbarProfile"
                @click="handleChangeMobilePage('profile')"
                :class="[
                    currentContent === 'profile' ? 'choosed' : '',
                    'btnNavbar',
                ]"
            >
                {{ $t("navbar.profile") }}
            </li>
            <li :class="['btnNavbar']" @click="logout">
                {{ $t("navbar.logout") }}
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped src="./navbarmobile.style.scss" />
