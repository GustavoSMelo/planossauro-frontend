<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDark } from "@vueuse/core";

import backendApi from "../../api/api";
import convertIsoDateToBR from "../../helpers/dateIsoConvertToBR";
import type { IPlanning } from "../../interfaces/api/planning.interface";
import type { ILoadingContext } from "../../interfaces/context/loading.interface";
import type { IPageContent } from "../../interfaces/pageContents.interface";

const { handleChangeCurrentContent } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent["contents"]) => void;
}>();

const isDark = useDark({
    attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
});

const currentPage = ref(1);
const plannings = ref<Array<IPlanning>>([]);
const startDatePlanning = ref("");
const className = ref("");
const schoolName = ref("");
const archived = ref(false);
const planningType = ref<"Semanal" | "Diario" | "">("");
const { t } = useI18n();
const { handleChangeIsLoading } = inject("isLoading") as ILoadingContext;

const getDataFromAPI = async () => {
    try {
        handleChangeIsLoading(true);
        const uuid = JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid;
        const { data: planningsDataList }: { data: Array<IPlanning> } = (
            await backendApi.get(
                `/planning/paginate/${uuid}?page=${currentPage.value}`,
            )
        ).data;

        plannings.value = [...plannings.value, ...planningsDataList];
        handleChangeIsLoading(false);
    } catch {
        handleChangeIsLoading(false);
    }
};

const loadDataFromPagination = () => {
    currentPage.value++;
    getDataFromAPI();
};

const downloadDocument = (index: number) => {
    const element = plannings.value[index];

    const documentContent = atob(element.document_b64);
    const bytes = new Uint8Array(documentContent.length);

    for (let i = 0; i < documentContent.length; i++) {
        bytes[i] = documentContent.charCodeAt(i);
    }

    const fileName = `planjemanto-${element.school_name}-${element.class_name}-${element.start_plan}.docx`;
    const file = new File([bytes], fileName, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const link = window.document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
};

const handleChangeClassName = (event: Event) => {
    const target = event.target as HTMLInputElement;
    className.value = target.value;
};

const handleChangePlanningType = (event: Event) => {
    const target = event.target as HTMLInputElement;
    planningType.value = target.value as "Semanal" | "Diario";
};

const handleChangeDatePlanning = (event: Event) => {
    const target = event.target as HTMLInputElement;
    startDatePlanning.value = target.value;
};

const handleChangeSchoolName = (event: Event) => {
    const target = event.target as HTMLInputElement;
    schoolName.value = target.value;
};

const handleChangeArchivedFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    archived.value = target.value === "true" ? true : false;
};

const searchByFilterParameters = async () => {
    try {
        handleChangeIsLoading(true);

        const uuid = JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid;
        const planningsResponse = (
            await backendApi.post(`/planning/search/${uuid}`, {
                school_name: schoolName.value,
                class_name: className.value,
                archived: archived.value,
                start_plan: startDatePlanning.value,
                planning_type: planningType.value,
            })
        ).data as Array<IPlanning>;

        plannings.value = [...planningsResponse];
        handleChangeIsLoading(false);
    } catch {
        handleChangeIsLoading(false);
    }
};

const handleEditPlanningInformations = (uuid: string) => {
    sessionStorage.setItem("planning_selectedUUID", uuid);
    handleChangeCurrentContent("edit_planning");
};

const handleDeletePlanning = (uuid: string) => {
    sessionStorage.setItem("planning_selectedUUID", uuid);
    handleChangeCurrentContent("remove_planning");
};

const handleClearFilterAndSearch = () => {
    className.value = "";
    schoolName.value = "";
    archived.value = false;
    startDatePlanning.value = "";
    planningType.value = "";
    plannings.value = [];
    getDataFromAPI();
};

onMounted(() => {
    getDataFromAPI();
});
</script>

