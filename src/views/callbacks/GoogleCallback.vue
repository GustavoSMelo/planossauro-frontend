<script lang="ts" setup>
import { inject, onMounted } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import isApiHealth from "../../api/healthCheck";
import backendApi from "../../api/api";
import { setToken } from "../../helpers/token";
import type { IGoogleResponse } from "../../interfaces/api/googleResponse.interface";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import type { IAccessSanctumToken } from "../../interfaces/auth.interface";

const { t } = useI18n();

onMounted(async () => {
    const popupContext = inject("popup") as IPopupContext;
    const router = useRouter();
    const isApiOnline = await isApiHealth();

    if (isApiOnline === false) {
        router.push("/offline");
        return;
    }

    const hashes = window.location.hash;
    const paramsString = hashes.substring(1);
    const searchParams = new URLSearchParams(paramsString);
    const accessToken = searchParams.get("access_token") || "";
    const response = await axios.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        },
    );

    const googleResponse = response.data as IGoogleResponse;

    try {
        const response = (await backendApi.get(`/auth/google/${accessToken}`))
            .data as IAccessSanctumToken;

        setToken(response.token.plainTextToken);
        sessionStorage.setItem("user", JSON.stringify(response.user));
        sessionStorage.setItem("loginType", "google");
        popupContext.handleChangePopupInfo(
            t("googlecallback.messageSuccess"),
            "success",
            true,
        );

        const responseHour = await backendApi.get(
            `/planninghour/${response.user.uuid}`,
        );
        sessionStorage.setItem("initial_hour", responseHour.data.initial_hour);
        sessionStorage.setItem(
            "interval",
            responseHour.data.interval_between_classes,
        );

        router.push("/app");
        return;
    } catch {
        sessionStorage.setItem("loginType", "google");
        sessionStorage.setItem("googleEmail", googleResponse.email);
        sessionStorage.setItem("googleId", googleResponse.sub);
        sessionStorage.setItem("fullName", googleResponse.name);

        router.push(`/finish/login?at=${accessToken}`);
    }

    sessionStorage.setItem("loginType", "google");
    sessionStorage.setItem("googleEmail", googleResponse.email);
    sessionStorage.setItem("googleId", googleResponse.sub);
    sessionStorage.setItem("fullName", googleResponse.name);

    router.push(`/finish/login?at=${accessToken}`);
});
</script>

<template>
    <div class="googleCallbackContainer">
        <i class="pi pi-google"></i>
        <h2>{{ t("googlecallback.workingOnLogin") }}</h2>
    </div>
</template>

<style
    lang="scss"
    scoped
    src="../../styles/callbacks/googleCallback.style.scss"
/>
