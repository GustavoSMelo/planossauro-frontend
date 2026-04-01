<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { handleOpenTutorialVideo } = defineProps<{
    handleOpenTutorialVideo: (opens: boolean) => void;
}>();
</script>
<template>
    <div class="videoTutorialContainer">
        <div class="videoTutorialContent">
            <nav>
                <h2>{{ t("videoTutorial.videoTutorial") }}</h2>

                <i
                    class="pi pi-times iconClose"
                    @click="handleOpenTutorialVideo(false)"
                ></i>
            </nav>

            <iframe src="https://www.youtube.com/embed/QxRVsrK7LF8"></iframe>

            <button type="button" @click="handleOpenTutorialVideo(false)">
                {{ t("videoTutorial.close") }}
            </button>
        </div>
    </div>
</template>
<style scoped src="./videotutorial.style.scss" lang="scss" />
