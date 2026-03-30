<script setup lang="ts">
import confetti from "@hiseb/confetti";
import { onMounted } from "vue";

const { handleCloseFirstLogin } = defineProps<{
    handleCloseFirstLogin: () => void;
}>();

const handleStartGuidedTour = () => {
    const tourButton = document.querySelector("#tutorFloatIcon");

    if (tourButton) {
        tourButton.click();
    }
};

onMounted(() => {
    confetti({
        fade: true,
        velocity: 200,
        size: 1.6,
        count: 230,
        position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
    });
});
</script>
<template>
    <section class="welcomeContainer">
        <div class="welcomeContent">
            <navbar>
                <h2>Bem vindo</h2>

                <i
                    class="pi pi-times closeIcon"
                    @click="handleCloseFirstLogin()"
                ></i>
            </navbar>

            <div class="introductionContent">
                <img src="../../assets/dino_party.png" alt="Dino Party" />

                <p>
                    Seja bem vindo ao planossauro, precisa de um guia para
                    utilizar o sistema ?
                </p>

                <button type="button">
                    <i class="pi pi-video"></i> Preciso de um video completo
                </button>
                <button
                    type="button"
                    class="guideButton"
                    @click="handleStartGuidedTour()"
                >
                    <i class="pi pi-graduation-cap icon"></i> Preciso de um guia
                </button>
                <button
                    type="button"
                    class="compassButton"
                    @click="handleCloseFirstLogin()"
                >
                    <i class="pi pi-compass"></i> Consigo me guiar sozinho
                </button>
            </div>
        </div>
    </section>
</template>
<style lang="scss" scoped src="./welcomecontainer.style.scss" />
