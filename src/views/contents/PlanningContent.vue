<script setup lang="ts">
import { ref, inject, nextTick, watchEffect, onMounted, watch } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { useI18n } from "vue-i18n";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import axios from "axios";
import type { IPlanningDay, IDays } from "../../interfaces/planning.interface";
import type { ILoadingContext } from "../../interfaces/context/loading.interface";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import type {
    IClassPlanResponse,
    IOllamaGemmaResponse,
} from "../../interfaces/ollama.res";
import type {
    IShowPreview,
    IShowPreviewContext,
} from "../../interfaces/context/showPreview.interface";
import type { ITemplateChooseContext } from "../../interfaces/context/templateChoose.interface";
import type { IDashboard } from "../../interfaces/dashboard.interface";
import { qsn as qsnPTBR } from "../../assets/qsn.json";
import qsnENUS from "../../assets/qsn_en_US.json";
import { saveAs } from "file-saver";
import { debounce } from "lodash-es";
import dayConverter from "../../helpers/dayConverter";
import { getPrompt, getPromptEN } from "../../helpers/prompt";
import backendApi from "../../api/api";
import monthConverter from "../../helpers/monthConverter";
import "@vuepic/vue-datepicker/dist/main.css";
import { useDark } from "@vueuse/core";
import type { IUser } from "../../interfaces/api/user.interface";

const isDark = useDark({
    attribute: "data-theme",
    valueLight: "light",
    valueDark: "dark",
});
const { t, locale } = useI18n();
const plans = ref<IPlanningDay>({
    day1: [""],
    day2: [""],
    day3: [""],
    day4: [""],
    day5: [""],
});
const selectedDay = ref<IDays["days"]>("day1");
const planType = ref<IShowPreview["planType"]>("Semanal");
const isOpenPlanMobileMenu = ref<boolean>(false);
const schoolName = ref("");
const className = ref("");
const planDateStart = ref("");
const planDateEnd = ref("");
const showAditionalInformation = ref(false);
const rangeDates = ref();
const isLoadingContext = inject("isLoading") as ILoadingContext;
const popupContext = inject("popup") as IPopupContext;
const showPreviewContext = inject("showPreview") as IShowPreviewContext;
const { templateChoose, handleChangeTemplateChoose } = inject(
    "templateChoose",
) as ITemplateChooseContext;

const handleChangeSelectedDay = (changeSelectDay: IDays["days"]): void => {
    selectedDay.value = changeSelectDay;
    isOpenPlanMobileMenu.value = !isOpenPlanMobileMenu.value;
};

const handleChangePlanType = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    planType.value = target.value as "Diario" | "Semanal";
};

const handleChangePlanText = (
    day: IDays["days"],
    index: number,
    classAtv: string,
): void => {
    plans.value[day][index] = classAtv.replaceAll(",", "");
};

const handleAddNewClassInPlanning = (day: IDays["days"]): void => {
    plans.value[day].push("");
};

const handleRemoveClassAtvFromPlan = (
    day: IDays["days"],
    index: number,
): void => {
    if (index === 0) return;
    plans.value[day] = plans.value[day].filter(
        (_, planIndex) => planIndex !== index,
    );
};

const handleGoBack = debounce(async () => {
    const dayNumber = Number.parseInt(selectedDay.value.split("day")[1]);
    if (dayNumber === 1) {
        selectedDay.value = `day${5}`;
        await nextTick();
        return;
    }

    selectedDay.value = `day${dayNumber - 1}` as IDays["days"];
    await nextTick();
    return;
}, 300);

const handleGoFoward = debounce(async () => {
    const dayNumber = Number.parseInt(selectedDay.value.split("day")[1]);

    if (dayNumber === 5) {
        selectedDay.value = `day${1}`;
        await nextTick();
        return;
    }

    selectedDay.value = `day${dayNumber + 1}` as IDays["days"];
    await nextTick();
    return;
}, 300);

const handleMobileMenu = (): void => {
    isOpenPlanMobileMenu.value = !isOpenPlanMobileMenu.value;
};

