<script setup lang="ts">

import { inject, ref } from 'vue';
import Navbar from '../components/navbar/Navbar.vue';
import HomeContent from './contents/HomeContent.vue';
import PlanningContent from './contents/PlanningContent.vue';
import NavbarMobile from '../components/navbarMobile/NavbarMobile.vue';
import PlanningListContent from './contents/PlanningListContent.vue';
import type { IPageContent } from '../interfaces/pageContents.interface';
import type { IHamburgueMenuToggleContext } from '../interfaces/context/hamburgueMenuToggle.interface';
import EditPlanningContent from './contents/EditPlanningContent.vue';
import RemovePlanningContent from './contents/RemovePlanningContent.vue';
import ProfileContent from './contents/ProfileContent.vue';
import ValidationCodeInputBox from '../components/validationCodeInputBox/ValidationCodeInputBox.vue';
import type { ILoginType } from '../interfaces/loginType.interface';
import PlanContent from './contents/PlanContent.vue';

const currentContent = ref<IPageContent['contents']>('home');
const validationLoginType = ref<ILoginType['types']>('github');

const handleChangeCurrentContent = (newValue: IPageContent['contents']) => {
    currentContent.value = newValue;
};

const handleChangeValidationLoginType = (newValue: ILoginType['types']) => {
    validationLoginType.value = newValue;
};

const { hamburgueMenuToggle } = inject('hamburgueMenuToggle') as IHamburgueMenuToggleContext;
</script>
<template>
    <NavbarMobile v-if="hamburgueMenuToggle === true" :current-content="currentContent"
        :handle-change-current-content="handleChangeCurrentContent" />
    <main class="appPageContainer">
        <div class="fullContentContainer">
            <Navbar :handle-change-current-content="handleChangeCurrentContent" :current-content="currentContent" />

            <HomeContent v-if="currentContent === 'home'" />
            <PlanningContent v-else-if="currentContent === 'planning'" />
            <PlanningListContent v-else-if="currentContent === 'planning_list'"
                :handle-change-current-content="handleChangeCurrentContent" />
            <EditPlanningContent v-else-if="currentContent === 'edit_planning'"
                :handle-change-current-content="handleChangeCurrentContent" />
            <PlanContent v-else-if="currentContent === 'plan'" />
            <RemovePlanningContent v-else-if="currentContent === 'remove_planning'"
                :handle-change-current-content="handleChangeCurrentContent" />
            <ProfileContent :handle-change-current-content="handleChangeCurrentContent"
                :handle-change-validation-login-type="handleChangeValidationLoginType"
                v-else-if="currentContent === 'profile'" />
            <ValidationCodeInputBox v-else-if="currentContent === 'validation_code'"
                :validation-login-type="validationLoginType"
                :handle-change-current-content="handleChangeCurrentContent" />
        </div>
    </main>
</template>
<style lang="scss" scoped src="../styles/apppage.style.scss" />
