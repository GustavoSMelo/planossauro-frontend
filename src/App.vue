<script setup lang="ts">
import { RouterView } from 'vue-router';
import { provide, reactive, ref, watch } from 'vue';
import Loading from './components/loading/Loading.vue';
import type { IPopup } from './interfaces/popup.interface';
import type { IShowPreview } from './interfaces/context/showPreview.interface';
import Popup from './components/popup/Popup.vue';
import PreviewDocs from './components/previewDocs/PreviewDocs.vue';
import type { ITemplateChoose } from './interfaces/context/templateChoose.interface';

let timeoutId: NodeJS.Timeout;

// refs
const isLoading = ref(false);
const popup = reactive<IPopup>({
    message: '',
    status: 'error',
    show: false
});
const showPreview = reactive<IShowPreview>({
    show: false,
    customURLDoc: '',
    isCustomDocs: 'false',
    showChooseTemplate: 'true',
    planType: 'Semanal',
});
const templateChoose = reactive<ITemplateChoose>({
    choosed: false,
    templateStyle: 1,
    templateType: 'Semanal'
});

const hamburgueMenuToggle = ref(false);

watch(popup, () => {
    timeoutId = setTimeout(() => {
        popup.show = false
    }, 4000);
});

// changing states
const handleChangeIsLoading = (newValue: boolean) => {
    isLoading.value = newValue;
};

const handleChangePopupInfo = (message: string, status: IPopup['status'], show: boolean): void => {
    clearTimeout(timeoutId);
    popup.message = message;
    popup.status = status;
    popup.show = show;
};

const handleChangePopupShow = (): void => {
    popup.show = !popup.show;
    clearTimeout(timeoutId);
};

const handleChangeShowPreview = (newValue: IShowPreview): void => {
    showPreview.customURLDoc = newValue.customURLDoc;
    showPreview.isCustomDocs = newValue.isCustomDocs;
    showPreview.show = newValue.show;
    showPreview.showChooseTemplate = newValue.showChooseTemplate;
    showPreview.planType = newValue.planType;
};

const handleChangeTemplateChoose = (newTemplateChoose: ITemplateChoose): void => {
    templateChoose.choosed = newTemplateChoose.choosed;
    templateChoose.templateStyle = newTemplateChoose.templateStyle;
    templateChoose.templateType = newTemplateChoose.templateType;
};

const handleHamburgueMenuToggle = (toggle: boolean) => {
    hamburgueMenuToggle.value = toggle;
};

// defining context
provide('isLoading', { isLoading, handleChangeIsLoading });
provide('popup', { popup, handleChangePopupInfo, handleChangePopupShow });
provide('showPreview', { showPreview, handleChangeShowPreview });
provide('templateChoose', { templateChoose, handleChangeTemplateChoose });
provide('hamburgueMenuToggle', { hamburgueMenuToggle, handleHamburgueMenuToggle });
</script>

<template>
    <RouterView />
    <PreviewDocs v-if="showPreview.show" :customURLDoc="showPreview.customURLDoc"
        :isCustomDocs="showPreview.isCustomDocs" :showChooseTemplate="showPreview.showChooseTemplate"
        :planType="showPreview.planType" />
    <Loading v-if="isLoading" />
    <Popup v-if="popup.show && popup.message.length > 0" />
</template>
