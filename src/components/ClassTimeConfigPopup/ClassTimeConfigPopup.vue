<script setup lang="ts">
import { inject, ref } from "vue";
import { useI18n } from "vue-i18n";
import backendApi from "../../api/api";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import type { ILoadingContext } from "../../interfaces/context/loading.interface";

const { t } = useI18n();

const { handleChangeIsLoading } = inject("isLoading") as ILoadingContext;
const { handleChangePopupInfo } = inject("popup") as IPopupContext;
const showPopup = defineModel<boolean>("show", { required: true });

const initialHour = ref(sessionStorage.getItem("initial_hour") || "12:00");
const interval = ref(sessionStorage.getItem("interval") || "0:30");

const emit = defineEmits<{
    save: [initialHour: string, interval: string];
}>();

const handleSave = async () => {
    try {
        emit("save", initialHour.value, interval.value);

        const user = sessionStorage.getItem("user");
        let userId = "";
        if (user) userId = JSON.parse(user).uuid || "";

        handleChangeIsLoading(true);
        await backendApi.put(`/planninghour/${userId}`, {
            initialHour: initialHour.value,
            interval: interval.value,
        });

        handleChangePopupInfo(
            t("design.classTimeConfigSaved"),
            "success",
            true,
        );
        handleChangeIsLoading(false);
        showPopup.value = false;
    } catch {
        handleChangePopupInfo(t("design.classTimeConfigError"), "error", true);
        handleChangeIsLoading(false);
    }
};

const handleCancel = () => {
    showPopup.value = false;
};
</script>

<template>
    <section
        class="classTimeConfigContainer"
        v-if="showPopup"
        @click="handleCancel"
    >
        <form class="classTimeConfigContent" @click.stop>
            <h2>{{ t("design.classTimeConfig") }}</h2>

            <label>{{ t("design.initialHour") }}</label>
            <input type="time" v-model="initialHour" step="900" />

            <label>{{ t("design.intervalBetweenClasses") }}</label>
            <select v-model="interval">
                <option value="0:15">15 minutos</option>
                <option value="0:30">30 minutos</option>
                <option value="0:45">45 minutos</option>
                <option value="1:00">60 minutos</option>
                <option value="1:15">75 minutos</option>
                <option value="1:30">90 minutos</option>
                <option value="2:00">120 minutos</option>
            </select>

            <span class="btnControlsContainer">
                <button type="button" class="btnCancel" @click="handleCancel">
                    {{ t("design.cancel") }}
                </button>
                <button type="button" class="btnSave" @click="handleSave">
                    {{ t("design.save") }}
                </button>
            </span>
        </form>
    </section>
</template>

<style lang="scss" scoped src="./classtimeconfigpopup.style.scss" />
