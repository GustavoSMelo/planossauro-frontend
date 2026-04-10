<script setup lang="ts">
import { ref, inject, nextTick, watchEffect, onMounted, watch } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { useI18n } from "vue-i18n";
import { useDark } from "@vueuse/core";
import { saveAs } from "file-saver";
import { debounce } from "lodash-es";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import confetti from "@hiseb/confetti";
import axios, { type AxiosResponse } from "axios";
import "@vuepic/vue-datepicker/dist/main.css";
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
import type { IUser } from "../../interfaces/api/user.interface";
import qsnENUS from "../../assets/qsn_en_US.json";
import dayConverter from "../../helpers/dayConverter";
import backendApi from "../../api/api";
import monthConverter from "../../helpers/monthConverter";
import sanitizeInput from "../../helpers/sanitizeInput";
import { getPrompt, getPromptEN } from "../../helpers/prompt";
import { qsn as qsnPTBR } from "../../assets/qsn.json";
import type { IPlanningTypeContext } from "../../interfaces/context/planningType.interface";
import ClassTimeConfigPopup from "../../components/ClassTimeConfigPopup/ClassTimeConfigPopup.vue";

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
const sessionInitialHour = sessionStorage.getItem("initial_hour") || "12:00";
const sessionInterval = sessionStorage.getItem("interval") || "0:30";
const intervalMinutes = ref(
    parseInt(sessionInterval.split(":")[0]) * 60 +
        parseInt(sessionInterval.split(":")[1]),
);

const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
};

const sessionEndHour = addMinutesToTime(
    sessionInitialHour,
    intervalMinutes.value,
);

const startClassHour = ref({
    day1: [sessionInitialHour],
    day2: [sessionInitialHour],
    day3: [sessionInitialHour],
    day4: [sessionInitialHour],
    day5: [sessionInitialHour],
});
const endClassHour = ref({
    day1: [sessionEndHour],
    day2: [sessionEndHour],
    day3: [sessionEndHour],
    day4: [sessionEndHour],
    day5: [sessionEndHour],
});
const selectedDay = ref<IDays["days"]>("day1");
const planType = ref<IShowPreview["planType"]>("Semanal");
const isOpenPlanMobileMenu = ref<boolean>(false);
const schoolName = ref("");
const className = ref("");
const planDateStart = ref("");
const planDateEnd = ref("");
const showAditionalInformation = ref(false);
const showClassTimeConfig = ref(false);
const selectedWeek = ref();
const selectedElement = ref<number | null>(null);
const dragSourceDay = ref<IDays["days"] | null>(null);

const { planningType, handleChangePlanningType } = inject(
    "planningType",
) as IPlanningTypeContext;
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
    handleChangePlanningType(target.value as "Diario" | "Semanal");
};

const handleChangePlanText = (
    day: IDays["days"],
    index: number,
    classAtv: string,
): void => {
    plans.value[day][index] = classAtv.replaceAll(",", "");
};

const handleChangeStartClassHour = (
    day: IDays["days"],
    index: number,
    hour: string,
): void => {
    startClassHour.value[day][index] = hour;
};

const handleChangeEndClassHour = (
    day: IDays["days"],
    index: number,
    hour: string,
): void => {
    endClassHour.value[day][index] = hour;
};

const handleAddNewClassInPlanning = (day: IDays["days"]): void => {
    plans.value[day].push("");
    const lastEndHour =
        endClassHour.value[day][endClassHour.value[day].length - 1];
    const newStartHour = lastEndHour;
    const newEndHour = addMinutesToTime(lastEndHour, intervalMinutes.value);
    startClassHour.value[day].push(newStartHour);
    endClassHour.value[day].push(newEndHour);
};

