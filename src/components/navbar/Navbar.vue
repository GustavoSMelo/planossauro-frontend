<script lang="ts" setup>
import { ref } from 'vue';
const hamburgerMenuActive = ref(false);

const changeMenuHamburgerState = () => {
    hamburgerMenuActive.value = !hamburgerMenuActive.value;
};

</script>
<template>
    <nav class="navbarContainer">
        <figure class="logoContainer">
            <img src="../../assets/DinoLogoWhite.svg" />
            <figcaption>Planeja.ai</figcaption>
        </figure>

        <ul class="navbarControls">
            <li class="deskIcon planInfo">Plano free</li>
            <li class="deskIcon btnNavbar"><i class="pi pi-sun"></i></li>
            <li class="deskIcon btnNavbar"><i class="pi pi-sign-out"></i></li>
            <li class="mobileIcon"><i class="pi pi-bars" @click="changeMenuHamburgerState"></i></li>
        </ul>
    </nav>

    <span v-if="hamburgerMenuActive" class="navbarControlsMobile">
        <span class="blur" @click="changeMenuHamburgerState"></span>
        <ul class="hamburgerMenu">
            <li>
                <img src="../../assets/DinoLogoWhite.svg" />
                <h4>Planeja.ai</h4>
            </li>
            <li class="planInfo">Plano free</li>
            <li class="btnNavbar"><i class="pi pi-sun"></i>Light theme</li>
            <li class="btnNavbar"><i class="pi pi-sign-out"></i>Log out</li>
        </ul>
    </span>
</template>

<style scoped src="./navbar.style.scss" lang="scss" />
