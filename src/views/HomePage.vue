<script setup lang="ts">

import Navbar from '../components/navbar/Navbar.vue';
import HomeContent from './contents/HomeContent.vue';
import PlanningContent from './contents/PlanningContent.vue';
import { ref } from 'vue';
import type { IPageContent } from '../interfaces/pageContents.interface';

const currentContent = ref<IPageContent['contents']>('home');
const showContentMobile = ref(false);

const handleChangeCurrentContent = (newContent: IPageContent['contents']) => {
    showContentMobile.value = false;
    currentContent.value = newContent;
};

const handleChangeShowContentMobile = (show: boolean) => {
    showContentMobile.value = show;
};

const handleTranslateToMobileContent = () => {
    switch (currentContent.value) {
        case "home":
            return 'Home';
        case 'planning':
            return 'Planejar';
        default:
            return 'Home';
    }
};

const hourTime = new Date().getHours();
</script>
<template>
    <Navbar />
    <main class="homePageContainer">
        <div class="tabsContentContainer">
            <ul class="tabs">
                <li :class="currentContent === 'home' ? 'focusContent' : ''" id="homeTab"
                    @click="handleChangeCurrentContent('home')">
                    <i class="pi pi-home"></i>
                    Home
                </li>
                <li :class="currentContent === 'planning' ? 'focusContent' : ''" id="planTab"
                    @click="handleChangeCurrentContent('planning')">
                    <i class="pi pi-book"></i>
                    Planejar
                </li>
            </ul>

            <div class="tabsMobile">
                <span>
                    <h2>{{ handleTranslateToMobileContent() }}</h2>

                    <button v-if="showContentMobile === false" type="button"
                        @click="handleChangeShowContentMobile(true)">
                        <i class="pi pi-chevron-down"></i>
                    </button>
                    <button v-if="showContentMobile === true" type="button"
                        @click="handleChangeShowContentMobile(false)">
                        <i class="pi pi-chevron-up"></i>
                    </button>
                </span>
                <ul v-if="showContentMobile" class="tabsContentMobile">
                    <li :class="currentContent === 'home' ? 'focusContent' : ''" id="homeTab"
                        @click="handleChangeCurrentContent('home')"> <i class="pi pi-home"></i> Home</li>
                    <li :class="currentContent === 'planning' ? 'focusContent' : ''" id="planTab"
                        @click="handleChangeCurrentContent('planning')"> <i class="pi pi-book"></i>
                        Planejar</li>
                </ul>
            </div>

            <div class="tabsContent">
                <HomeContent v-if="currentContent === 'home'" />
                <PlanningContent v-else-if="currentContent === 'planning'" />
            </div>
        </div>
    </main>
</template>
<style lang="scss" scoped src="../styles/homepage.style.scss" />