<template>
    <form class="searchFormContainer">
        <span>
            <label>{{ $t("planning.initialDate") }}</label>
            <input
                :value="startDatePlanning"
                type="date"
                @change="(event) => handleChangeDatePlanning(event)"
            />
        </span>
        <span>
            <label>{{ $t("planning.class") }}</label>
            <input
                :value="className"
                @change="handleChangeClassName"
                type="text"
                placeholder="Insira a classe/serie"
            />
        </span>
        <span>
            <label>{{ $t("planning.school") }}</label>
            <input
                :value="schoolName"
                @change="handleChangeSchoolName"
                type="text"
                placeholder="Insira a escola"
            />
        </span>
        <span>
            <label>{{ $t("planning.archived") }}</label>
            <select @change="handleChangeArchivedFile" :value="archived">
                <option value="false">{{ $t("planning.no") }}</option>
                <option value="true">{{ $t("planning.yes") }}</option>
            </select>
        </span>
        <span>
            <label>{{ $t("planning.planningType") }}</label>
            <select @change="handleChangePlanningType" :value="planningType">
                <option value="">{{ $t("planning.both") }}</option>
                <option value="Semanal">{{ $t("planning.weekly") }}</option>
                <option value="Diario">{{ $t("planning.daily") }}</option>
            </select>
        </span>

        <button type="button" @click="searchByFilterParameters">
            {{ $t("planning.search") }}
        </button>
        <button type="button" @click="handleClearFilterAndSearch">
            {{ $t("planning.clear") }}
        </button>
    </form>
    <section class="listingContainer">
        <table v-if="plannings.length" :data-theme="isDark ? 'dark' : 'light'">
            <thead>
                <tr>
                    <th>Download</th>
                    <th>{{ $t("planning.class") }}</th>
                    <th>{{ $t("planning.school") }}</th>
                    <th>{{ $t("planning.planningType") }}</th>
                    <th>{{ $t("planning.date") }}</th>
                    <th>{{ $t("planning.edit") }}</th>
                    <th>{{ $t("planning.remove") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(planning, index) in plannings" :key="planning.uuid">
                    <td
                        data-cell="Download: "
                        class="btnCellDownload"
                        @click="() => downloadDocument(index)"
                    >
                        <i class="pi pi-download"></i>
                    </td>
                    <td :data-cell="`${t('planning.class')}:`">
                        {{ planning.class_name }}
                    </td>
                    <td :data-cell="`${t('planning.school')}:`">
                        {{ planning.school_name }}
                    </td>
                    <td :data-cell="`${t('planning.planningType')}:`">
                        {{
                            planning.start_plan === planning.end_plan
                                ? t("planning.daily")
                                : t("planning.weekly")
                        }}
                    </td>
                    <td :data-cell="`${t('planning.date')}:`">
                        {{ convertIsoDateToBR(planning.start_plan.toString()) }}
                        {{
                            planning.start_plan !== planning.end_plan
                                ? `~ ${convertIsoDateToBR(planning.end_plan.toString())}`
                                : ""
                        }}
                    </td>
                    <td
                        :data-cell="`${t('planning.edit')}:`"
                        class="btnCellEdit"
                        @click="handleEditPlanningInformations(planning.uuid)"
                    >
                        <i class="pi pi-pencil"></i>
                    </td>
                    <td
                        :data-cell="`${t('planning.remove')}:`"
                        class="btnCellRemove"
                        @click="handleDeletePlanning(planning.uuid)"
                    >
                        <i class="pi pi-trash"></i>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr @click="loadDataFromPagination">
                    <td colspan="6">{{ $t("planning.loadMore") }}</td>
                </tr>
            </tfoot>
        </table>
        <div class="notFoundContainer" v-else>
            <img
                src="../../assets/sad_sleep_blue.png"
                alt="Dinossauro triste"
            />
            <h1>{{ $t("planning.notFoundedPlanning") }}</h1>
            <button
                type="button"
                class="btnGotoPlan"
                @click="handleChangeCurrentContent('design')"
            >
                <i class="pi pi-plus-circle"></i
                >{{ $t("planning.createPlanning") }}
            </button>
            <button type="button" @click="getDataFromAPI">
                <i class="pi pi-refresh"></i>{{ $t("planning.reload") }}
            </button>
        </div>
    </section>
</template>

<style
    lang="scss"
    scoped
    src="../../styles/contents/planninglistcontent.style.scss"
/>
