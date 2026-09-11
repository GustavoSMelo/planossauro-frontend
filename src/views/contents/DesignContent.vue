<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";
import { ref, inject, nextTick, onMounted, watch } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import { useI18n } from "vue-i18n";
import { saveAs } from "file-saver";
import { debounce } from "lodash-es";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import confetti from "@hiseb/confetti";
import axios, { type AxiosResponse } from "axios";
import qsnENUS from "../../assets/qsn_en_US.json";
import backendApi from "../../api/api";
import monthConverter from "../../helpers/monthConverter";
import sanitizeInput from "../../helpers/sanitizeInput";
import { getPrompt, getPromptEN } from "../../helpers/prompt";
import {
    getContextWeeklyPrompt,
    getContextWeeklyPromptEN,
} from "../../helpers/prompt";
import { qsn as qsnPTBR } from "../../assets/qsn.json";
import { extractResponseData } from "../../helpers/createPlanningHelper";
import ClassTimeConfigPopup from "../../components/ClassTimeConfigPopup/ClassTimeConfigPopup.vue";
import DailyPlan from "../../components/DailyPlan/DailyPlan.vue";
import WeeklyPlan from "../../components/WeeklyPlan/WeeklyPlan.vue";
import ContextPlan from "../../components/ContextPlan/ContextPlan.vue";
import type { IPlanningTypeContext } from "../../interfaces/context/planningType.interface";
import type { IPlanningDay, IDays } from "../../interfaces/planning.interface";
import type { ILoadingContext } from "../../interfaces/context/loading.interface";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import type { IClassPlanResponse } from "../../interfaces/ollama.res";
import type {
    IShowPreview,
    IShowPreviewContext,
} from "../../interfaces/context/showPreview.interface";
import type { ITemplateChooseContext } from "../../interfaces/context/templateChoose.interface";
import type { IDashboard } from "../../interfaces/dashboard.interface";
import type { IUser } from "../../interfaces/api/user.interface";

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
const contextText = ref("");
const classCount = ref(3);

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
    planType.value = target.value as "Diario" | "Semanal" | "Contexto";
    handleChangePlanningType(
        target.value as "Diario" | "Semanal" | "Contexto",
    );
};

const handleChangeContextText = (event: Event) => {
    const target = event.target as HTMLInputElement;
    contextText.value = target.value;
};

const handleIncrementClassCount = (): void => {
    if (classCount.value < 10) classCount.value++;
};

const handleDecrementClassCount = (): void => {
    if (classCount.value > 1) classCount.value--;
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
    const effectivePreviewPlanType =
        planType.value === "Contexto" ? "Semanal" : planType.value;
    const showPreviewContextHelper = {
        isCustomDocs: "false",
        showChooseTemplate: "true",
        show: true,
        planType: effectivePreviewPlanType as IShowPreview["planType"],
        customURLDoc: "",
    } as unknown as IShowPreview;

    showPreviewContext.handleChangeShowPreview({ ...showPreviewContextHelper });
};

const handleDailyForward = (): void => {
    showAditionalInformation.value = hasEmptyStringsInDiary() ? false : true;
};

const handleWeeklyForward = (): void => {
    const hasEmpty = hasEmptyStringsInClasses().find(
        (element) => element === true,
    );
    showAditionalInformation.value = hasEmpty ? false : true;
};

const handleApplyContextActivities = (
    day: IDays["days"],
    activities: string[],
): void => {
    plans.value[day] = activities;

    const baseStart =
        sessionStorage.getItem("initial_hour") || sessionInitialHour;
    const starts: string[] = [];
    const ends: string[] = [];

    for (let i = 0; i < activities.length; i++) {
        if (i === 0) {
            starts.push(baseStart);
            ends.push(addMinutesToTime(baseStart, intervalMinutes.value));
        } else {
            starts.push(ends[i - 1]);
            ends.push(addMinutesToTime(ends[i - 1], intervalMinutes.value));
        }
    }

    startClassHour.value[day] = starts;
    endClassHour.value[day] = ends;
    selectedDay.value = day;
};