const hasEmptyStringsInClasses = (): Array<boolean> => {
    let day1IsEmpty = false;
    let day2IsEmpty = false;
    let day3IsEmpty = false;
    let day4IsEmpty = false;
    let day5IsEmpty = false;

    plans.value["day1"].forEach((element) =>
        element.length <= 0 ? (day1IsEmpty = true) : null,
    );
    plans.value["day2"].forEach((element) =>
        element.length <= 0 ? (day2IsEmpty = true) : null,
    );
    plans.value["day3"].forEach((element) =>
        element.length <= 0 ? (day3IsEmpty = true) : null,
    );
    plans.value["day4"].forEach((element) =>
        element.length <= 0 ? (day4IsEmpty = true) : null,
    );
    plans.value["day5"].forEach((element) =>
        element.length <= 0 ? (day5IsEmpty = true) : null,
    );

    return [day1IsEmpty, day2IsEmpty, day3IsEmpty, day4IsEmpty, day5IsEmpty];
};

const hasEmptyStringsInDiary = (): boolean => {
    let dayIsEmpty = false;

    plans.value["day1"].forEach((element) =>
        element.length <= 0 ? (dayIsEmpty = true) : null,
    );

    return dayIsEmpty;
};

const handleChangeSchoolName = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    schoolName.value = target.value;
};

const handleChangeClassName = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    className.value = target.value;
};

const handleChangeClassDateStart = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    planDateStart.value = target.value;
};

const handleChangeClassDateEnd = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    planDateEnd.value = target.value;
};

const isAditionInformationMissing = (): boolean => {
    return schoolName.value.length > 0 &&
        className.value.length > 0 &&
        planDateStart.value.length > 0 &&
        planDateEnd.value.length > 0
        ? false
        : true;
};

const stopPropagation = (event: Event): void => {
    event.stopPropagation();
};

const showTemplatePreviewChoose = () => {
    if (isAditionInformationMissing()) {
        popupContext.handleChangePopupInfo(
            `${t("design.fillAllFields")}`,
            "warning",
            true,
        );
        return;
    }
    showAditionalInformation.value = false;
    const showPreviewContextHelper = {
        isCustomDocs: "false",
        showChooseTemplate: "true",
        show: true,
        planType,
        customURLDoc: "",
    } as unknown as IShowPreview;

    showPreviewContext.handleChangeShowPreview({ ...showPreviewContextHelper });
};

