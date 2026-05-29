<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import backendApi from "../../api/api";
import router from "../../routes";
import type { IFacebookCallback } from "../../interfaces/facebookCallback.interface";
import { setToken } from "../../helpers/token";

const { t } = useI18n();

onMounted(async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const response = await backendApi.get(`/token/facebook/${code}`);

    if (response.status === 200) {
        const token = response.data.access_token;
        const facebookResponse = (
            await backendApi.get(`/auth/facebook/${token}`)
        ).data as IFacebookCallback;

        if (!facebookResponse.token.plainTextToken.length) {
            sessionStorage.setItem("loginType", "facebook");
            sessionStorage.setItem("facebookEmail", facebookResponse.email);
            sessionStorage.setItem("facebookId", facebookResponse.id);
            sessionStorage.setItem("fullName", facebookResponse.name);
            sessionStorage.setItem("facebookAccessToken", token);

            return router.push(`/finish/login`);
        }

        setToken(facebookResponse.token.plainTextToken);
        sessionStorage.setItem("user", JSON.stringify(facebookResponse.user));
        sessionStorage.setItem("loginType", "facebook");

        const responseHour = await backendApi.get(
            `/planninghour/${facebookResponse.user.uuid}`,
        );
        sessionStorage.setItem("initial_hour", responseHour.data.initial_hour);
        sessionStorage.setItem(
            "interval",
            responseHour.data.interval_between_classes,
        );

        router.push("/app");
        return;
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
