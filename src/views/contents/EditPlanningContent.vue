<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import backendApi from "../../api/api";
import type { IPlanning } from "../../interfaces/api/planning.interface";
import type { IPageContent } from "../../interfaces/pageContents.interface";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import type { ILoadingContext } from "../../interfaces/context/loading.interface";
import { useI18n } from "vue-i18n";

const { handleChangeCurrentContent } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent["contents"]) => void;
}>();

const archived = ref<boolean>(false);
const className = ref<string>("");
const schoolName = ref<string>("");
const start_date = ref("");
const end_date = ref("");
const planning = ref<IPlanning>();
const { handleChangePopupInfo } = inject("popup") as IPopupContext;
const { handleChangeIsLoading } = inject("isLoading") as ILoadingContext;
const { t } = useI18n();
const uuid = sessionStorage.getItem("planning_selectedUUID");

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
};

const handleChangeEndPlan = (event: Event) => {
    const target = event.target as HTMLInputElement;
    end_date.value = target.value;
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
                <span>
                    <label>{{ t("editPlanning.initialDate") }}: </label>
                    <input
                        @change="handleChangeStartPlan"
                        :value="start_date"
                        type="date"
                    />
                </span>
                <span>
                    <label>{{ t("editPlanning.endDate") }}: </label>
                    <input
                        @change="handleChangeEndPlan"
                        :value="end_date"
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
