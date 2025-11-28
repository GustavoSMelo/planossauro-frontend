<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import type { IPlanning } from '../../interfaces/api/planning.interface';
import type { ILoadingContext } from '../../interfaces/context/loading.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
import type { IPageContent } from '../../interfaces/pageContents.interface';
import backendApi from '../../api/api';

const { handleChangeCurrentContent } = defineProps<{
    handleChangeCurrentContent: (content: IPageContent['contents']) => void
}>();
const planning = ref<IPlanning>();
const { handleChangeIsLoading } = inject('isLoading') as ILoadingContext;
const { handleChangePopupInfo } = inject('popup') as IPopupContext;
const uuid = sessionStorage.getItem('planning_selectedUUID');

const goBackToPlanningsList = () => {
    handleChangeCurrentContent('planning_list');
};

const handleDeletePlanning = async () => {
    try {
        handleChangeIsLoading(true);

        await backendApi.delete(`/planning/${uuid}`);
        handleChangePopupInfo('Planejamento excluido com sucesso', 'success', true);
        handleChangeIsLoading(false);
        handleChangeCurrentContent('planning_list');
    } catch (err) {
        handleChangePopupInfo('Erro ao deletar planejamento', 'error', true);
        handleChangeIsLoading(false);
    }
};

const getDataFromAPI = async () => {
    try {
        handleChangeIsLoading(true);
        const planningResponse = (await backendApi.get(`/planning/show/${uuid}`)).data as IPlanning;

        if (!planningResponse || !planningResponse === null) {
            handleChangePopupInfo('Nenhum planejamento foi selecionado', 'error', true);
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
        <h1>Continuar com a exclusao ?</h1>
        <p>{{ planning?.start_plan === planning?.end_plan ? 'Diario' : 'Semanal' }} | {{ planning?.start_plan }} ~ {{
            planning?.end_plan }}</p>
        <p>Turma: {{ planning?.class_name }} | Escola: {{ planning?.school_name }}</p>
        <small><i class="pi pi-exclamation-circle"></i>Os dados excluidos nao poderao ser recuperados!</small>

        <span class="btnContainer">
            <button type="button" @click="goBackToPlanningsList">Cancelar</button>
            <button type="button" @click="handleDeletePlanning">Deletar</button>
        </span>
    </div>
</template>

<style lang="scss" scoped src="../../styles/contents/removeplanningcontent.style.scss" />
