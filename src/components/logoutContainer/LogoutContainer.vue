<script setup lang="ts">
import { inject } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { IPopupContext } from "../../interfaces/context/popup.interface";

const { t } = useI18n();

const { handleChangeLogoutPage } = defineProps<{
    handleChangeLogoutPage: (newValue: boolean) => void;
}>();

const { handleChangePopupInfo } = inject("popup") as IPopupContext;
const router = useRouter();

const handleLogout = () => {
    sessionStorage.clear();
    handleChangePopupInfo(t("logout.loggedOut"), "info", true);
    router.push("/");
};
</script>
<template>
    <div
        class="logoutContainer"
        id="logoutContainer"
        @click="handleChangeLogoutPage(false)"
    >
        <div class="logoutContent" @click.stop>
            <h2>{{ t("logout.logoutTitle") }}</h2>

            <span>
                <button
                    class="cancelButton"
                    @click="handleChangeLogoutPage(false)"
                >
                    {{ t("logout.cancelButton") }}
                </button>
                <button
                    class="logoutButton"
                    id="logoutButton"
                    @click="handleLogout"
                >
                    {{ t("logout.logoutButton") }}
                </button>
            </span>
        </div>
    </div>
</template>
<style scoped lang="scss" src="./logoutContainer.style.scss" />
