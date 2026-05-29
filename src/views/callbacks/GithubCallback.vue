<script setup lang="ts">
import { inject, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { setToken } from "../../helpers/token";
import backendApi from "../../api/api";
import isApiHealth from "../../api/healthCheck";
import type { IGithubCallbackResponse } from "../../interfaces/githubCallback.interface";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import type { IAccessSanctumToken } from "../../interfaces/auth.interface";

const { t } = useI18n();

watchEffect(async () => {
    const popupContext: IPopupContext = inject("popup") as IPopupContext;
    const router = useRouter();
    const searchQueryString = window.location.search;
    const urlParams = new URLSearchParams(searchQueryString);
    const codeParam = urlParams.get("code");
    const error = urlParams.get("error");

    const apiIsRunning = await isApiHealth();

    if (apiIsRunning === false) {
        router.push("/offline");
        return;
    }

    if (error) {
        popupContext.handleChangePopupInfo(
            t("githubcallback.notAuthorized"),
            "error",
            true,
        );
        router.push("/");
        return;
    }

    const { data }: { data: IGithubCallbackResponse } = await backendApi.get(
        `/token/github/${codeParam}`,
    );

    sessionStorage.setItem("githubAccessToken", data.accessToken);

    if (data.data.email === null) {
        popupContext.handleChangePopupInfo("", "info", true);
        router.push("/login");
        return;
    }

    try {
        const response = (
            await backendApi.get(`/auth/github/${data.accessToken}`)
        ).data as IAccessSanctumToken;

        setToken(response.token.plainTextToken);
        sessionStorage.setItem("user", JSON.stringify(response.user));
        sessionStorage.setItem("loginType", "github");
        popupContext.handleChangePopupInfo(
            t("githubcallback.messageSuccess"),
            "success",
            true,
        );

        const responseHour = await backendApi.get(
            `/planninghour/${response.user.uuid}`,
        );
        sessionStorage.setItem(
            "fullName",
            data.data.name ? data.data.name : data.data.login,
        );

        sessionStorage.setItem("initial_hour", responseHour.data.initial_hour);
        sessionStorage.setItem(
            "interval",
            responseHour.data.interval_between_classes,
        );

        router.push("/app");
        return;
    } catch {
        sessionStorage.setItem("loginType", "github");
        sessionStorage.setItem("githubEmail", data.data.email);
        sessionStorage.setItem("githubId", Number(data.data.id).toString());
        sessionStorage.setItem(
            "fullName",
            data.data.name ? data.data.name : data.data.login,
        );

        router.push(`/finish/login?githubCode=${codeParam}`);
    }

    sessionStorage.setItem("loginType", "github");
    sessionStorage.setItem("githubEmail", data.data.email);
    sessionStorage.setItem("githubId", Number(data.data.id).toString());
    sessionStorage.setItem(
        "fullName",
        data.data.name ? data.data.name : data.data.login,
    );

    router.push(`/finish/login?githubCode=${codeParam}`);
});
</script>

<template>
    <div class="githubCallbackContainer">
        <h2>{{ t("githubcallback.workingOnLogin") }}</h2>
        <i class="pi pi-github"></i>
    </div>
</template>

<style
    src="../../styles/callbacks/githubcallback.style.scss"
    lang="scss"
    scoped
/>
