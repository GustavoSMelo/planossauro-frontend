<script setup lang="ts">

import Navbar from '../components/navbar/Navbar.vue';
import HomeContent from './contents/HomeContent.vue';
import PlanningContent from './contents/PlanningContent.vue';
import { inject, ref } from 'vue';
import type { IPageContent } from '../interfaces/pageContents.interface';
import NavbarMobile from '../components/navbarMobile/NavbarMobile.vue';
import type { IHamburgueMenuToggleContext } from '../interfaces/context/hamburgueMenuToggle.interface';

const currentContent = ref<IPageContent['contents']>('home');

const handleChangeCurrentContent = (newValue: IPageContent['contents']) => {
    currentContent.value = newValue;
};

const { hamburgueMenuToggle } = inject('hamburgueMenuToggle') as IHamburgueMenuToggleContext;
</script>
<template>
    <NavbarMobile
        v-if="hamburgueMenuToggle === true"
        :current-content="currentContent"
        :handle-change-current-content="handleChangeCurrentContent"
    />
    <main class="appPageContainer">
        <div class="fullContentContainer">
            <Navbar :handle-change-current-content="handleChangeCurrentContent" :current-content="currentContent" />
            <HomeContent v-if="currentContent === 'home'" />
            <PlanningContent v-else-if="currentContent === 'planning'" />
        </div>
    </main>
</template>
<style lang="scss" scoped src="../styles/apppage.style.scss" />
