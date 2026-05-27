<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    console.log(code);
});
</script>

<template>
    <div class="facebookCallbackContainer">
        <i class="pi pi-facebook"></i>
        <h2>{{ t("facebookcallback.workingOnLogin") }}</h2>
    </div>
</template>

<style
    lang="scss"
    scoped
    src="../../styles/callbacks/facebookcallback.style.scss"
/>
