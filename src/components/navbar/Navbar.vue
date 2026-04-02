<script lang="ts" setup>
import { inject } from "vue";
import type { IPageContent } from "../../interfaces/pageContents.interface";
import type { IHamburgueMenuToggleContext } from "../../interfaces/context/hamburgueMenuToggle.interface";

const { handleChangeCurrentContent, currentContent, handleChangeLogoutPage } =
    defineProps<{
        handleChangeCurrentContent: (
            newValue: IPageContent["contents"],
        ) => void;
        currentContent: IPageContent["contents"];
        handleChangeLogoutPage: (newValue: boolean) => void;
    }>();
const hamburgerMenuContext: IHamburgueMenuToggleContext = inject(
    "hamburgueMenuToggle",
) as IHamburgueMenuToggleContext;
</script>
<template>
    <nav class="navbarContainer" id="navbarContainer">
        <figure
            class="logoContainer"
            @click="handleChangeCurrentContent('home')"
        >
            <img src="../../assets/DinoLogo.svg" />
            <figcaption>Planossauro</figcaption>
        </figure>

        <ul class="navbarControls" id="navbarControls">
            <li
                id="navbarDesign"
                @click="handleChangeCurrentContent('design')"
                :class="[currentContent == 'design' ? 'choosed' : 'btnNavbar']"
            >
                {{ $t("navbar.design") }}
            </li>
            <li
                id="navbarPlannings"
                @click="handleChangeCurrentContent('planning_list')"
                :class="[
                    currentContent == 'planning_list' ? 'choosed' : 'btnNavbar',
                ]"
            >
                {{ $t("navbar.plannings") }}
            </li>
            <li
                id="navbarPlans"
                @click="handleChangeCurrentContent('plan')"
                :class="[currentContent == 'plan' ? 'choosed' : 'btnNavbar']"
            >
                {{ $t("navbar.plans") }}
            </li>
            <li
                id="navbarProfile"
                @click="handleChangeCurrentContent('profile')"
                :class="[currentContent == 'profile' ? 'choosed' : 'btnNavbar']"
            >
                {{ $t("navbar.profile") }}
            </li>
            <li :class="['btnNavbar']" @click="handleChangeLogoutPage(true)">
                {{ $t("navbar.logout") }}
            </li>
            <li class="mobileIcon">
                <i
                    class="pi pi-bars"
                    @click="
                        hamburgerMenuContext.handleHamburgueMenuToggle(true)
                    "
                ></i>
            </li>
        </ul>
    </nav>
</template>

<style scoped src="./navbar.style.scss" lang="scss" />
