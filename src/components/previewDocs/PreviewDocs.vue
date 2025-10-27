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

import { ref } from 'vue';
import './previewdocs.style.scss';

type TPlanType = 'Semanal' | 'Diario';
type TPlanVersion = 1 | 2 | 3 | 4 | 5 | 6;

const planType = ref<TPlanType>('Semanal');
const planVersion = ref<TPlanVersion>(1);
const urlDoc = isCustomDocs.trim().toLowerCase() === 'true' ? customURLDoc : `../../../public/planejamento${planType.value}${planVersion.value}.pdf`;

console.log(urlDoc);

const handleNextButton = () => {
    if (planVersion.value === 6) {
        planVersion.value = 1;
        return;
    }

    planVersion.value = planVersion.value + 1 as TPlanVersion;
};

const handlePreviousButton = () => {
    if (planVersion.value === 1) {
        planVersion.value = 6;
        return;
    }

    planVersion.value = planVersion.value - 1 as TPlanVersion;
};
</script>

<template>
    <div class="showPreviewContainer">
        <iframe class="showPreview" :src="urlDoc"></iframe>
        <div v-if="showChooseTemplate.trim().toLowerCase() === 'true'" class="rowContainerButton">
            <button type="button" @click="() => handlePreviousButton()"><i class="pi pi-arrow-left"></i></button>
            <button type="button" @click="() => handleNextButton()"><i class="pi pi-arrow-right"></i></button>
        </div>

        <button v-if="showChooseTemplate.trim().toLowerCase() === 'true'" type="button" class="btnChooseTemplate">
            Escolher template
        </button>
    </div>
</template>
