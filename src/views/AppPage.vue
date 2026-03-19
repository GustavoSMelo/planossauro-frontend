<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getToken } from "../helpers/token";
import Navbar from "../components/navbar/Navbar.vue";
import HomeContent from "./contents/HomeContent.vue";
import PlanningContent from "./contents/PlanningContent.vue";
import NavbarMobile from "../components/navbarMobile/NavbarMobile.vue";
import PlanningListContent from "./contents/PlanningListContent.vue";
import EditPlanningContent from "./contents/EditPlanningContent.vue";
import RemovePlanningContent from "./contents/RemovePlanningContent.vue";
import ProfileContent from "./contents/ProfileContent.vue";
import ValidationCodeInputBox from "../components/validationCodeInputBox/ValidationCodeInputBox.vue";
import PlanContent from "./contents/PlanContent.vue";
import backendApi from "../api/api";
import type { IPageContent } from "../interfaces/pageContents.interface";
import type { IHamburgueMenuToggleContext } from "../interfaces/context/hamburgueMenuToggle.interface";
import type { ILoginType } from "../interfaces/loginType.interface";
import type { ILoadingContext } from "../interfaces/context/loading.interface";
import EditPlanContent from "./contents/EditPlanContent.vue";
import type { IUser } from "../interfaces/api/user.interface";

const currentContent = ref<IPageContent["contents"]>("home");
const validationLoginType = ref<ILoginType["types"]>("github");
const { hamburgueMenuToggle } = inject(
    "hamburgueMenuToggle",
) as IHamburgueMenuToggleContext;
const { handleChangeIsLoading } = inject("isLoading") as ILoadingContext;
const router = useRouter();

const handleChangeCurrentContent = (newValue: IPageContent["contents"]) => {
    currentContent.value = newValue;
};

const handleChangeValidationLoginType = (newValue: ILoginType["types"]) => {
    validationLoginType.value = newValue;
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
};

onMounted(() => {
    handleGetInformations();
    removeSessionStorageItems();
});
</script>
<template>
    <NavbarMobile
        v-if="hamburgueMenuToggle === true"
        :current-content="currentContent"
        :handle-change-current-content="handleChangeCurrentContent"
    />
    <main class="appPageContainer">
        <div class="fullContentContainer">
            <Navbar
                :handle-change-current-content="handleChangeCurrentContent"
                :current-content="currentContent"
            />

            <HomeContent
                v-if="currentContent === 'home'"
                :handle-change-current-content="handleChangeCurrentContent"
            />
            <PlanningContent v-else-if="currentContent === 'planning'" />
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
        </div>
    </main>
</template>
<style lang="scss" scoped src="../styles/apppage.style.scss" />
