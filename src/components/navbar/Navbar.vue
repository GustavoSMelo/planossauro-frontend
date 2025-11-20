<script lang="ts" setup>
import { ref } from 'vue';
import type { IPageContent } from '../../interfaces/pageContents.interface';

const { handleChangeCurrentContent, currentContent } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent['contents']) => void,
    currentContent: IPageContent['contents']
}>();
const hamburgerMenuActive = ref(false);

const handleActiveMenuHamburguer = () => {
    hamburgerMenuActive.value = true;
};

const handleRemoveMenuHamburguer = () => {
    const hamburgerMenu = window.document.querySelector('.hamburgerMenu');
    hamburgerMenu?.classList.add('menuCloseAnimation');

    setTimeout(() => {
        hamburgerMenu?.classList.remove('menuCloseAnimation');
        hamburgerMenuActive.value = false;
    }, 500);
};

</script>
<template>
    <nav class="navbarContainer">
        <figure class="logoContainer" @click="handleChangeCurrentContent('home')">
            <img src="../../assets/DinoLogo.svg" />
            <figcaption>Planeja.ai</figcaption>
        </figure>

        <ul class="navbarControls">
            <li @click="handleChangeCurrentContent('planning')"
                :class="[currentContent == 'planning' ? 'choosed' : '', 'btnNavbar']">
                Planejar
            </li>
            <li :class="['btnNavbar']">Planejamentos</li>
            <li :class="['btnNavbar']">Planos</li>
            <li :class="['btnNavbar']">Perfil</li>
            <li :class="['btnNavbar']">Sair</li>
            <li class="mobileIcon"><i class="pi pi-bars" @click="handleActiveMenuHamburguer"></i></li>
        </ul>
    </nav>

    <span v-if="hamburgerMenuActive" class="navbarControlsMobile">
        <span class="blur" @click="handleRemoveMenuHamburguer"></span>
        <ul class="hamburgerMenu">
            <li @click="handleChangeCurrentContent('home')">
                <img src="../../assets/DinoLogo.svg" />
                <h4>Planeja.ai</h4>
            </li>
            <li class="planInfo">Plano free</li>
            <hr />
            <li :class="[currentContent === 'planning' ? 'choosed' : '', 'btnNavbar']">Planejamentos</li>
            <li :class="['btnNavbar']">Planos</li>
            <li :class="['btnNavbar']">Perfil</li>
            <li :class="['btnNavbar']">Sair</li>
        </ul>
    </span>
</template>

<style scoped src="./navbar.style.scss" lang="scss" />
