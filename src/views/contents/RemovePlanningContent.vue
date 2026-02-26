<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import type { IPlanning } from '../../interfaces/api/planning.interface';
import type { ILoadingContext } from '../../interfaces/context/loading.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
import type { IPageContent } from '../../interfaces/pageContents.interface';
import backendApi from '../../api/api';
import { useI18n } from 'vue-i18n';

const { handleChangeCurrentContent } = defineProps<{
    handleChangeCurrentContent: (content: IPageContent['contents']) => void
}>();
const planning = ref<IPlanning>();
const { handleChangeIsLoading } = inject('isLoading') as ILoadingContext;
const { handleChangePopupInfo } = inject('popup') as IPopupContext;
const { t } = useI18n();
const uuid = sessionStorage.getItem('planning_selectedUUID');

const goBackToPlanningsList = () => {
    handleChangeCurrentContent('planning_list');
};

const handleDeletePlanning = async () => {
    try {
        handleChangeIsLoading(true);

        await backendApi.delete(`/planning/${uuid}`);
        handleChangePopupInfo(t('removePlanning.planningRemovedMessage'), 'success', true);
        handleChangeIsLoading(false);
        handleChangeCurrentContent('planning_list');
    } catch (err) {
        handleChangePopupInfo(t('removePlanning.planningRemovedMessageError'), 'error', true);
        handleChangeIsLoading(false);
    }
};

const getDataFromAPI = async () => {
    try {
        handleChangeIsLoading(true);
        const planningResponse = (await backendApi.get(`/planning/show/${uuid}`)).data as IPlanning;

        if (!planningResponse || !planningResponse === null) {
            handleChangePopupInfo(t('removePlanning.planningNotFounded'), 'error', true);
            handleChangeCurrentContent('home');
        }

        planning.value = planningResponse;
        handleChangeIsLoading(false);
    } catch (err) {
        handleChangeIsLoading(false);
        console.error(err);
    }
}

onMounted(() => {
    getDataFromAPI();
});
</script>

<template>
    <div class="deletePlanningContainer">
        <h1>{{ t('removePlanning.planningNotFounded') }}</h1>
        <p>{{ planning?.start_plan === planning?.end_plan ? t('removePlanning.daily') : t('removePlanning.weekly') }} |
            {{ planning?.start_plan }} ~ {{
                planning?.end_plan }}</p>
        <p>{{ t('removePlanning.class') }}: {{ planning?.class_name }} | {{ t('removePlanning.school') }}: {{
            planning?.school_name }}</p>
        <small><i class="pi pi-exclamation-circle"></i>{{ t('removePlanning.description') }}</small>

        <span class="btnContainer">
            <button type="button" @click="goBackToPlanningsList">{{ t('removePlanning.cancel') }}</button>
            <button type="button" @click="handleDeletePlanning">{{ t('removePlanning.delete') }}</button>
        </span>
    </div>
</template>

<style lang="scss" scoped src="../../styles/contents/removeplanningcontent.style.scss" />