const generatePlan = async () => {
    try {
        const uuid = sessionStorage.getItem("uuid");
        const dashboardResponse = (
            await backendApi.get(`/subscription/dashboard/${uuid}`)
        ).data as IDashboard;

        if (planType.value === "Semanal") {
            if (
                Number(dashboardResponse.used_weekly_planning) >=
                Number(dashboardResponse.max_amount_planning_week)
            ) {
                popupContext.handleChangePopupInfo(
                    `${t("design.missingWeeklyToken")}`,
                    "error",
                    true,
                );
                return;
            }
        } else {
            if (
                Number(dashboardResponse.used_daily_planning) >=
                Number(dashboardResponse.max_amount_planning_daily)
            ) {
                popupContext.handleChangePopupInfo(
                    `${t("design.missingWeeklyToken")}`,
                    "error",
                    true,
                );
                return;
            }
        }

        const hasEmptyStrings = hasEmptyStringsInClasses().find(
            (element) => element === true,
        );
        if (planType.value === "Semanal" && hasEmptyStrings) {
            popupContext.handleChangePopupInfo(
                `${t("design.fillAllFields")}`,
                "error",
                true,
            );
            return;
        }

        if (planType.value === "Diario") {
            let hasEmptyFields = false;

            plans.value.day1.forEach((element) => {
                if (element.length <= 0) {
                    hasEmptyFields = true;
                }
            });

            if (hasEmptyFields) {
                popupContext.handleChangePopupInfo(
                    `${t("design.fillAllFields")}`,
                    "warning",
                    true,
                );

                return;
            }
        } else {
            let hasEmptyFields = false;

            for (let i = 1; i < 6; i++) {
                const dayValue = `day${i}` as IDays["days"];
                plans.value[dayValue].forEach((element) => {
                    if (element.length <= 0) {
                        hasEmptyFields = true;
                    }
                });
            }

            if (hasEmptyFields) {
                popupContext.handleChangePopupInfo(
                    `${t("design.fillAllFields")}`,
                    "warning",
                    true,
                );

                return;
            }
        }

        isLoadingContext.handleChangeIsLoading(true);

        const user = JSON.parse(sessionStorage.getItem("user") ?? "") as IUser;

        if (planType.value === "Diario") {
            let activities = [];
            activities.push({
                day1: plans.value.day1.map((classAtv) => classAtv),
            });
            const qsnstring = JSON.stringify(qsnPTBR);
            const activity = JSON.stringify(activities);

            const response = await axios.post(import.meta.env.VITE_API_URL, {
                model: import.meta.env.VITE_LLM_MODEL,
                prompt:
                    locale.value === "pt-BR"
                        ? getPrompt(qsnstring, activity)
                        : getPromptEN(qsnstring, activity),
                stream: false,
            });

            const planejamentoQSNFetch = await fetch(
                `../../../public/planejamento${templateChoose.templateType}${templateChoose.templateStyle}.docx`,
            );
            const [arrayBuffer] = await Promise.all([
                planejamentoQSNFetch.arrayBuffer(),
            ]);
            const planZip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(planZip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            const responseData = JSON.parse(
                (response.data as IOllamaGemmaResponse).response
                    .replaceAll(/\\/g, "")
                    .replaceAll("\n", "")
                    .replaceAll("`", "")
                    .replaceAll("json", ""),
            ) as IClassPlanResponse;

            const data = {
                // header
                nomeEscola: schoolName.value,
                sala: className.value,
                diaStart: planDateStart.value.split("-")[2],
                diaEnd: planDateEnd.value.split("-")[2],
                mes: monthConverter(planDateEnd.value.split("-")[1]),
                ano: planDateEnd.value.split("-")[0],
                profName: user.full_name,

                // day 1
                eixo1: responseData.eixo,
                saber1: `${responseData.saber01}\n \n${responseData.saber02}`,
                aprendizagem1: `${responseData.aprendizagem01}\n \n${responseData.aprendizagem02}`,
                atividade1: plans.value.day1.map(
                    (item) => `${item.toString()} \n \n`,
                ),
                contextualizacao1: responseData.contextualizacao,
                foco1: responseData.foco_avaliativo,
                materiais1: responseData.materiais,
            };

            doc.render(data);
            const blob = new Blob([doc.toBlob()], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            saveAs(blob, "planejamento.docx");

            const docB64 = doc.toBase64();
            const uuid = sessionStorage.getItem("uuid");

            await backendApi.post("/planning", {
                document_b64: docB64,
                start_plan: planDateStart.value,
                end_plan: planDateStart.value,
                school_name: schoolName.value,
                class_name: className.value,
                user_id: uuid,
            });
        } else {
            let activities = [];
            for (let i = 1; i < 6; i++) {
                const dayValue = `day${i}` as IDays["days"];
                const temp = {} as Record<string, string[]>;
                temp[dayValue] = plans.value[dayValue].map(
                    (classAtv) => classAtv,
                );

                activities.push({ ...temp });
            }

            const [
                responseDay1,
                responseDay2,
                responseDay3,
                responseDay4,
                responseDay5,
            ] = await Promise.all(
                activities.map(async (item) => {
                    const qsn =
                        locale.value === "pt-BR" ? qsnPTBR : qsnENUS.qsn;
                    const qsnstring = JSON.stringify(qsn);
                    const activity = JSON.stringify(item);

                    const response = await axios.post(
                        import.meta.env.VITE_API_URL,
                        {
                            model: import.meta.env.VITE_LLM_MODEL,
                            prompt:
                                locale.value === "pt-BR"
                                    ? getPrompt(qsnstring, activity)
                                    : getPromptEN(qsnstring, activity),
                            stream: false,
                        },
                    );

                    return JSON.parse(
                        (response.data as IOllamaGemmaResponse).response
                            .replaceAll(/\\/g, "")
                            .replaceAll("\n", "")
                            .replaceAll("`", "")
                            .replaceAll("json", ""),
                    ) as IClassPlanResponse;
                }),
            );

            const planejamentoQSNFetch = await fetch(
                `../../../public/planejamento${templateChoose.templateType}${templateChoose.templateStyle}.docx`,
            );
            const [arrayBuffer] = await Promise.all([
                planejamentoQSNFetch.arrayBuffer(),
            ]);
            const planZip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(planZip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            const data = {
                // header
                nomeEscola: schoolName.value,
                sala: className.value,
                diaStart: planDateStart.value.split("-")[2],
                diaEnd: planDateEnd.value.split("-")[2],
                mes: monthConverter(planDateEnd.value.split("-")[1]),
                ano: planDateEnd.value.split("-")[0],
                profName: user.full_name,

                // day 1
                eixo1: responseDay1.eixo,
                saber1: `${responseDay1.saber01}\n \n${responseDay1.saber02}`,
                aprendizagem1: `${responseDay1.aprendizagem01}\n \n${responseDay1.aprendizagem02}`,
                atividade1: plans.value.day1.map(
                    (item) => `${item.toString()} \n \n`,
                ),
                contextualizacao1: responseDay1.contextualizacao,
                foco1: responseDay1.foco_avaliativo,
                materiais1: responseDay1.materiais,

                // day 2
                eixo2: responseDay2.eixo,
                saber2: `${responseDay2.saber01}\n${responseDay2.saber02}`,
                aprendizagem2: `${responseDay2.aprendizagem01}\n${responseDay2.aprendizagem02}`,
                atividade2: plans.value.day2.map(
                    (item) => `${item.toString()} \n \n`,
                ),
                contextualizacao2: responseDay2.contextualizacao,
                foco2: responseDay2.foco_avaliativo,
                materiais2: responseDay2.materiais,

                // day 3
                eixo3: responseDay3.eixo,
                saber3: `${responseDay3.saber01}\n \n${responseDay3.saber02}`,
                aprendizagem3: `${responseDay3.aprendizagem01}\n \n${responseDay3.aprendizagem02}`,
                atividade3: plans.value.day3.map(
                    (item) => `${item.toString()} \n \n`,
                ),
                contextualizacao3: responseDay3.contextualizacao,
                foco3: responseDay3.foco_avaliativo,
                materiais3: responseDay3.materiais,

                // day 4
                eixo4: responseDay4.eixo,
                saber4: `${responseDay4.saber01}\n \n${responseDay4.saber02}`,
                aprendizagem4: `${responseDay4.aprendizagem01}\n \n${responseDay4.aprendizagem02}`,
                atividade4: plans.value.day4.map(
                    (item) => `${item.toString()} \n \n`,
                ),
                contextualizacao4: responseDay4.contextualizacao,
                foco4: responseDay4.foco_avaliativo,
                materiais4: responseDay4.materiais,

                // day 5
                eixo5: responseDay5.eixo,
                saber5: `${responseDay5.saber01}\n \n${responseDay5.saber02}`,
                aprendizagem5: `${responseDay5.aprendizagem01}\n \n${responseDay5.aprendizagem02}`,
                atividade5: plans.value.day5.map(
                    (item) => `${item.toString()} \n \n`,
                ),
                contextualizacao5: responseDay5.contextualizacao,
                foco5: responseDay5.foco_avaliativo,
                materiais5: responseDay5.materiais,
            };

            doc.render(data);
            const blob = new Blob([doc.toBlob()], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            saveAs(blob, "planejamento.docx");

            const docB64 = doc.toBase64();
            const uuid = sessionStorage.getItem("uuid");

            await backendApi.post("/planning", {
                document_b64: docB64,
                start_plan: planDateStart.value,
                end_plan:
                    planType.value === "Semanal"
                        ? planDateEnd.value
                        : planDateStart.value,
                school_name: schoolName.value,
                class_name: className.value,
                user_id: uuid,
            });
        }

        await backendApi.patch(
            `/subscription/${planType.value === "Semanal" ? "week" : "daily"}/${dashboardResponse.subscription_id}`,
        );
        isLoadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo(
            `${t("design.successMessage")}`,
            "success",
            true,
        );
        handleChangeTemplateChoose({ ...templateChoose, choosed: false });
    } catch {
        isLoadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo(
            `${t("design.errorMessage")}`,
            "error",
            true,
        );
        handleChangeTemplateChoose({ ...templateChoose, choosed: false });
    }
};

onMounted(() => {
    handleChangeTemplateChoose({ ...templateChoose, choosed: false });
});

watchEffect(() => {
    if (templateChoose.choosed) generatePlan();
});

watch(rangeDates, () => {
    const initialDate = rangeDates.value[0].toString().split("(")[0].trim();
    const lastDate = rangeDates.value[1].toString().split("(")[0].trim();

    const initialDateHelper = new Date(initialDate);
    const lastDateHelper = new Date(lastDate);

    planDateStart.value = `${initialDateHelper.getFullYear()}-${initialDateHelper.getMonth() + 1}-${initialDateHelper.getDay()}`;
    planDateEnd.value = `${lastDateHelper.getFullYear()}-${lastDateHelper.getMonth() + 1}-${lastDateHelper.getDay()}`;
});
</script>
<template>
    <div class="planningContainer">
        <section
            class="aditionalInformationsContainer"
            v-if="showAditionalInformation"
            @click="() => (showAditionalInformation = false)"
        >
            <form
                class="aditionalInformationsForm"
                @click="(event) => stopPropagation(event)"
            >
                <h2>{{ t("design.aditionalInformations") }}</h2>

                <label>{{ t("design.schoolName") }}</label>
                <input
                    type="text"
                    :value="schoolName"
                    placeholder="Nome da escola..."
                    @change="(event) => handleChangeSchoolName(event)"
                />

                <label>{{ t("design.className") }}</label>
                <input
                    type="text"
                    :value="className"
                    placeholder="Classe ou Serie"
                    @change="(event) => handleChangeClassName(event)"
                />

                <label>{{ t("design.datePlanning") }}</label>

                <input
                    v-if="planType === 'Diario'"
                    type="date"
                    :value="planDateStart"
                    @change="
                        (event) => {
                            handleChangeClassDateStart(event);
                            handleChangeClassDateEnd(event);
                        }
                    "
                />
                <span v-else class="rangeDatePickerContainer">
                    <VueDatePicker
                        v-model="rangeDates"
                        :range="{ maxRange: 4, minRange: 4 }"
                    />
                </span>

                <span class="btnControlsContainer">
                    <button
                        :class="
                            isAditionInformationMissing()
                                ? 'btnChooseTemplateCancel'
                                : 'btnChooseTemplate'
                        "
                        type="button"
                        @click="() => showTemplatePreviewChoose()"
                    >
                        {{ t("design.chooseTemplate") }}
                    </button>
                    <button
                        @click="() => (showAditionalInformation = false)"
                        class="btnChooseTemplateCancel"
                        type="button"
                    >
                        {{ t("design.cancel") }}
                    </button>
                </span>
            </form>
        </section>

        <div class="planningSelect">
            <img src="../../assets/dinoPlanejador.png" alt="Dino planejador" />
            <span>
                <h1>{{ t("design.generatePlanning") }}</h1>
                <select
                    class="planSelect"
                    :value="planType"
                    @change="(event) => handleChangePlanType(event)"
                >
                    <option value="Diario">{{ t("design.daily") }}</option>
                    <option value="Semanal">{{ t("design.weekly") }}</option>
                </select>
            </span>
        </div>

        <!-- Diario -->

        <form v-if="planType === 'Diario'" class="dailyPlan">
            <div class="dailyPlanContentContainer">
                <section v-for="(plano, index) in plans.day1" :key="index">
                    <label
                        >📚 {{ t("design.classActivity") }}
                        {{ index + 1 }}</label
                    >
                    <span class="row">
                        <input
                            type="text"
                            :value="plano"
                            :placeholder="`${t('design.inputPlaceholder')}`"
                            @change="
                                (event) =>
                                    handleChangePlanText(
                                        'day1',
                                        index,
                                        (event.target as HTMLInputElement)
                                            .value,
                                    )
                            "
                        />
                        <button
                            v-if="index > 0"
                            type="button"
                            class="btnTrash"
                            @click="handleRemoveClassAtvFromPlan('day1', index)"
                        >
                            <i class="pi pi-trash"></i>
                        </button>
                    </span>
                </section>
            </div>
            <div class="btnContainer">
                <button
                    class="btnAddClassAtv"
                    type="button"
                    @click="handleAddNewClassInPlanning('day1')"
                >
                    <i class="pi pi-plus-circle"></i>
                    {{ t("design.addActivity") }}
                </button>

                <button
                    :class="
                        hasEmptyStringsInDiary()
                            ? 'btnDiaryGenerateCancel'
                            : 'btnDiaryGenerate'
                    "
                    type="button"
                    @click="
                        () =>
                            (showAditionalInformation = hasEmptyStringsInDiary()
                                ? false
                                : true)
                    "
                >
                    {{ t("design.forward") }}
                </button>
            </div>
        </form>

        <!-- Semanal -->
        <div v-else class="weeklyPlan">
            <ul class="weekDays">
                <li
                    @click="() => handleChangeSelectedDay('day1')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day1' ? 'selected' : '',
                    ]"
                >
                    <i
                        :class="[
                            'pi',
                            hasEmptyStringsInClasses()[0]
                                ? 'pi-clock iconUncheck'
                                : 'pi-verified iconCheck',
                        ]"
                    ></i>
                    {{ t("design.monday") }}
                </li>
                <li
                    @click="() => handleChangeSelectedDay('day2')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day2' ? 'selected' : '',
                    ]"
                >
                    <i
                        :class="[
                            'pi',
                            hasEmptyStringsInClasses()[1]
                                ? 'pi-clock iconUncheck'
                                : 'pi-verified iconCheck',
                        ]"
                    ></i>
                    {{ t("design.tuesday") }}
                </li>
                <li
                    @click="() => handleChangeSelectedDay('day3')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day3' ? 'selected' : '',
                    ]"
                >
                    <i
                        :class="[
                            'pi',
                            hasEmptyStringsInClasses()[2]
                                ? 'pi-clock iconUncheck'
                                : 'pi-verified iconCheck',
                        ]"
                    ></i>
                    {{ t("design.wednesday") }}
                </li>
                <li
                    @click="() => handleChangeSelectedDay('day4')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day4' ? 'selected' : '',
                    ]"
                >
                    <i
                        :class="[
                            'pi',
                            hasEmptyStringsInClasses()[3]
                                ? 'pi-clock iconUncheck'
                                : 'pi-verified iconCheck',
                        ]"
                    ></i>
                    {{ t("design.thursday") }}
                </li>
                <li
                    @click="() => handleChangeSelectedDay('day5')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day5' ? 'selected' : '',
                    ]"
                >
                    <i
                        :class="[
                            'pi',
                            hasEmptyStringsInClasses()[4]
                                ? 'pi-clock iconUncheck'
                                : 'pi-verified iconCheck',
                        ]"
                    ></i>
                    {{ t("design.friday") }}
                </li>
            </ul>

            <div class="weekDaysMobile">
                <div class="selectedDay">
                    <h2 class="selectedWeekDayMobile">
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[
                                    Number.parseInt(
                                        selectedDay.split('day')[1],
                                    ) - 1
                                ]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i
                        >{{ dayConverter(selectedDay) }}
                    </h2>
                    <button
                        class="btnChangeWeekMobile"
                        @click="() => handleMobileMenu()"
                    >
                        <i
                            :class="[
                                'pi',
                                isOpenPlanMobileMenu
                                    ? 'pi-chevron-up'
                                    : 'pi-chevron-down',
                            ]"
                        ></i>
                    </button>
                </div>
                <ul v-if="isOpenPlanMobileMenu === true" class="mobileDayLists">
                    <li
                        :class="[
                            'mobileDayItemList',
                            selectedDay === 'day1' ? 'mobileDaySelected' : '',
                        ]"
                        @click="() => handleChangeSelectedDay('day1')"
                    >
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[0]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i>
                        {{ t("design.monday") }}
                    </li>
                    <li
                        :class="[
                            'mobileDayItemList',
                            selectedDay === 'day2' ? 'mobileDaySelected' : '',
                        ]"
                        @click="() => handleChangeSelectedDay('day2')"
                    >
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[1]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i>
                        {{ t("design.tuesday") }}
                    </li>
                    <li
                        :class="[
                            'mobileDayItemList',
                            selectedDay === 'day3' ? 'mobileDaySelected' : '',
                        ]"
                        @click="() => handleChangeSelectedDay('day3')"
                    >
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[2]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i>
                        {{ t("design.wednesday") }}
                    </li>
                    <li
                        :class="[
                            'mobileDayItemList',
                            selectedDay === 'day4' ? 'mobileDaySelected' : '',
                        ]"
                        @click="() => handleChangeSelectedDay('day4')"
                    >
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[3]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i>
                        {{ t("design.thursday") }}
                    </li>
                    <li
                        :class="[
                            'mobileDayItemList',
                            selectedDay === 'day5' ? 'mobileDaySelected' : '',
                        ]"
                        @click="() => handleChangeSelectedDay('day5')"
                    >
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[4]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i>
                        {{ t("design.friday") }}
                    </li>
                </ul>
                <span v-else></span>
            </div>

            <div
                class="classContentContainer"
                :data-theme="isDark ? 'dark' : 'light'"
            >
                <div class="classContent">
                    <div
                        v-for="(value, index) in plans[selectedDay]"
                        :key="index"
                        class="classWrapper"
                    >
                        <span class="classDescription">
                            <h2 :data-theme="isDark ? 'dark' : 'light'">
                                📚 {{ t("design.classActivity") }}
                                {{ index + 1 }}:
                            </h2>
                            <input
                                type="text"
                                :placeholder="`${t('design.inputPlaceholder')}`"
                                :value="value"
                                @change="
                                    (event) =>
                                        handleChangePlanText(
                                            selectedDay,
                                            index,
                                            (event.target! as HTMLInputElement)
                                                .value,
                                        )
                                "
                            />
                        </span>
                        <button
                            @click="
                                () =>
                                    handleRemoveClassAtvFromPlan(
                                        selectedDay,
                                        index,
                                    )
                            "
                            :class="
                                index === 0
                                    ? 'btnRemoveClassCancel'
                                    : 'btnRemoveClass'
                            "
                        >
                            <i class="pi pi-trash"></i>
                        </button>
                    </div>
                </div>

                <span class="btnControlsContainer">
                    <button @click="() => handleGoBack()">
                        <i class="pi pi-arrow-left"></i> {{ t("design.back") }}
                    </button>
                    <button
                        @click="() => handleAddNewClassInPlanning(selectedDay)"
                    >
                        <i class="pi pi-plus-circle"></i>
                        {{ t("design.addActivity") }}
                    </button>
                    <button @click="() => handleGoFoward()">
                        {{ t("design.forward") }}
                        <i class="pi pi-arrow-right"></i>
                    </button>
                </span>
            </div>
        </div>
        <button
            :class="
                hasEmptyStringsInClasses().find((element) => element === true)
                    ? 'btnGeneratePlanCancel'
                    : 'btnGeneratePlan'
            "
            v-if="planType === 'Semanal'"
            type="button"
            @click="
                () =>
                    (showAditionalInformation = hasEmptyStringsInClasses().find(
                        (element) => element === true,
                    )
                        ? false
                        : true)
            "
        >
            {{ t("design.forward") }}
        </button>
    </div>
</template>

<style
    src="../../styles/contents/planningcontent.style.scss"
    scoped
    lang="scss"
/>
