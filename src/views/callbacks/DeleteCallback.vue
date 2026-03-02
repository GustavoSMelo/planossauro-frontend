<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import type { IUser } from "../../interfaces/api/user.interface";
import backendApi from "../../api/api";
import { useI18n } from "vue-i18n";

const counterDays = ref(0);
const router = useRouter();
const { handleChangePopupInfo } = inject("popup") as IPopupContext;
const { t } = useI18n();

const handleLogout = () => {
    sessionStorage.clear();
    handleChangePopupInfo("Deslogado", "info", true);
    return router.push("/");
};

const handleRestoreAccount = async () => {
    try {
        const uuid = sessionStorage.getItem("uuid");
        const response = await backendApi.patch(`/user/restore/${uuid}`);

        if (response.status === 200) {
            const user = JSON.parse(
                sessionStorage.getItem("user") ?? "",
            ) as IUser;
            user.deleted_at = null;
            sessionStorage.setItem("user", JSON.stringify(user));
            handleChangePopupInfo(
                t("deleteCallback.restoreAccountMessage"),
                "success",
                true,
            );
            return router.push("/app");
        }
        handleChangePopupInfo(
            t("deleteCallback.restoreAccountError"),
            "error",
            true,
        );
    } catch {
        handleChangePopupInfo(
            t("deleteCallback.restoreAccountError"),
            "error",
            true,
        );
    }
};

onMounted(() => {
    const user = JSON.parse(sessionStorage.getItem("user") ?? "") as IUser;

    const currentDate = new Date();
    const next30Days = new Date(user.deleted_at!);
    next30Days.setDate(next30Days.getDate() + 30);

    const helper = next30Days.getTime() - currentDate.getTime();
    counterDays.value = Math.floor(helper / (1000 * 60 * 60 * 24));
    counterDays.value = counterDays.value < 0 ? 30 : counterDays.value;
});
</script>

<template>
    <div class="deleteUserContainer">
        <div class="deleteUserContent">
            <img
                src="../../assets/dino_chorandinho.png"
                alt="dino chorandinho"
            />
            <h2>{{ $t("deleteCallback.title") }}</h2>
            <p>
                {{ $t("deleteCallback.descriptionSub1") }}
                <b
                    >{{ counterDays ? counterDays : 30 }}
                    {{ $t("deleteCallback.days") }}</b
                >, <br />{{ $t("deleteCallback.descriptionSub2") }}
            </p>

            <button type="button" @click="handleRestoreAccount()">
                {{ $t("deleteCallback.restoreAccount") }}
            </button>
            <button type="button" class="btnLogout" @click="handleLogout()">
                {{ $t("deleteCallback.logout") }}
            </button>
        </div>
    </div>
</template>
<style
    lang="scss"
    scoped
    src="../../styles/callbacks/deletecallback.style.scss"
/>
