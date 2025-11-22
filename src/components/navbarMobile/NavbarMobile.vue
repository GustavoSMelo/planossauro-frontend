<script lang="ts" setup>
import { inject } from 'vue';
import type { IHamburgueMenuToggleContext } from '../../interfaces/context/hamburgueMenuToggle.interface';
import type { IPageContent } from '../../interfaces/pageContents.interface';

const { handleChangeCurrentContent, currentContent } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent['contents']) => void,
    currentContent: IPageContent['contents']
}>();

const { handleHamburgueMenuToggle }= inject('hamburgueMenuToggle') as IHamburgueMenuToggleContext;

const handleRemoveMenuHamburguer = () => {
    const hamburgerMenu = window.document.querySelector('.hamburgerMenu');
    hamburgerMenu?.classList.add('menuCloseAnimation');

    setTimeout(() => {
        hamburgerMenu?.classList.remove('menuCloseAnimation');
        handleHamburgueMenuToggle(false);
    }, 500);
};
</script>

<template>
    <div class="navbarControlsMobile">
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
    </div>
</template>

<style lang="scss" scoped src="./navbarmobile.style.scss" />