const handleRemoveClassAtvFromPlan = (
    day: IDays["days"],
    index: number,
): void => {
    if (index === 0) return;
    plans.value[day].splice(index, 1);
    startClassHour.value[day].splice(index, 1);
    endClassHour.value[day].splice(index, 1);

    for (let i = 1; i < endClassHour.value[day].length; i++) {
        startClassHour.value[day][i] = endClassHour.value[day][i - 1];
        endClassHour.value[day][i] = addMinutesToTime(
            startClassHour.value[day][i],
            intervalMinutes.value,
        );
    }

    const combined = plans.value[day].map((plan, i) => ({
        plan,
        start: startClassHour.value[day][i],
        end: endClassHour.value[day][i],
    }));
    combined.sort((a, b) => a.start.localeCompare(b.start));

    plans.value[day] = combined.map((c) => c.plan);
    startClassHour.value[day] = combined.map((c) => c.start);
    endClassHour.value[day] = combined.map((c) => c.end);
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
    planDateEnd.value = (event.target as HTMLInputElement).value;
};

const handleSaveClassTimeConfig = (
    newInitialHour: string,
    newInterval: string,
) => {
    sessionStorage.setItem("initial_hour", newInitialHour);
    sessionStorage.setItem("interval", newInterval);

    const newIntervalMinutes =
        parseInt(newInterval.split(":")[0]) * 60 +
        parseInt(newInterval.split(":")[1]);
    intervalMinutes.value = newIntervalMinutes;
    const newEndHour = addMinutesToTime(newInitialHour, newIntervalMinutes);

    const days: IDays["days"][] = ["day1", "day2", "day3", "day4", "day5"];

    days.forEach((day) => {
        if (startClassHour.value[day].length > 0) {
            startClassHour.value[day][0] = newInitialHour;
            endClassHour.value[day][0] = newEndHour;
        }
        for (let i = 1; i < startClassHour.value[day].length; i++) {
            startClassHour.value[day][i] = endClassHour.value[day][i - 1];
            endClassHour.value[day][i] = addMinutesToTime(
                startClassHour.value[day][i],
                newIntervalMinutes,
            );
        }
    });
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

const onDragStart = (day: IDays["days"], index: number): void => {
    selectedElement.value = index;
    dragSourceDay.value = day;
};

const handleDragOver = (event: DragEvent): void => {
    event.preventDefault();
};

const onDragEnd = (): void => {
    selectedElement.value = null;
    dragSourceDay.value = null;
};

const handleDrop = (day: IDays["days"], dropIndex: number): void => {
    if (selectedElement.value === null || dragSourceDay.value !== day) return;

    const sourceIndex = selectedElement.value;
    if (sourceIndex === dropIndex) return;

    const tempPlan = plans.value[day][sourceIndex];
    const tempStart = startClassHour.value[day][sourceIndex];
    const tempEnd = endClassHour.value[day][sourceIndex];

    plans.value[day].splice(sourceIndex, 1);
    plans.value[day].splice(dropIndex, 0, tempPlan);

    startClassHour.value[day].splice(sourceIndex, 1);
    startClassHour.value[day].splice(dropIndex, 0, tempStart);

    endClassHour.value[day].splice(sourceIndex, 1);
    endClassHour.value[day].splice(dropIndex, 0, tempEnd);

    selectedElement.value = null;
    dragSourceDay.value = null;
};

const moveClassUp = (index: number): void => {
    if (index <= 0) return;
    const day = selectedDay.value;

    const tempPlan = plans.value[day][index];
    plans.value[day][index] = plans.value[day][index - 1];
    plans.value[day][index - 1] = tempPlan;

    const tempStart = startClassHour.value[day][index];
    startClassHour.value[day][index] = startClassHour.value[day][index - 1];
    startClassHour.value[day][index - 1] = tempStart;

    const tempEnd = endClassHour.value[day][index];
    endClassHour.value[day][index] = endClassHour.value[day][index - 1];
    endClassHour.value[day][index - 1] = tempEnd;
};

const moveClassDown = (index: number): void => {
    const day = selectedDay.value;
    if (index >= plans.value[day].length - 1) return;

    const tempPlan = plans.value[day][index];
    plans.value[day][index] = plans.value[day][index + 1];
    plans.value[day][index + 1] = tempPlan;

    const tempStart = startClassHour.value[day][index];
    startClassHour.value[day][index] = startClassHour.value[day][index + 1];
    startClassHour.value[day][index + 1] = tempStart;

    const tempEnd = endClassHour.value[day][index];
    endClassHour.value[day][index] = endClassHour.value[day][index + 1];
    endClassHour.value[day][index + 1] = tempEnd;
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
        const uuid = JSON.parse(
            sessionStorage.getItem("user") ?? "{uuid: ''}",
        ).uuid;
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
        const fullName = (await backendApi.get(`/user/${user.uuid}`)).data
            .full_name;

        if (planType.value === "Diario") {
            let activities = [];
            activities.push({
                day1: plans.value.day1.map((classAtv) =>
                    sanitizeInput(classAtv),
                ),
            });
            const qsnstring = JSON.stringify(qsnPTBR);
            const activity = JSON.stringify(activities);

            let response: AxiosResponse | null = null;

            if (import.meta.env.VITE_APP_MODE === "local") {
                response = await axios.post(import.meta.env.VITE_API_URL, {
                    model: import.meta.env.VITE_LLM_MODEL,
                    prompt:
                        locale.value === "pt-BR"
                            ? getPrompt(qsnstring, activity)
                            : getPromptEN(qsnstring, activity),
                    stream: false,
                });
            } else {
                response = await backendApi.post("/planning/create", {
                    prompt:
                        locale.value === "pt-BR"
                            ? getPrompt(qsnstring, activity)
                            : getPromptEN(qsnstring, activity),
                });
            }

            const planejamentoQSNFetch = await fetch(
                new URL(
                    `../../assets/planejamento${templateChoose.templateType}${templateChoose.templateStyle}.docx`,
                    import.meta.url,
                ).href,
            );
            const [arrayBuffer] = await Promise.all([
                planejamentoQSNFetch.arrayBuffer(),
            ]);
            const planZip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(planZip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            let responseData: IClassPlanResponse = {
                contextualizacao: "",
                aprendizagem: [""],
                saber: [""],
                eixo: [""],
                foco_avaliativo: [""],
                materiais: "",
            };

            if (response && import.meta.env.VITE_APP_MODE === "prod") {
                responseData = JSON.parse(
                    response.data.message
                        .toString()
                        .replaceAll("\n", "")
                        .replaceAll("`", "")
                        .replaceAll("json", "")
                        .replaceAll("-", ""),
                ) as IClassPlanResponse;
            } else if (response) {
                // [TODO] - CRIAR UM SISTEMA PARA CHECKAR A TIPAGEM DO JSON, SE FOR STRING, CAST TO JSON AND FIX IT
                responseData = JSON.parse(
                    response!.data.response
                        .replaceAll("\n", "")
                        .replaceAll("`", "")
                        .replaceAll("json", "")
                        .replaceAll("-", ""),
                );
            }

            const data = {
                // header
                nomeEscola: schoolName.value,
                sala: className.value,
                diaStart: planDateStart.value.split("-")[2],
                diaEnd: planDateEnd.value.split("-")[2],
                mes: monthConverter(planDateEnd.value.split("-")[1]),
                ano: planDateEnd.value.split("-")[0],
                profName: fullName,

                // day 1
                eixo1: responseData.eixo
                    .map((item) => item.toString())
                    .join("\n \n"),
                saber1: `${responseData.saber.map((item) => item.toString()).join("\n \n")}\n \n`,
                aprendizagem1: `${responseData.aprendizagem.map((item) => item.toString()).join("\n \n")}\n \n`,
                atividade1: plans.value.day1
                    .map((item, index) =>
                        `${item.toString()} - (${startClassHour.value.day1[index]} Hr ~ ${endClassHour.value.day1[index]} Hr)`.toString(),
                    )
                    .join("\n \n"),
                contextualizacao1: responseData.contextualizacao,
                foco1: responseData.foco_avaliativo
                    .map((item) => item.toString())
                    .join("\n \n"),
                materiais1: responseData.materiais,
            };

            doc.render(data);
            const blob = new Blob([doc.toBlob()], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            saveAs(blob, "planejamento.docx");

            const docB64 = doc.toBase64();
            const uuid = JSON.parse(
                sessionStorage.getItem("user") ?? "{uuid: ''}",
            ).uuid;

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
                temp[dayValue] = plans.value[dayValue].map((classAtv) =>
                    sanitizeInput(classAtv),
                );

                activities.push({ ...temp });
            }

            const [
                responseDay1,
                responseDay2,
                responseDay3,
                responseDay4,
                responseDay5,
            ]: IClassPlanResponse[] = await Promise.all(
                activities.map(async (item) => {
                    const qsn =
                        locale.value === "pt-BR" ? qsnPTBR : qsnENUS.qsn;
                    const qsnstring = JSON.stringify(qsn);
                    const activity = sanitizeInput(
                        JSON.stringify(item),
                    ).toString();

                    let response: AxiosResponse | null = null;

                    if (import.meta.env.VITE_APP_MODE === "local") {
                        response = await axios.post(
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
                    } else {
                        response = await backendApi.post("/planning/create", {
                            prompt:
                                locale.value === "pt-BR"
                                    ? getPrompt(qsnstring, activity)
                                    : getPromptEN(qsnstring, activity),
                        });
                    }

                    if (response && import.meta.env.VITE_APP_MODE === "local") {
                        return JSON.parse(
                            (response.data as IOllamaGemmaResponse).response
                                .toString()
                                .replaceAll("\\", "")
                                .replaceAll("\n", "")
                                .replaceAll("`", "")
                                .replaceAll("json", "")
                                .replaceAll("-", ""),
                        ) as IClassPlanResponse;
                    }
                    return JSON.parse(response!.data.message);
                }),
            );

            const planejamentoQSNFetch = await fetch(
                new URL(
                    `../../assets/planejamento${templateChoose.templateType}${templateChoose.templateStyle}.docx`,
                    import.meta.url,
                ).href,
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
                profName: fullName,

                // day 1
                eixo1: responseDay1.eixo
                    .map((item) => item.toString())
                    .join("\n \n"),
                saber1: `${responseDay1.saber.map((item) => item.toString()).join("\n")}\n`,
                aprendizagem1: `${responseDay1.aprendizagem.map((item) => item.toString()).join("\n")}\n`,
                atividade1: plans.value.day1
                    .map(
                        (item, index) =>
                            `${item.toString()} - (${startClassHour.value.day1[index]} Hr ~ ${endClassHour.value.day1[index]} Hr) \n \n`,
                    )
                    .join("\n \n"),
                contextualizacao1: responseDay1.contextualizacao,
                foco1: responseDay1.foco_avaliativo
                    .map((item) => item.toString())
                    .join("\n \n"),
                materiais1: responseDay1.materiais,

                // day 2
                eixo2: responseDay2.eixo
                    .map((item) => item.toString())
                    .join("\n \n"),
                saber2: `${responseDay2.saber.map((item) => item.toString()).join("\n \n")}\n`,
                aprendizagem2: `${responseDay2.aprendizagem.map((item) => item.toString()).join("\n \n")}\n`,
                atividade2: plans.value.day2
                    .map(
                        (item, index) =>
                            `${item.toString()} - (${startClassHour.value.day2[index]} Hr ~ ${endClassHour.value.day2[index]} Hr) \n \n`,
                    )
                    .join("\n \n"),
                contextualizacao2: responseDay2.contextualizacao,
                foco2: responseDay2.foco_avaliativo
                    .map((item) => item.toString())
                    .join("\n \n"),
                materiais2: responseDay2.materiais,

                // day 3
                eixo3: responseDay3.eixo
                    .map((item) => item.toString())
                    .join("\n \n"),
                saber3: `${responseDay3.saber.map((item) => item.toString()).join("\n \n")}\n`,
                aprendizagem3: `${responseDay3.aprendizagem.map((item) => item.toString()).join("\n \n")}\n`,
                atividade3: plans.value.day3
                    .map(
                        (item, index) =>
                            `${item.toString()} - (${startClassHour.value.day3[index]} Hr ~ ${endClassHour.value.day3[index]} Hr) \n \n`,
                    )
                    .join("\n \n"),
                contextualizacao3: responseDay3.contextualizacao,
                foco3: responseDay3.foco_avaliativo
                    .map((item) => item.toString())
                    .join("\n \n"),
                materiais3: responseDay3.materiais,

                // day 4
                eixo4: responseDay4.eixo
                    .map((item) => item.toString())
                    .join("\n"),
                saber4: `${responseDay4.saber.map((item) => item.toString()).join("\n \n")}\n`,
                aprendizagem4: `${responseDay4.aprendizagem.map((item) => item.toString()).join("\n \n")}\n`,
                atividade4: plans.value.day4
                    .map(
                        (item, index) =>
                            `${item.toString()} - (${startClassHour.value.day4[index]} Hr ~ ${endClassHour.value.day4[index]} Hr) \n \n`,
                    )
                    .join("\n \n"),
                contextualizacao4: responseDay4.contextualizacao,
                foco4: responseDay4.foco_avaliativo
                    .map((item) => item.toString())
                    .join("\n \n"),
                materiais4: responseDay4.materiais,

                // day 5
                eixo5: responseDay5.eixo
                    .map((item) => item.toString())
                    .join("\n \n"),
                saber5: `${responseDay5.saber.map((item) => item.toString()).join("\n \n")}\n`,
                aprendizagem5: `${responseDay5.aprendizagem.map((item) => item.toString()).join("\n \n")}\n`,
                atividade5: plans.value.day5
                    .map(
                        (item, index) =>
                            `${item.toString()} - (${startClassHour.value.day5[index]} Hr ~ ${endClassHour.value.day5[index]} Hr) \n \n`,
                    )
                    .join("\n \n"),
                contextualizacao5: responseDay5.contextualizacao,
                foco5: responseDay5.foco_avaliativo
                    .map((item) => item.toString())
                    .join("\n \n"),
                materiais5: responseDay5.materiais,
            };

            doc.render(data);
            const blob = new Blob([doc.toBlob()], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            saveAs(blob, "planejamento.docx");

            const docB64 = doc.toBase64();
            const uuid = JSON.parse(
                sessionStorage.getItem("user") ?? "{uuid: ''}",
            ).uuid;

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
        confetti({
            fade: true,
            velocity: 200,
            size: 1.6,
            count: 230,
            position: {
                x: window.innerWidth * 0.5,
                y: window.innerHeight * 0.5,
            },
        });
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
    planType.value = planningType.value;
    handleChangeTemplateChoose({ ...templateChoose, choosed: false });
});

watchEffect(() => {
    if (templateChoose.choosed) generatePlan();
});

watch(selectedWeek, () => {
    if (!selectedWeek.value) return;

    planDateStart.value = `${selectedWeek.value[0].getFullYear()}-${String(selectedWeek.value[0].getMonth() + 1).padStart(2, "0")}-${String(selectedWeek.value[0].getDate()).padStart(2, "0")}`;
    planDateEnd.value = `${selectedWeek.value[1].getFullYear()}-${String(selectedWeek.value[1].getMonth() + 1).padStart(2, "0")}-${String(selectedWeek.value[1].getDate() - 2).padStart(2, "0")}`;
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
                    @input="(event) => handleChangeSchoolName(event)"
                />

                <label>{{ t("design.className") }}</label>
                <input
                    type="text"
                    :value="className"
                    placeholder="Classe ou Serie"
                    @input="(event) => handleChangeClassName(event)"
                />

                <label>{{ t("design.datePlanning") }}</label>

                <input
                    v-if="planType === 'Diario'"
                    type="date"
                    :value="planDateStart"
                    @input="
                        (event) => {
                            handleChangeClassDateStart(event);
                            handleChangeClassDateEnd(event);
                        }
                    "
                />
                <span v-else class="rangeDatePickerContainer">
                    <VueDatePicker
                        v-model="selectedWeek"
                        week-picker
                        class="rangeDatePicker"
                        :style="{
                            '--dp-background-color': 'transparent',
                            '--dp-border-color': '#e9688c',
                            '--dp-border-color-hover': '#e9688c',
                            '--dp-text-color': '#e9688c',
                        }"
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

        <div class="planningSelect" id="planningSelect">
            <img src="../../assets/dinoPlanejador.png" alt="Dino planejador" />
            <span>
                <h1>{{ t("design.generatePlanning") }}</h1>
                <div class="selectAndConfig">
                    <select
                        class="planSelect"
                        :value="planType"
                        @change="(event) => handleChangePlanType(event)"
                    >
                        <option value="Diario">{{ t("design.daily") }}</option>
                        <option value="Semanal">
                            {{ t("design.weekly") }}
                        </option>
                    </select>
                    <button
                        type="button"
                        class="btnConfigTime"
                        @click="showClassTimeConfig = true"
                        :title="t('design.configureTime')"
                    >
                        <i class="pi pi-cog"></i>
                    </button>
                </div>
            </span>
        </div>

        <ClassTimeConfigPopup
            v-model:show="showClassTimeConfig"
            @save="handleSaveClassTimeConfig"
        />

        <!-- Diario -->

        <form v-if="planType === 'Diario'" class="dailyPlan">
            <div class="dailyPlanContentContainer">
                <section v-for="(plano, index) in plans.day1" :key="index">
                    <label
                        >📚 {{ t("design.classActivity") }}
                        {{ index + 1 }}</label
                    >
                    <span
                        class="row"
                        :class="{
                            dragging:
                                selectedElement === index ? 'dragging' : '',
                        }"
                        draggable="true"
                        @dragstart="() => onDragStart(selectedDay, index)"
                        @dragover="(event) => handleDragOver(event)"
                        @drop="() => handleDrop(selectedDay, index)"
                        @dragend="() => onDragEnd()"
                    >
                        <div class="hourClass">
                            <i class="pi pi-arrows-v iconReposition"></i>
                            <div class="repositionButtonsContainer"></div>
                            <input
                                class="dailyInputDesign"
                                type="text"
                                :value="plano"
                                :placeholder="`${t('design.inputPlaceholder')}`"
                                @input="
                                    (event) =>
                                        handleChangePlanText(
                                            'day1',
                                            index,
                                            (event.target as HTMLInputElement)
                                                .value,
                                        )
                                "
                            />
                            <div class="timeInputContainer">
                                <span class="buttonRepositionContainer">
                                    <button
                                        class="repositionButton"
                                        type="button"
                                        @click="moveClassUp(index)"
                                    >
                                        <i class="pi pi-arrow-up"></i>
                                    </button>

                                    <button
                                        class="repositionButton"
                                        type="button"
                                        @click="moveClassDown(index)"
                                    >
                                        <i class="pi pi-arrow-down"></i>
                                    </button>
                                </span>
                                <input
                                    class="timeInput timeInputStart"
                                    type="time"
                                    lang="pt-BR"
                                    step="900"
                                    title="Inicio da aula"
                                    :value="startClassHour[selectedDay][index]"
                                    @input="
                                        (event) =>
                                            handleChangeStartClassHour(
                                                'day1',
                                                index,
                                                (
                                                    event.target! as HTMLInputElement
                                                ).value,
                                            )
                                    "
                                />
                                <input
                                    class="timeInput timeInputEnd"
                                    type="time"
                                    lang="pt-BR"
                                    step="900"
                                    title="Fim da aula"
                                    :value="endClassHour[selectedDay][index]"
                                    @input="
                                        (event) =>
                                            handleChangeEndClassHour(
                                                'day1',
                                                index,
                                                (
                                                    event.target! as HTMLInputElement
                                                ).value,
                                            )
                                    "
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            :class="index > 0 ? 'btnTrash' : 'btnTrashDisabled'"
                            @click="
                                index > 0
                                    ? handleRemoveClassAtvFromPlan(
                                          'day1',
                                          index,
                                      )
                                    : null
                            "
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
                    id="btnDiaryGenerate"
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
        <div v-else class="weeklyPlan" id="weeklyPlan">
            <ul class="weekDays" id="weekDays">
                <li
                    @click="() => handleChangeSelectedDay('day1')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day1' ? 'selected' : '',
                    ]"
                >
                    <i
                        id="iconHelp"
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
                <div class="selectedDay" id="selectedDay">
                    <h2
                        class="selectedWeekDayMobile"
                        @click="() => handleMobileMenu()"
                    >
                        <i
                            :class="[
                                'pi',
                                'iconClock',
                                'iconHelp',
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
                        :class="{
                            dragging:
                                selectedElement === index ? 'dragging' : '',
                        }"
                        draggable="true"
                        @dragstart="() => onDragStart(selectedDay, index)"
                        @dragover="(event) => handleDragOver(event)"
                        @drop="() => handleDrop(selectedDay, index)"
                        @dragend="() => onDragEnd()"
                    >
                        <span class="classDescription">
                            <h2 :data-theme="isDark ? 'dark' : 'light'">
                                📚 {{ t("design.classActivity") }}
                                {{ index + 1 }}:
                            </h2>
                            <div class="hourClass">
                                <i class="pi pi-arrows-v iconReposition"></i>
                                <input
                                    class="inputDescriptionText"
                                    type="text"
                                    :placeholder="`${t('design.inputPlaceholder')}`"
                                    :value="value"
                                    @input="
                                        (event) =>
                                            handleChangePlanText(
                                                selectedDay,
                                                index,
                                                (
                                                    event.target! as HTMLInputElement
                                                ).value,
                                            )
                                    "
                                />
                                <span>
                                    <span class="buttonRepositionContainer">
                                        <button
                                            class="repositionButton"
                                            type="button"
                                            @click="moveClassUp(index)"
                                        >
                                            <i class="pi pi-arrow-up"></i>
                                        </button>

                                        <button
                                            class="repositionButton"
                                            type="button"
                                            @click="moveClassDown(index)"
                                        >
                                            <i class="pi pi-arrow-down"></i>
                                        </button>
                                    </span>
                                    <input
                                        class="timeInput timeInputStart"
                                        type="time"
                                        lang="pt-BR"
                                        step="900"
                                        title="Inicio da aula"
                                        :value="
                                            startClassHour[selectedDay][index]
                                        "
                                        @input="
                                            (event) =>
                                                handleChangeStartClassHour(
                                                    selectedDay,
                                                    index,
                                                    (
                                                        event.target! as HTMLInputElement
                                                    ).value,
                                                )
                                        "
                                    />
                                    <input
                                        class="timeInput timeInputEnd"
                                        type="time"
                                        lang="pt-BR"
                                        step="900"
                                        title="Fim da aula"
                                        :value="
                                            endClassHour[selectedDay][index]
                                        "
                                        @input="
                                            (event) =>
                                                handleChangeEndClassHour(
                                                    selectedDay,
                                                    index,
                                                    (
                                                        event.target! as HTMLInputElement
                                                    ).value,
                                                )
                                        "
                                    />
                                </span>
                            </div>
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
                    <button id="btnPreviousDay" @click="() => handleGoBack()">
                        <i class="pi pi-arrow-left"></i> {{ t("design.back") }}
                    </button>
                    <button
                        id="btnAddActivity"
                        @click="() => handleAddNewClassInPlanning(selectedDay)"
                    >
                        <i class="pi pi-plus-circle"></i>
                        {{ t("design.addActivity") }}
                    </button>
                    <button id="btnForwardDay" @click="() => handleGoFoward()">
                        {{ t("design.forward") }}
                        <i class="pi pi-arrow-right"></i>
                    </button>
                </span>
            </div>
        </div>
        <button
            id="btnGeneratePlan"
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
            :title="
                hasEmptyStringsInClasses().find((element) => element === true)
                    ? 'Planejamento nao finalizado'
                    : 'Avancar'
            "
        >
            {{ t("design.forward") }}
        </button>
    </div>
</template>

<style
    src="../../styles/contents/designcontent.style.scss"
    scoped
    lang="scss"
/>
