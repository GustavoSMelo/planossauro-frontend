<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { IPlanningDay, IDays } from "../../interfaces/planning.interface";

const { t } = useI18n();

defineProps<{
    plans: IPlanningDay;
    startClassHour: Record<IDays["days"], string[]>;
    endClassHour: Record<IDays["days"], string[]>;
    selectedDay: IDays["days"];
    selectedElement: number | null;
    hasEmptyStringsInDiary: () => boolean;
    onChangePlanText: (day: IDays["days"], index: number, value: string) => void;
    onChangeStartHour: (day: IDays["days"], index: number, hour: string) => void;
    onChangeEndHour: (day: IDays["days"], index: number, hour: string) => void;
    onAddNewClass: (day: IDays["days"]) => void;
    onRemoveClass: (day: IDays["days"], index: number) => void;
    onDragStart: (day: IDays["days"], index: number) => void;
    onDragOver: (event: DragEvent) => void;
    onDragEnd: () => void;
    onDrop: (day: IDays["days"], index: number) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
    onRequestShowAdditional: () => void;
}>();
</script>

<template>
    <form class="dailyPlan">
        <div class="dailyPlanContentContainer">
            <section v-for="(plano, index) in plans.day1" :key="index">
                <label>📚 {{ t("design.classActivity") }} {{ index + 1 }}</label>
                <span
                    class="row"
                    :class="{
                        dragging: selectedElement === index ? 'dragging' : '',
                    }"
                    draggable="true"
                    @dragstart="() => onDragStart(selectedDay, index)"
                    @dragover="(event) => onDragOver(event)"
                    @drop="() => onDrop(selectedDay, index)"
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
                                    onChangePlanText(
                                        'day1',
                                        index,
                                        (event.target as HTMLInputElement).value,
                                    )
                            "
                        />
                        <div class="timeInputContainer">
                            <span class="buttonRepositionContainer">
                                <button
                                    class="repositionButton"
                                    type="button"
                                    @click="onMoveUp(index)"
                                >
                                    <i class="pi pi-arrow-up"></i>
                                </button>

                                <button
                                    class="repositionButton"
                                    type="button"
                                    @click="onMoveDown(index)"
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
                                        onChangeStartHour(
                                            'day1',
                                            index,
                                            (event.target! as HTMLInputElement)
                                                .value,
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
                                        onChangeEndHour(
                                            'day1',
                                            index,
                                            (event.target! as HTMLInputElement)
                                                .value,
                                        )
                                "
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        :class="index > 0 ? 'btnTrash' : 'btnTrashDisabled'"
                        @click="
                            index > 0 ? onRemoveClass('day1', index) : null
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
                @click="onAddNewClass('day1')"
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
                @click="() => onRequestShowAdditional()"
            >
                {{ t("design.forward") }}
            </button>
        </div>
    </form>
</template>

<style src="../../styles/contents/designcontent.style.scss" scoped lang="scss" />
