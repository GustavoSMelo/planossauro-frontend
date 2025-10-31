<script setup lang="ts">
const {
    showChooseTemplate = 'false',
    isCustomDocs = 'false',
    customURLDoc = ''
} = defineProps<{
    showChooseTemplate: 'false' | 'true',
    isCustomDocs: 'false' | 'true',
    customURLDoc: string
}>();

import { inject, ref } from 'vue';
import './previewdocs.style.scss';
import type { ITemplateChoose, ITemplateChooseContext } from '../../interfaces/context/templateChoose.interface';
import type { IShowPreview, IShowPreviewContext } from '../../interfaces/context/showPreview.interface';

type TPlanType = 'Semanal' | 'Diario';
type TPlanVersion = 1 | 2 | 3 | 4 | 5 | 6;

const planType = ref<TPlanType>('Semanal');
const planVersion = ref<TPlanVersion>(1);
const templateChooseContext = inject('templateChoose') as ITemplateChooseContext;
const showPreviewContext = inject('showPreview') as IShowPreviewContext;
const urlDoc = ref(isCustomDocs.trim().toLowerCase() === 'true' ? customURLDoc : `../../../public/planejamento${planType.value}${planVersion.value}.pdf`);

console.log(urlDoc);

const stopPropagation = (event: Event): void => {
    event.stopPropagation();
};

const handleNextButton = (): void => {
    if (planVersion.value === 6) {
        planVersion.value = 1;
        return;
    }

    planVersion.value = planVersion.value + 1 as TPlanVersion;
    urlDoc.value = `../../../public/planejamento${planType.value}${planVersion.value}.pdf`
};

const handlePreviousButton = (): void => {
    if (planVersion.value === 1) {
        planVersion.value = 6;
        return;
    }
    planVersion.value = planVersion.value - 1 as TPlanVersion;
    urlDoc.value = `../../../public/planejamento${planType.value}${planVersion.value}.pdf`
};

const handleClose = (): void => {
    showPreviewContext.handleChangeShowPreview({ show: false, customURLDoc: '', isCustomDocs: 'false', showChooseTemplate: 'false' });
};

const handleChooseTemplate = (event: Event) => {
    event.stopPropagation();

    console.log(templateChooseContext);
    const newTemplateChoose = { choosed: true, templateStyle: planVersion, templateType: planType } as unknown as ITemplateChoose;
    templateChooseContext.handleChangeTemplateChoose({ ...newTemplateChoose });

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
