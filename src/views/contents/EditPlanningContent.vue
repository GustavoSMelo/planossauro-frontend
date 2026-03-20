<script lang="ts" setup>
import { inject, onMounted, ref, computed } from "vue";
import backendApi from "../../api/api";
import type { IPlanning } from "../../interfaces/api/planning.interface";
import type { IPageContent } from "../../interfaces/pageContents.interface";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import type { ILoadingContext } from "../../interfaces/context/loading.interface";
import { useI18n } from "vue-i18n";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const { handleChangeCurrentContent } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent["contents"]) => void;
}>();

const archived = ref<boolean>(false);
const className = ref<string>("");
const schoolName = ref<string>("");
const start_date = ref("");
const end_date = ref("");
const planning = ref<IPlanning>();
const rangeDates = ref<[Date, Date] | null>(null);
const { handleChangePopupInfo } = inject("popup") as IPopupContext;
const { handleChangeIsLoading } = inject("isLoading") as ILoadingContext;
const { t } = useI18n();
const uuid = sessionStorage.getItem("planning_selectedUUID");

const isWeekly = computed(() => start_date.value !== end_date.value);

const handleChangeSchoolName = (event: Event) => {
    const target = event.target as HTMLInputElement;
    schoolName.value = target.value;
};

const handleChangeClassName = (event: Event) => {
    const target = event.target as HTMLInputElement;
    className.value = target.value;
};

const handleChangeArchived = (event: Event) => {
    const target = event.target as HTMLInputElement;
    archived.value = target.value === "true" ? true : false;
};

const handleChangeStartPlan = (event: Event) => {
    const target = event.target as HTMLInputElement;
    start_date.value = target.value;
    end_date.value = target.value;
};

const handleChangeRangeDates = (modelData: [Date, Date] | null) => {
    if (!modelData) return;
    rangeDates.value = modelData;
    start_date.value = `${modelData[0].getFullYear()}-${String(modelData[0].getMonth() + 1).padStart(2, "0")}-${String(modelData[0].getDate()).padStart(2, "0")}`;
    end_date.value = `${modelData[1].getFullYear()}-${String(modelData[1].getMonth() + 1).padStart(2, "0")}-${String(modelData[1].getDate()).padStart(2, "0")}`;
};

const handleUpdatePlanning = async () => {
    try {
        handleChangeIsLoading(true);
        await backendApi.put(`/planning/${uuid}`, {
            ...planning.value,
            class_name: className.value,
            school_name: schoolName.value,
            start_plan: start_date.value,
            end_plan: end_date.value,
        });

        if (archived.value) {
            await backendApi.patch(`/planning/archive/${uuid}`);
        } else {
            await backendApi.patch(`/planning/unarchive/${uuid}`);
        }

        handleChangePopupInfo(
            t("editPlanning.updateSuccessMessage"),
            "success",
            true,
        );
        handleChangeIsLoading(false);
        handleChangeCurrentContent("planning_list");
    } catch {
        handleChangeIsLoading(false);
    }
};

const getDataFromAPI = async () => {
    try {
        handleChangeIsLoading(true);
        const planningResponse = (
            await backendApi.get(`/planning/show/${uuid}`)
        ).data as IPlanning;

        if (!planningResponse || planningResponse === null) {
            handleChangePopupInfo(
                t("editPlanning.noPlanningMessage"),
                "error",
                true,
            );
            handleChangeCurrentContent("home");
        }

        planning.value = planningResponse;
        className.value = planningResponse.class_name;
        schoolName.value = planningResponse.school_name;
        archived.value = planningResponse.deleted_at ? true : false;
        start_date.value = planningResponse.start_plan.toString();
        end_date.value = planningResponse.end_plan.toString();
        if (start_date.value !== end_date.value) {
            const [startYear, startMonth, startDay] = start_date.value
                .split("-")
                .map(Number);
            const [endYear, endMonth, endDay] = end_date.value
                .split("-")
                .map(Number);
            rangeDates.value = [
                new Date(startYear, startMonth - 1, startDay),
                new Date(endYear, endMonth - 1, endDay),
            ];
        }
        handleChangeIsLoading(false);
    } catch {
        handleChangeIsLoading(false);
    }
};

onMounted(() => {
    getDataFromAPI();
});
</script>

<template>
    <div class="editPlanningContainer">
        <form class="editPlanningForm">
            <div class="titleForm">
                <h1>{{ t("editPlanning.title") }}</h1>
                <p>
                    {{
                        planning?.start_plan === planning?.end_plan
                            ? "Diario"
                            : "Semanal"
                    }}
                    | {{ planning?.start_plan }} ~ {{ planning?.end_plan }}
                </p>
            </div>

            <label>{{ t("editPlanning.schoolName") }} </label>
            <input
                @change="handleChangeSchoolName"
                :value="schoolName"
                placeholder="Insira o nome da escola..."
                type="text"
            />

            <label>{{ t("editPlanning.class") }}: </label>
            <input
                @change="handleChangeClassName"
                :value="className"
                placeholder="Insira o da serie/turma/escola..."
                type="text"
            />

            <label>{{ t("editPlanning.archive") }}: </label>
            <select @change="handleChangeArchived" :value="archived">
                <option value="true">
                    {{ t("editPlanning.archiveYesOption") }}
                </option>
                <option value="false">
                    {{ t("editPlanning.archiveNoOption") }}
                </option>
            </select>

            <div class="dateContainer">
                <span v-if="isWeekly" class="rangeDatePickerContainer">
                    <label>{{ t("editPlanning.initialDate") }}: </label>
                    <VueDatePicker
                        v-model="rangeDates"
                        :range="{ maxRange: 4, minRange: 4 }"
                        @update:model-value="handleChangeRangeDates"
                        class="datepicker"
                    />
                </span>
                <span v-else>
                    <label>{{ t("editPlanning.initialDate") }}: </label>
                    <input
                        @change="handleChangeStartPlan"
                        :value="start_date"
                        type="date"
                    />
                </span>
            </div>

            <span class="btnContainer">
                <button
                    type="button"
                    @click="handleChangeCurrentContent('planning_list')"
                >
                    {{ t("editPlanning.cancel") }}
                </button>
                <button type="button" @click="handleUpdatePlanning">
                    {{ t("editPlanning.save") }}
                </button>
            </span>
        </form>
    </div>
</template>

<style
    lang="scss"
    scoped
    src="../../styles/contents/editplanningcontent.style.scss"
/>
