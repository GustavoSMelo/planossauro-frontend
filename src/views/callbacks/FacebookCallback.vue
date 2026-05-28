<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import facebookApi from "../../api/facebook";
import backendApi from "../../api/api";

const { t } = useI18n();

onMounted(async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const response = await backendApi.get(`/auth/facebook/${code}`);

    if (response.status === 200) {
        const token = response.data.access_token;
        const facebookResponse = await backendApi.get(
            `/auth/facebook/${token}`,
        );

        console.log(facebookResponse.data);
    }
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
