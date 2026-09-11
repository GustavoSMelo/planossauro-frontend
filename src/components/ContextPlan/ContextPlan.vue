<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useDark } from "@vueuse/core";
import type { IPlanningDay, IDays } from "../../interfaces/planning.interface";

const props = defineProps<{
    planType: "Diario" | "Semanal" | "Contexto";
    selectedDay: IDays["days"];
    contextTextLength: number;
    handleChangeContextText: (event: Event) => void;
    classCount: number;
    onIncrementClassCount: () => void;
    onDecrementClassCount: () => void;
    onApplyActivities: (day: IDays["days"], activities: string[]) => void;
    onApplyWeekly?: (planning: IPlanningDay) => void;
    onRequestShowAdditional: () => void;
    hasEmptyStringsInClasses: () => Array<boolean>;
}>();

const { t, locale } = useI18n();

const isDark = useDark({
    attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
});

const isForwardDisabled = computed<boolean>(() =>
    props.hasEmptyStringsInClasses().find((element) => element === true) ?? false,
);
</script>

<template>
    <section class="contextGenerator" :data-theme="isDark ? 'dark' : 'light'">
        <div class="contextHeader">
            <h2>
                <i class="pi pi-sparkles"></i>
                {{
                    locale === "pt-BR"
                        ? "Gerar aulas baseado no contexto"
                        : "Generate classes based on context"
                }}
            </h2>
            <p class="contextDescription">
                {{
                    planType === "Contexto"
                        ? locale === "pt-BR"
                            ? "Descreva o tema e a IA preencherá os 5 dias (Segunda a Sexta) automaticamente."
                            : "Describe the theme and AI will fill all 5 days (Monday to Friday) automatically."
                        : locale === "pt-BR"
                          ? "Descreva o tema da turma e deixe a IA criar as atividades para você."
                          : "Describe the class theme and let AI create the activities for you."
                }}
            </p>
        </div>

        <div class="contextForm">
            <div class="fieldGroup">
                <label for="classContextInput">
                    {{
                        locale === "pt-BR" ? "Contexto da aula" : "Class context"
                    }}
                    <span class="hint">
                        ({{
                            locale === "pt-BR"
                                ? "mín. 10 caracteres"
                                : "min. 10 chars"
                        }})
                    </span>
                </label>
                <textarea
                    id="classContextInput"
                    @input="event => handleChangeContextText(event)"
                    :placeholder="
                        locale === 'pt-BR'
                            ? planType === 'Contexto'
                                ? 'Ex: Turma 3 anos, projeto horta, 3 aulas por dia com foco em natureza e contagem...'
                                : 'Ex: Turma de 4 anos, tema animais da fazenda, foco em coordenação motora e contagem...'
                            : planType === 'Contexto'
                              ? 'Ex: 3-year class, garden project, 3 lessons per day focusing on nature and counting...'
                              : 'Ex: 4-year-old class, farm animals theme, focus on motor skills and counting...'
                    "
                    rows="3"
                    maxlength="600"
                ></textarea>
                <span class="charCount">{{ contextTextLength }}/600</span>
            </div>

            <div class="fieldGroup countGroup">
                <label for="classCountInput">
                    {{
                        planType === "Contexto"
                            ? locale === "pt-BR"
                                ? "Aulas por dia"
                                : "Classes per day"
                            : locale === "pt-BR"
                              ? "Quantas aulas gerar?"
                              : "How many classes?"
                    }}
                </label>
                <div class="countControl">
                    <button
                        type="button"
                        class="countBtn"
                        @click="onDecrementClassCount"
                        :disabled="classCount <= 1"
                        aria-label="decrease"
                    >
                        <i class="pi pi-minus"></i>
                    </button>
                    <input
                        id="classCountInput"
                        type="number"
                        :value="classCount"
                        min="1"
                        max="10"
                        readonly
                    />
                    <button
                        type="button"
                        class="countBtn"
                        @click="onIncrementClassCount"
                        :disabled="classCount >= 10"
                        aria-label="increase"
                    >
                        <i class="pi pi-plus"></i>
                    </button>
                </div>
            </div>
        </div>

        <button
            id="btnGeneratePlan"
            type="button"
            :class="contextTextLength < 10 ? 'btnDisabled' : 'btnGenerateContext'"
            :disabled="contextTextLength < 10"
            :title="isForwardDisabled ? 'Planejamento nao finalizado' : 'Avancar'"
            @click="() => onRequestShowAdditional()"
        >
            {{ t("design.forward") }}
            <i class="pi pi-arrow-right"></i>
        </button>
    </section>
</template>

<style src="./contextplan.style.scss" scoped lang="scss" />
