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

const { t } = useI18n();

const isDark = useDark({
    attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
});

const isForwardDisabled = computed<boolean>(() =>
    props.hasEmptyStringsInClasses().find((element) => element === true) ?? false,
);

const contextDescription = computed<string>(() =>
    props.planType === "Contexto"
        ? t("design.contextDescriptionWeekly")
        : t("design.contextDescriptionDefault"),
);

const contextPlaceholder = computed<string>(() =>
    props.planType === "Contexto"
        ? t("design.contextPlaceholderWeekly")
        : t("design.contextPlaceholderDefault"),
);

const classCountLabel = computed<string>(() =>
    props.planType === "Contexto"
        ? t("design.classesPerDay")
        : t("design.howManyClasses"),
);

const forwardTitle = computed<string>(() =>
    isForwardDisabled.value
        ? t("design.planningIncomplete")
        : t("design.forward"),
);
</script>

<template>
    <section class="contextGenerator" :data-theme="isDark ? 'dark' : 'light'">
        <div class="contextHeader">
            <h2>
                <i class="pi pi-sparkles"></i>
                {{ t("design.contextTitle") }}
            </h2>
            <p class="contextDescription">
                {{ contextDescription }}
            </p>
        </div>

        <div class="contextForm">
            <div class="fieldGroup">
                <label for="classContextInput">
                    {{ t("design.contextLabel") }}
                    <span class="hint">
                        ({{ t("design.contextHint") }})
                    </span>
                </label>
                <textarea
                    id="classContextInput"
                    @input="event => handleChangeContextText(event)"
                    :placeholder="contextPlaceholder"
                    rows="3"
                    maxlength="600"
                ></textarea>
                <span class="charCount">{{ contextTextLength }}/600</span>
            </div>

            <div class="fieldGroup countGroup">
                <label for="classCountInput">
                    {{ classCountLabel }}
                </label>
                <div class="countControl">
                    <button
                        type="button"
                        class="countBtn"
                        @click="onDecrementClassCount"
                        :disabled="classCount <= 1"
                        :aria-label="t('design.decrease')"
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
                        :aria-label="t('design.increase')"
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
            :title="forwardTitle"
            @click="() => onRequestShowAdditional()"
        >
            {{ t("design.forward") }}
            <i class="pi pi-arrow-right"></i>
        </button>
    </section>
</template>

<style src="./contextplan.style.scss" scoped lang="scss" />
