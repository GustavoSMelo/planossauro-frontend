<script setup lang="ts">
import confetti from "@hiseb/confetti";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const showTutorialVideo = ref(false);

const { handleCloseFirstLogin, handleOpenTutorialVideo } = defineProps<{
    handleCloseFirstLogin: () => void;
    handleOpenTutorialVideo: (opens: boolean) => void;
}>();

const handleStartGuidedTour = () => {
    const tourButton = document.querySelector("#tutorFloatIcon") as HTMLElement;

    if (tourButton) {
        handleCloseFirstLogin();
        tourButton.click();
    }
};

const handleCloseWelcomePage = (value: boolean) => {
    localStorage.setItem("showWelcomePage", value.toString());
    showTutorialVideo.value = value;
};

const handleToggleTutorialVideo = () => {
    handleCloseFirstLogin();
    handleOpenTutorialVideo(true);
};

onMounted(() => {
    const showWelcomePage = localStorage.getItem("showWelcomePage");

    if (showWelcomePage === "false") {
        showTutorialVideo.value = false;
    } else {
        showTutorialVideo.value = true;
    }

    confetti({
        fade: true,
        velocity: 100,
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
                <h2>{{ t("welcomeContainer.welcome") }}</h2>

                <i
                    class="pi pi-times closeIcon"
                    @click="handleCloseFirstLogin()"
                ></i>
            </navbar>

            <div class="introductionContent">
                <img src="../../assets/dino_party.png" alt="Dino Party" />

                <p>
                    {{ t("welcomeContainer.welcomeMessage") }}
                </p>

                <span class="notShowAgain">
                    <input
                        type="checkbox"
                        id="tutorialVideo"
                        v-model="showTutorialVideo"
                        :value="showTutorialVideo"
                        @click="handleCloseWelcomePage(!showTutorialVideo)"
                    />
                    <label for="tutorialVideo"
                        >{{ t("welcomeContainer.continueShowingScreen") }}</label
                    >
                </span>
                <button type="button" @click="handleToggleTutorialVideo()">
                    <i class="pi pi-video"></i> {{ t("welcomeContainer.needCompleteVideo") }}
                </button>
                <button
                    type="button"
                    class="guideButton"
                    @click="handleStartGuidedTour()"
                >
                    <i class="pi pi-graduation-cap icon"></i> {{ t("welcomeContainer.needGuide") }}
                </button>
                <button
                    type="button"
                    class="compassButton"
                    @click="handleCloseFirstLogin()"
                >
                    <i class="pi pi-compass"></i> {{ t("welcomeContainer.canGuideAlone") }}
                </button>
            </div>
        </div>
    </section>
</template>
<style lang="scss" scoped src="./welcomecontainer.style.scss" />
