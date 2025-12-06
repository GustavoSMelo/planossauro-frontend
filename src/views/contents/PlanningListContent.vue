<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import backendApi from '../../api/api';
import type { IPlanning } from '../../interfaces/api/planning.interface';
import type { ILoadingContext } from '../../interfaces/context/loading.interface';
import type { IPageContent } from '../../interfaces/pageContents.interface';
import EditPlanning from './EditPlanningContent.vue';

const { handleChangeCurrentContent } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent['contents']) => void
}>();

const currentPage = ref(1);
const plannings = ref<Array<IPlanning>>([]);
const startDatePlanning = ref('');
const className = ref('');
const schoolName = ref('');
const archived = ref(false);
const planningType = ref<'Semanal' | 'Diario' | ''>('');

const { handleChangeIsLoading } = inject('isLoading') as ILoadingContext;

const getDataFromAPI = async () => {
    try {
        handleChangeIsLoading(true);
        const uuid = sessionStorage.getItem('uuid');
        const { data: planningsDataList }: { data: Array<IPlanning> } = (await backendApi.get(`/planning/paginate/${uuid}?page=${currentPage.value}`)).data;

        console.log(planningsDataList);

        plannings.value = [...plannings.value, ...planningsDataList];
        handleChangeIsLoading(false);
    } catch (err) {
        handleChangeIsLoading(false);
    }
};

const loadDataFromPagination = () => {
    currentPage.value++;
    getDataFromAPI();
};

const downloadDocument = (index: number) => {
    const element = plannings.value[index];

    const documentContent = atob(element.document_b64);
    const bytes = new Uint8Array(documentContent.length);

    for (let i = 0; i < documentContent.length; i++) {
        bytes[i] = documentContent.charCodeAt(i);
    }

    const file = new File([bytes], `planjemanto-${element.school_name}-${element.class_name}-${element.start_plan}.docx`);
    const link = window.document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.click();
    link.remove();
};

const handleChangeClassName = (event: Event) => {
    const target = event.target as HTMLInputElement;
    className.value = target.value;
};

const handleChangePlanningType = (event: Event) => {
    const target = event.target as HTMLInputElement;
    planningType.value = target.value as 'Semanal' | 'Diario';
};

const handleChangeDatePlanning = (event: Event) => {
    const target = event.target as HTMLInputElement;
    startDatePlanning.value = target.value;
};

const handleChangeSchoolName = (event: Event) => {
    const target = event.target as HTMLInputElement;
    schoolName.value = target.value;
};

const handleChangeArchivedFile = (event: Event) => {
    const target = event.target as HTMLInputElement;
    archived.value = Boolean(target.value);
}

const searchByFilterParameters = async () => {
    try {
        handleChangeIsLoading(true);

        const uuid = sessionStorage.getItem('uuid');
        const planningsResponse = (await backendApi.post(`/planning/search/${uuid}`, {
            'school_name': schoolName.value,
            'class_name': className.value,
            'archived': archived.value,
            'start_plan': startDatePlanning.value,
            'planning_type': planningType.value,
        })).data as Array<IPlanning>;

        console.log(planningsResponse);

        plannings.value = [...planningsResponse];
        handleChangeIsLoading(false);
    } catch (err) {
        console.error(err);
        handleChangeIsLoading(false);
    }
};

const handleEditPlanningInformations = (uuid: string) => {
    sessionStorage.setItem('planning_selectedUUID', uuid);
    handleChangeCurrentContent('edit_planning');
};

const handleDeletePlanning = (uuid: string) => {
    sessionStorage.setItem('planning_selectedUUID', uuid);
    handleChangeCurrentContent('remove_planning');
};

onMounted(() => {
    getDataFromAPI();
})
</script>

<template>
    <form class="searchFormContainer">
        <span>
            <label>Data de inicio do planj.: </label>
            <input :value="startDatePlanning" type="date" @change="event => handleChangeDatePlanning(event)" />
        </span>
        <span>
            <label>Classe/serie: </label>
            <input :value="className" @change="handleChangeClassName" type="text" placeholder="Insira a classe/serie" />
        </span>
        <span>
            <label>Escola: </label>
            <input :value="schoolName" @change="handleChangeSchoolName" type="text" placeholder="Insira a escola" />
        </span>
        <span>
            <label>Arquivado: </label>
            <select @change="handleChangeArchivedFile" :value="archived">
                <option :value="false">Nao</option>
                <option :value="true">Sim</option>
            </select>
        </span>
        <span>
            <label>Tipo do planejamento: </label>
            <select @change="handleChangePlanningType" :value="planningType">
                <option value="">Ambos</option>
                <option value="Semanal">Semanal</option>
                <option value="Diario">Diario</option>
            </select>
        </span>

        <button type="button" @click="searchByFilterParameters">Buscar</button>
    </form>
    <section class="listingContainer">
        <table v-if="plannings.length">
            <thead>
                <tr>
                    <th>Download</th>
                    <th>Serie/classe</th>
                    <th>Escola</th>
                    <th>Tipo do plan.</th>
                    <th>Data</th>
                    <th>Editar</th>
                    <th>Remover</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="planning, index in plannings">
                    <td data-cell="Download: " class="btnCellDownload" @click="() => downloadDocument(index)"><i
                            class="pi pi-download"></i></td>
                    <td data-cell="Serie: ">{{ planning.class_name }}</td>
                    <td data-cell="Escola: ">{{ planning.school_name }}</td>
                    <td data-cell="Tipo planejamento: ">{{ planning.start_plan === planning.end_plan ? 'Diario' :
                        'Semanal' }}</td>
                    <td data-cell="Data planejamento: ">{{ planning.start_plan }} {{ planning.start_plan !==
                        planning.end_plan ? `~ ${planning.end_plan}` : '' }}</td>
                    <td data-cell="Editar: " class="btnCellEdit" @click="handleEditPlanningInformations(planning.uuid)">
                        <i class="pi pi-pencil"></i></td>
                    <td data-cell="Remover: " class="btnCellRemove" @click="handleDeletePlanning(planning.uuid)"><i
                            class="pi pi-trash"></i></td>
                </tr>
            </tbody>
            <tfoot>
                <tr @click="loadDataFromPagination">
                    <td colspan="6">Carregar mais planejamentos</td>
                </tr>
            </tfoot>
        </table>
        <div class="notFoundContainer" v-else>
            <img src="../../assets/sad_sleep_blue.png" alt="Dinossauro triste" />
            <h1>Nenhum planejamento foi encontrado</h1>
            <button type="button" class="btnGotoPlan" @click="handleChangeCurrentContent('planning')"><i
                    class="pi pi-plus-circle"></i>Criar planejamento</button>
            <button type="button" @click="getDataFromAPI"><i class="pi pi-refresh"></i>Recarregar</button>
        </div>
    </section>
</template>

<style lang="scss" scoped src="../../styles/contents/planninglistcontent.style.scss" />
