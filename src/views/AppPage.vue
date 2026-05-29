<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getToken } from "../helpers/token";

import Navbar from "../components/navbar/Navbar.vue";
import HomeContent from "./contents/HomeContent.vue";
import DesignContent from "./contents/DesignContent.vue";
import NavbarMobile from "../components/navbarMobile/NavbarMobile.vue";
import PlanningListContent from "./contents/PlanningListContent.vue";
import EditPlanningContent from "./contents/EditPlanningContent.vue";
import RemovePlanningContent from "./contents/RemovePlanningContent.vue";
import ProfileContent from "./contents/ProfileContent.vue";
import ValidationCodeInputBox from "../components/validationCodeInputBox/ValidationCodeInputBox.vue";
import PlanContent from "./contents/PlanContent.vue";
import VideoTutorial from "../components/videoTutorial/VideoTutorial.vue";
import WelcomeContainer from "../components/welcomeContainer/WelcomeContainer.vue";
import TutorFloat from "../components/tutorFloat/TutorFloat.vue";
import backendApi from "../api/api";
import EditPlanContent from "./contents/EditPlanContent.vue";
import LogoutContainer from "../components/logoutContainer/LogoutContainer.vue";
import SupportContent from "./contents/SupportContent.vue";
import StepsContent from "./contents/StepsContent.vue";

import type { IPageContent } from "../interfaces/pageContents.interface";
import type { IHamburgueMenuToggleContext } from "../interfaces/context/hamburgueMenuToggle.interface";
import type { ILoginType } from "../interfaces/loginType.interface";
import type { ILoadingContext } from "../interfaces/context/loading.interface";
import type { IUser } from "../interfaces/api/user.interface";

const showLogoutPage = ref<boolean>(false);
const showTutorialVideo = ref<boolean>(false);
const firstLogin = ref<boolean>(true);
const currentContent = ref<IPageContent["contents"]>("home");
const validationLoginType = ref<ILoginType["types"]>("github");
const { hamburgueMenuToggle } = inject(
    "hamburgueMenuToggle",
) as IHamburgueMenuToggleContext;
const { handleChangeIsLoading } = inject("isLoading") as ILoadingContext;
const router = useRouter();

const handleChangeCurrentContent = (newValue: IPageContent["contents"]) => {
    currentContent.value = newValue;
    history.pushState({ content: newValue }, "", "");
};

const handleChangeValidationLoginType = (newValue: ILoginType["types"]) => {
    validationLoginType.value = newValue;
};

const handleCloseFirstLogin = () => {
    firstLogin.value = false;
};

const handleChangeLogoutPage = (newValue: boolean) => {
    showLogoutPage.value = newValue;
};

const handleGetInformations = async () => {
    try {
        const token = getToken();
        const uuid = JSON.parse(sessionStorage.getItem("user") ?? "").uuid;
        const user = sessionStorage.getItem("user") ?? "";

        if (!user || !user.length || user === null)
            return router.push("/unauthorizated");
        if (!token && !uuid) return router.push("/unauthorizated");

        const userInfo: IUser = JSON.parse(user);

        if (userInfo.deleted_at) return router.push("/callback/user/delete");

        handleChangeIsLoading(true);
        await backendApi.get(`/user/${uuid}`);
        handleChangeIsLoading(false);
    } catch {
        handleChangeIsLoading(false);
        router.push("/unauthorizated");
    }
};

const removeSessionStorageItems = () => {
    sessionStorage.removeItem("googleId");
    sessionStorage.removeItem("googleEmail");
    sessionStorage.removeItem("githubId");
    sessionStorage.removeItem("githubEmail");
    sessionStorage.removeItem("fullName");
    sessionStorage.removeItem("facebookAccessToken");
};

const handleOpenTutorialVideo = (opens: boolean) => {
    showTutorialVideo.value = opens;
};

const checkIfIsFirstLogin = (): void => {
    const showWelcomePage = localStorage.getItem("showWelcomePage");

    if (showWelcomePage === "false") {
        firstLogin.value = false;
    }
};

onMounted(() => {
    handleGetInformations();
    removeSessionStorageItems();
    checkIfIsFirstLogin();

    window.addEventListener("popstate", (event) => {
        if (event.state?.content) {
            currentContent.value = event.state.content;
        }
    });
});
</script>
<template>
    <NavbarMobile
        v-if="hamburgueMenuToggle === true"
        :current-content="currentContent"
        :handle-change-current-content="handleChangeCurrentContent"
        :handle-change-logout-page="handleChangeLogoutPage"
    />
    <VideoTutorial
        v-if="showTutorialVideo"
        :handle-open-tutorial-video="handleOpenTutorialVideo"
    />
    <WelcomeContainer
        v-if="firstLogin"
        :handle-close-first-login="handleCloseFirstLogin"
        :handle-open-tutorial-video="handleOpenTutorialVideo"
    />
    <LogoutContainer
        v-if="showLogoutPage"
        :handle-change-logout-page="handleChangeLogoutPage"
    />
    <main class="appPageContainer" id="appPageContainer">
        <div class="fullContentContainer" id="fullContentContainer">
            <Navbar
                :handle-change-current-content="handleChangeCurrentContent"
                :current-content="currentContent"
                :handle-change-logout-page="handleChangeLogoutPage"
            />

            <HomeContent
                v-if="currentContent === 'home'"
                :handle-change-current-content="handleChangeCurrentContent"
                :handle-open-tutorial-video="handleOpenTutorialVideo"
            />
            <DesignContent v-else-if="currentContent === 'design'" />
            <PlanningListContent
                v-else-if="currentContent === 'planning_list'"
                :handle-change-current-content="handleChangeCurrentContent"
            />
            <EditPlanningContent
                v-else-if="currentContent === 'edit_planning'"
                :handle-change-current-content="handleChangeCurrentContent"
            />
            <PlanContent
                :handle-change-current-content="handleChangeCurrentContent"
                v-else-if="currentContent === 'plan'"
            />
            <RemovePlanningContent
                v-else-if="currentContent === 'remove_planning'"
                :handle-change-current-content="handleChangeCurrentContent"
            />
            <ProfileContent
                :handle-change-current-content="handleChangeCurrentContent"
                :handle-change-validation-login-type="
                    handleChangeValidationLoginType
                "
                v-else-if="currentContent === 'profile'"
            />
            <ValidationCodeInputBox
                v-else-if="currentContent === 'validation_code'"
                :validation-login-type="validationLoginType"
                :handle-change-current-content="handleChangeCurrentContent"
            />
            <EditPlanContent
                v-else-if="currentContent === 'edit_plan'"
                :handle-change-current-content="handleChangeCurrentContent"
            />
            <SupportContent
                v-else-if="currentContent === 'support'"
                :handle-change-current-content="handleChangeCurrentContent"
            />
            <StepsContent
                v-else-if="currentContent === 'steps'"
                :handle-change-current-content="handleChangeCurrentContent"
            />
        </div>

        <TutorFloat :current-content="currentContent" />
    </main>
</template>
<style lang="scss" scoped src="../styles/apppage.style.scss" />
