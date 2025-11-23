<script setup lang="ts">
const {
    showChooseTemplate = 'false',
    isCustomDocs = 'false',
    customURLDoc = '',
    planType = 'Semanal',
} = defineProps<{
    showChooseTemplate: 'false' | 'true',
    isCustomDocs: 'false' | 'true',
    customURLDoc: string,
    planType: 'Semanal' | 'Diario'
}>();

import { inject, ref } from 'vue';
import type { ITemplateChoose, ITemplateChooseContext } from '../../interfaces/context/templateChoose.interface';
import type { IShowPreviewContext } from '../../interfaces/context/showPreview.interface';

type TPlanVersion = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const planVersion = ref<TPlanVersion>(1);
const { handleChangeTemplateChoose } = inject('templateChoose') as ITemplateChooseContext;
const showPreviewContext = inject('showPreview') as IShowPreviewContext;
const urlDoc = ref(isCustomDocs.trim().toLowerCase() === 'true' ? customURLDoc : `../../../public/planejamento${planType}${planVersion.value}.pdf`);

const stopPropagation = (event: Event): void => {
    event.stopPropagation();
};

const handleNextButton = (): void => {
    if (planVersion.value === 7) {
        planVersion.value = 1;
    } else {
        planVersion.value = planVersion.value + 1 as TPlanVersion;
    }

    urlDoc.value = `../../../public/planejamento${planType}${planVersion.value}.pdf`
};

const handlePreviousButton = (): void => {
    if (planVersion.value === 1) {
        planVersion.value = 7;
    } else {
        planVersion.value = planVersion.value - 1 as TPlanVersion;
    }

    urlDoc.value = `../../../public/planejamento${planType}${planVersion.value}.pdf`
};

const handleClose = (): void => {
    showPreviewContext.handleChangeShowPreview({
        show: false, customURLDoc: '', isCustomDocs: 'false', showChooseTemplate: 'false',
        planType: 'Semanal'
    });
};

const handleChooseTemplate = (event: Event) => {
    event.stopPropagation();

    const newTemplateChoose = { choosed: true, templateStyle: planVersion, templateType: planType } as unknown as ITemplateChoose;
    handleChangeTemplateChoose({ ...newTemplateChoose });

    return;
};

</script>

<template>
    <div class="showPreviewContainer" @click="() => handleClose()">
        <iframe @click="(event) => stopPropagation(event)" class="showPreview" :src="urlDoc"></iframe>
        <div @click="(event) => stopPropagation(event)" v-if="showChooseTemplate.trim().toLowerCase() === 'true'"
            class="rowContainerButton">
            <button type="button" @click="() => handlePreviousButton()"><i class="pi pi-arrow-left"></i></button>
            <button type="button" @click="() => handleNextButton()"><i class="pi pi-arrow-right"></i></button>
        </div>

        <button @click="(event) => handleChooseTemplate(event)"
            v-if="showChooseTemplate.trim().toLowerCase() === 'true'" type="button" class="btnChooseTemplate">
            Escolher template
        </button>
    </div>
</template>

<style lang="scss" scoped src="./previewdocs.style.scss" />
