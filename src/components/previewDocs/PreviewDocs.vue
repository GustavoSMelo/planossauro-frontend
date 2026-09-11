<script setup lang="ts">
const {
    showChooseTemplate = "false",
    isCustomDocs = "false",
    customURLDoc = "",
    planType = "Semanal",
} = defineProps<{
    showChooseTemplate: "false" | "true";
    isCustomDocs: "false" | "true";
    customURLDoc: string;
    planType: "Semanal" | "Diario" | "Contexto";
}>();

import { inject, nextTick, ref } from "vue";
import type {
    ITemplateChoose,
    ITemplateChooseContext,
} from "../../interfaces/context/templateChoose.interface";
import type { IShowPreviewContext } from "../../interfaces/context/showPreview.interface";

type TPlanVersion = 1 | 2 | 3 | 4 | 5 | 6;

const planVersion = ref<TPlanVersion>(1);
const { handleChangeTemplateChoose } = inject(
    "templateChoose",
) as ITemplateChooseContext;
const showPreviewContext = inject("showPreview") as IShowPreviewContext;
const effectivePlanType = planType === "Contexto" ? "Semanal" : planType;
const urlDoc = ref(
    isCustomDocs.trim().toLowerCase() === "true"
        ? customURLDoc
        : new URL(
              `../../assets/planejamento${effectivePlanType}${planVersion.value}.pdf`,
              import.meta.url,
          ).href,
);

const stopPropagation = (event: Event): void => {
    event.stopPropagation();
};

const handleNextButton = (): void => {
    if (planVersion.value === 6) {
        planVersion.value = 1;
    } else {
        planVersion.value = (planVersion.value + 1) as TPlanVersion;
    }

    urlDoc.value = new URL(
        `../../assets/planejamento${effectivePlanType}${planVersion.value}.pdf`,
        import.meta.url,
    ).href;
};

const handlePreviousButton = (): void => {
    if (planVersion.value === 1) {
        planVersion.value = 6;
    } else {
        planVersion.value = (planVersion.value - 1) as TPlanVersion;
    }

    urlDoc.value = new URL(
        `../../assets/planejamento${effectivePlanType}${planVersion.value}.pdf`,
        import.meta.url,
    ).href;
};

const handleClose = (): void => {
    showPreviewContext.handleChangeShowPreview({
        show: false,
        customURLDoc: "",
        isCustomDocs: "false",
        showChooseTemplate: "false",
        planType: "Semanal",
    });
};

const handleChooseTemplate = (event: Event) => {
    event.stopPropagation();

    const newTemplateChoose = {
        templateStyle: planVersion,
        templateType: effectivePlanType,
    } as unknown as ITemplateChoose;

    handleChangeTemplateChoose({ ...newTemplateChoose, choosed: false });
    nextTick(() =>
        handleChangeTemplateChoose({ ...newTemplateChoose, choosed: true }),
    );

    return;
};
</script>

<template>
    <div class="showPreviewContainer" @click="() => handleClose()">
        <iframe
            @click="(event) => stopPropagation(event)"
            class="showPreview"
            :src="urlDoc"
        ></iframe>
        <div
            @click="(event) => stopPropagation(event)"
            v-if="showChooseTemplate.trim().toLowerCase() === 'true'"
            class="rowContainerButton"
        >
            <button type="button" @click="() => handlePreviousButton()">
                <i class="pi pi-arrow-left"></i>
            </button>
            <button type="button" @click="() => handleNextButton()">
                <i class="pi pi-arrow-right"></i>
            </button>
        </div>

        <button
            @click="(event) => handleChooseTemplate(event)"
            v-if="showChooseTemplate.trim().toLowerCase() === 'true'"
            type="button"
            class="btnChooseTemplate"
        >
            {{ $t("previewDocs.chooseTemplate") }}
        </button>
    </div>
</template>

<style lang="scss" scoped src="./previewdocs.style.scss" />
