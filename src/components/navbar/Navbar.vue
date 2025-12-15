<script lang="ts" setup>

import { inject } from 'vue';
import type { IPageContent } from '../../interfaces/pageContents.interface';
import type { IHamburgueMenuToggleContext } from '../../interfaces/context/hamburgueMenuToggle.interface';
import { useRouter } from 'vue-router';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
const { handleChangeCurrentContent, currentContent } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent['contents']) => void,
    currentContent: IPageContent['contents']
}>();
const router = useRouter();
const hamburgerMenuContext: IHamburgueMenuToggleContext = inject('hamburgueMenuToggle') as IHamburgueMenuToggleContext;
const { handleChangePopupInfo } = inject('popup') as IPopupContext;

const logout = () => {
    sessionStorage.clear();
    handleChangePopupInfo('Deslogado', 'info', true);
    router.push('/');
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
                :class="[currentContent == 'planning' ? 'choosed' : 'btnNavbar']">
                Planejar
            </li>
            <li @click="handleChangeCurrentContent('planning_list')"
                :class="[currentContent == 'planning_list' ? 'choosed' : 'btnNavbar']">
                Planejamentos
            </li>
            <li :class="['btnNavbar']">Planos</li>
            <li @click="handleChangeCurrentContent('profile')"
                :class="[currentContent == 'profile' ? 'choosed' : 'btnNavbar']">Perfil</li>
            <li :class="['btnNavbar']" @click="logout">Sair</li>
            <li class="mobileIcon"><i class="pi pi-bars"
                    @click="hamburgerMenuContext.handleHamburgueMenuToggle(true)"></i></li>
        </ul>
    </nav>
</template>

<style scoped src="./navbar.style.scss" lang="scss" />