const handleApplyWeeklyContext = (planning: IPlanningDay): void => {
    const baseStart =
        sessionStorage.getItem("initial_hour") || sessionInitialHour;
    const days: IDays["days"][] = ["day1", "day2", "day3", "day4", "day5"];

    for (const day of days) {
        const activities = planning[day];
        if (!activities || activities.length === 0) continue;
        plans.value[day] = activities.map((a) => a.replaceAll(",", "").trim());

        const starts: string[] = [];
        const ends: string[] = [];
        for (let i = 0; i < plans.value[day].length; i++) {
            if (i === 0) {
                starts.push(baseStart);
                ends.push(addMinutesToTime(baseStart, intervalMinutes.value));
            } else {
                starts.push(ends[i - 1]);
                ends.push(addMinutesToTime(ends[i - 1], intervalMinutes.value));
            }
        }
        startClassHour.value[day] = starts;
        endClassHour.value[day] = ends;
    }
    selectedDay.value = "day1";
};

const isLocalMode = (): boolean =>
    import.meta.env.VITE_APP_MODE === "local";

const parseWeeklyActivitiesResponse = (raw: string): IPlanningDay | null => {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : raw;
    try {
        const parsed = JSON.parse(
            jsonStr
                .replace(/\\/g, "")
                .replace(/\n/g, "")
                .replace(/`/g, "")
                .replace(/json/g, ""),
        ) as Record<string, unknown>;
        const days: IDays["days"][] = ["day1", "day2", "day3", "day4", "day5"];
        const result: Partial<IPlanningDay> = {};
        let hasAny = false;
        for (const day of days) {
            const val = parsed[day];
            if (Array.isArray(val) && val.length > 0) {
                const clean = val
                    .filter((x: unknown): x is string => typeof x === "string")
                    .map((s) => s.replaceAll(",", "").trim())
                    .filter(Boolean);
                if (clean.length > 0) {
                    result[day] = clean.slice(0, classCount.value);
                    hasAny = true;
                }
            }
        }
        if (
            !hasAny &&
            Array.isArray(parsed.activities) &&
            parsed.activities.length >= 5
        ) {
            const flat = parsed.activities
                .filter((x: unknown): x is string => typeof x === "string")
                .map((s) => s.replaceAll(",", "").trim())
                .filter(Boolean);
            const perDay = Math.max(1, Math.floor(flat.length / 5));
            for (let i = 0; i < 5; i++) {
                const day = `day${i + 1}` as IDays["days"];
                const chunk = flat.slice(i * perDay, i * perDay + perDay);
                if (chunk.length > 0)
                    result[day] = chunk.slice(0, classCount.value);
            }
            hasAny = Object.keys(result).length > 0;
        }
        return hasAny ? (result as IPlanningDay) : null;
    } catch {
        return null;
    }
};

const CONTEXT_DAYS: IDays["days"][] = ["day1", "day2", "day3", "day4", "day5"];

const joinPlanList = (items: string[]): string =>
    items.map((item) => item.toString()).join("\n \n");

const buildContextDayActivity = (day: IDays["days"]): string =>
    plans.value[day]
        .map(
            (item, index) =>
                `${item.toString()} - (${startClassHour.value[day][index]} Hr ~ ${endClassHour.value[day][index]} Hr) \n \n`,
        )
        .join("\n \n");

const fetchRawContextActivities = async (prompt: string): Promise<string> => {
    if (isLocalMode()) {
        const response = await axios.post(import.meta.env.VITE_API_URL, {
            model: import.meta.env.VITE_LLM_MODEL,
            prompt,
            stream: false,
            options: {
                num_predict: 4096,
                num_ctx: 8192,
                temperature: 0.7,
            },
        });
        return (response.data as { response: string }).response ?? "";
    }
    const response = await backendApi.post("/planning/create", { prompt });
    return (
        (response.data as { message: string }).message ??
        JSON.stringify(response.data)
    );
};

const sanitizeContextActivities = (
    weekly: Partial<IPlanningDay>,
): IPlanningDay => {
    const sanitized = {
        day1: [],
        day2: [],
        day3: [],
        day4: [],
        day5: [],
    } as unknown as IPlanningDay;
    for (const day of CONTEXT_DAYS) {
        const arr = weekly[day] ?? [];
        sanitized[day] = arr
            .slice(0, classCount.value)
            .map((a) => a.replaceAll(",", "").trim())
            .filter(Boolean);
        if (sanitized[day].length === 0) {
            sanitized[day] = [
                locale.value === "pt-BR"
                    ? "Atividade gerada pela IA"
                    : "AI generated activity",
            ];
        }
    }
    return sanitized;
};

// Step 1: context text + classCount (ContextPlan counter) -> day1..day5 activities.
// Local: Ollama via VITE_API_URL. Prod: backend POST /planning/create.
const fetchContextActivities = async (): Promise<IPlanningDay> => {
    const qsn = locale.value === "pt-BR" ? qsnPTBR : qsnENUS.qsn;
    const qsnString = JSON.stringify(qsn);
    const context = contextText.value.trim();
    const prompt =
        locale.value === "pt-BR"
            ? getContextWeeklyPrompt(qsnString, context, classCount.value)
            : getContextWeeklyPromptEN(qsnString, context, classCount.value);

    const raw = await fetchRawContextActivities(prompt);
    const weekly = parseWeeklyActivitiesResponse(raw);
    if (!weekly || Object.keys(weekly).length === 0) {
        throw new Error("empty weekly activities");
    }
    return sanitizeContextActivities(weekly);
};

const fetchPlanningByContext = async (
    qsn: string,
    activity: string,
): Promise<AxiosResponse> => {
    if (isLocalMode()) {
        return axios.post(import.meta.env.VITE_API_URL, {
            model: import.meta.env.VITE_LLM_MODEL,
            prompt:
                locale.value === "pt-BR"
                    ? getPrompt(qsn, activity)
                    : getPromptEN(qsn, activity),
            stream: false,
            options: {
                num_predict: 8192,
                num_ctx: 32768,
                temperature: 0.2,
            },
        });
    }
    return backendApi.post("/planning/create-by-context", {
        qsn,
        activity,
        locale: locale.value,
    });
};

const buildContextDayPayloads = (): Record<string, string[]>[] =>
    CONTEXT_DAYS.map((day) => ({
        [day]: plans.value[day].map((classAtv) => sanitizeInput(classAtv)),
    }));

// Step 2: day1..day5 activities -> per-day enriched plan.
// Local: Ollama via VITE_API_URL. Prod: backend POST /planning/create-by-context.
const fetchEnrichedDayPlans = async (
    payloads: Record<string, string[]>[],
): Promise<IClassPlanResponse[]> => {
    const qsn = locale.value === "pt-BR" ? qsnPTBR : qsnENUS.qsn;
    const qsnString = JSON.stringify(qsn);
    return Promise.all(
        payloads.map(async (item) => {
            const activity = sanitizeInput(JSON.stringify(item)).toString();
            const response = await fetchPlanningByContext(
                qsnString,
                activity,
            );
            return extractResponseData(
                response,
                isLocalMode(),
                t("design.invalidResponseFallback"),
            );
        }),
    );
};

// Step 3: enriched day plans + header info -> docxtemplater data.
const buildContextPlanDocData = (
    fullName: string,
    dayPlans: IClassPlanResponse[],
): Record<string, string> => {
    const data: Record<string, string> = {
        nomeEscola: schoolName.value,
        sala: className.value,
        diaStart: planDateStart.value.split("-")[2],
        diaEnd: planDateEnd.value.split("-")[2],
        mes: monthConverter(planDateEnd.value.split("-")[1]),
        ano: planDateEnd.value.split("-")[0],
        profName: fullName,
    };
    CONTEXT_DAYS.forEach((day, i) => {
        const n = i + 1;
        const plan = dayPlans[i];
        data[`eixo${n}`] = joinPlanList(plan.eixo);
        data[`saber${n}`] = `${joinPlanList(plan.saber)}\n`;
        data[`aprendizagem${n}`] = `${joinPlanList(plan.aprendizagem)}\n`;
        data[`atividade${n}`] = buildContextDayActivity(day);
        data[`contextualizacao${n}`] = plan.contextualizacao;
        data[`foco${n}`] = joinPlanList(plan.foco_avaliativo);
        data[`materiais${n}`] = plan.materiais;
    });
    return data;
};

// Step 4: render weekly template, download docx, persist base64.
const renderAndPersistContextPlan = async (
    data: Record<string, string>,
): Promise<void> => {
    const planejamentoQSNFetch = await fetch(
        new URL(
            `../../assets/planejamentoSemanal${templateChoose.templateStyle}.docx`,
            import.meta.url,
        ).href,
    );
    const arrayBuffer = await planejamentoQSNFetch.arrayBuffer();
    const planZip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(planZip, {
        paragraphLoop: true,
        linebreaks: true,
    });

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
        end_plan: planDateEnd.value,
        school_name: schoolName.value,
        class_name: className.value,
        user_id: uuid,
    });
};

const generatePlanByContext = async (fullName: string): Promise<void> => {
    if (contextText.value.trim().length < 10) {
        popupContext.handleChangePopupInfo(
            `${t("design.fillAllFields")}`,
            "warning",
            true,
        );
        return;
    }

    // Step 1: get day1..day5 activities from context (sized by classCount).
    const contextPlanning = await fetchContextActivities();
    handleApplyWeeklyContext(contextPlanning);

    // Step 2: enrich each day via API (prod) or Ollama (local).
    const payloads = buildContextDayPayloads();
    const dayPlans = await fetchEnrichedDayPlans(payloads);

    // Steps 3-4: build doc data, render + persist.
    const data = buildContextPlanDocData(fullName, dayPlans);
    await renderAndPersistContextPlan(data);
};

const generatePlan = async () => {
    try {
        const uuid = JSON.parse(
            sessionStorage.getItem("user") ?? "{uuid: ''}",
        ).uuid;
        const dashboardResponse = (
            await backendApi.get(`/subscription/dashboard/${uuid}`)
        ).data as IDashboard;

        const isWeeklyPlan =
            planType.value === "Semanal" || planType.value === "Contexto";
        if (isWeeklyPlan) {
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
        } else if (planType.value === "Semanal") {
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
        } else {
            if (!contextText.value.length) {
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
                    options: {
                        num_predict: 8192,
                        num_ctx: 32768,
                        temperature: 0.2,
                    },
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

            let responseData: IClassPlanResponse;

            if (response) {
                responseData = extractResponseData(
                    response,
                    import.meta.env.VITE_APP_MODE === "local",
                    t("design.invalidResponseFallback"),
                );
            } else {
                responseData = extractResponseData(
                    {} as AxiosResponse,
                    import.meta.env.VITE_APP_MODE === "local",
                    t("design.invalidResponseFallback"),
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
        } else if (planType.value === "Contexto") {
            await generatePlanByContext(fullName);
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
                                options: {
                                    num_predict: 8192,
                                    num_ctx: 32768,
                                    temperature: 0.2,
                                },
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

                    if (response) {
                        return extractResponseData(
                            response,
                            import.meta.env.VITE_APP_MODE === "local",
                            t("design.invalidResponseFallback"),
                        );
                    }
                    return extractResponseData(
                        {} as AxiosResponse,
                        import.meta.env.VITE_APP_MODE === "local",
                        t("design.invalidResponseFallback"),
                    );
                }),
            );

            const effectiveTemplateType = templateChoose.templateType;
            const planejamentoQSNFetch = await fetch(
                new URL(
                    `../../assets/planejamento${effectiveTemplateType}${templateChoose.templateStyle}.docx`,
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
                    .join("\n \n"),
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
                end_plan: planDateEnd.value,
                school_name: schoolName.value,
                class_name: className.value,
                user_id: uuid,
            });
        }

        await backendApi.patch(
            `/subscription/${planType.value === "Semanal" || planType.value === "Contexto" ? "week" : "daily"}/${dashboardResponse.subscription_id}`,
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

watch(
    () => templateChoose.choosed,
    (newVal) => {
        if (newVal) generatePlan();
    },
);

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
                        <option value="Contexto">
                            {{ locale === "pt-BR" ? "Contexto (IA)" : "Context (AI)" }}
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

        <ContextPlan
            v-if="planType === 'Contexto'"
            :context-text-length="contextText.length"
            :handle-change-context-text="handleChangeContextText"
            :class-count="classCount"
            :on-increment-class-count="handleIncrementClassCount"
            :on-decrement-class-count="handleDecrementClassCount"
            :plan-type="planType"
            :selected-day="selectedDay"
            :on-apply-activities="handleApplyContextActivities"
            :on-apply-weekly="handleApplyWeeklyContext"
            :on-request-show-additional="() => showAditionalInformation = true"
            :has-empty-strings-in-classes="hasEmptyStringsInClasses"
        />

        <DailyPlan
            v-if="planType === 'Diario'"
            :plans="plans"
            :start-class-hour="startClassHour"
            :end-class-hour="endClassHour"
            :selected-day="selectedDay"
            :selected-element="selectedElement"
            :has-empty-strings-in-diary="hasEmptyStringsInDiary"
            :on-change-plan-text="handleChangePlanText"
            :on-change-start-hour="handleChangeStartClassHour"
            :on-change-end-hour="handleChangeEndClassHour"
            :on-add-new-class="handleAddNewClassInPlanning"
            :on-remove-class="handleRemoveClassAtvFromPlan"
            :on-drag-start="onDragStart"
            :on-drag-over="handleDragOver"
            :on-drag-end="onDragEnd"
            :on-drop="handleDrop"
            :on-move-up="moveClassUp"
            :on-move-down="moveClassDown"
            :on-request-show-additional="handleDailyForward"
        />

        <WeeklyPlan
            v-if="planType === 'Semanal'"
            :plans="plans"
            :start-class-hour="startClassHour"
            :end-class-hour="endClassHour"
            :selected-day="selectedDay"
            :selected-element="selectedElement"
            :is-open-plan-mobile-menu="isOpenPlanMobileMenu"
            :has-empty-strings-in-classes="hasEmptyStringsInClasses"
            :on-change-selected-day="handleChangeSelectedDay"
            :on-change-plan-text="handleChangePlanText"
            :on-change-start-hour="handleChangeStartClassHour"
            :on-change-end-hour="handleChangeEndClassHour"
            :on-add-new-class="handleAddNewClassInPlanning"
            :on-remove-class="handleRemoveClassAtvFromPlan"
            :on-go-back="handleGoBack"
            :on-go-forward="handleGoFoward"
            :on-mobile-menu="handleMobileMenu"
            :on-drag-start="onDragStart"
            :on-drag-over="handleDragOver"
            :on-drag-end="onDragEnd"
            :on-drop="handleDrop"
            :on-move-up="moveClassUp"
            :on-move-down="moveClassDown"
            :on-request-show-additional="handleWeeklyForward"
        />
    </div>
</template>

<style
    src="../../styles/contents/designcontent.style.scss"
    scoped
    lang="scss"
/>
