<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useDark } from "@vueuse/core";
import dayConverter from "../../helpers/dayConverter";
import type { IPlanningDay, IDays } from "../../interfaces/planning.interface";

const { t } = useI18n();

const isDark = useDark({
    attribute: "data-theme",
    valueLight: "light",
    valueDark: "dark",
});

defineProps<{
    plans: IPlanningDay;
    startClassHour: Record<IDays["days"], string[]>;
    endClassHour: Record<IDays["days"], string[]>;
    selectedDay: IDays["days"];
    selectedElement: number | null;
    isOpenPlanMobileMenu: boolean;
    hasEmptyStringsInClasses: () => Array<boolean>;
    onChangeSelectedDay: (day: IDays["days"]) => void;
    onChangePlanText: (day: IDays["days"], index: number, value: string) => void;
    onChangeStartHour: (day: IDays["days"], index: number, hour: string) => void;
    onChangeEndHour: (day: IDays["days"], index: number, hour: string) => void;
    onAddNewClass: (day: IDays["days"]) => void;
    onRemoveClass: (day: IDays["days"], index: number) => void;
    onGoBack: () => void;
    onGoForward: () => void;
    onMobileMenu: () => void;
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
    <div>
        <div class="weeklyPlan" id="weeklyPlan">
            <ul class="weekDays" id="weekDays">
                <li
                    @click="() => onChangeSelectedDay('day1')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day1' ? 'selected' : '',
                    ]"
                >
                    <i
                        id="iconHelp"
                        :class="[
                            'pi',
                            hasEmptyStringsInClasses()[0]
                                ? 'pi-clock iconUncheck'
                                : 'pi-verified iconCheck',
                        ]"
                    ></i>
                    {{ t("design.monday") }}
                </li>
                <li
                    @click="() => onChangeSelectedDay('day2')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day2' ? 'selected' : '',
                    ]"
                >
                    <i
                        :class="[
                            'pi',
                            hasEmptyStringsInClasses()[1]
                                ? 'pi-clock iconUncheck'
                                : 'pi-verified iconCheck',
                        ]"
                    ></i>
                    {{ t("design.tuesday") }}
                </li>
                <li
                    @click="() => onChangeSelectedDay('day3')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day3' ? 'selected' : '',
                    ]"
                >
                    <i
                        :class="[
                            'pi',
                            hasEmptyStringsInClasses()[2]
                                ? 'pi-clock iconUncheck'
                                : 'pi-verified iconCheck',
                        ]"
                    ></i>
                    {{ t("design.wednesday") }}
                </li>
                <li
                    @click="() => onChangeSelectedDay('day4')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day4' ? 'selected' : '',
                    ]"
                >
                    <i
                        :class="[
                            'pi',
                            hasEmptyStringsInClasses()[3]
                                ? 'pi-clock iconUncheck'
                                : 'pi-verified iconCheck',
                        ]"
                    ></i>
                    {{ t("design.thursday") }}
                </li>
                <li
                    @click="() => onChangeSelectedDay('day5')"
                    :class="[
                        'btnWeekDays',
                        selectedDay === 'day5' ? 'selected' : '',
                    ]"
                >
                    <i
                        :class="[
                            'pi',
                            hasEmptyStringsInClasses()[4]
                                ? 'pi-clock iconUncheck'
                                : 'pi-verified iconCheck',
                        ]"
                    ></i>
                    {{ t("design.friday") }}
                </li>
            </ul>

            <div class="weekDaysMobile">
                <div class="selectedDay" id="selectedDay">
                    <h2
                        class="selectedWeekDayMobile"
                        @click="() => onMobileMenu()"
                    >
                        <i
                            :class="[
                                'pi',
                                'iconClock',
                                'iconHelp',
                                hasEmptyStringsInClasses()[
                                    Number.parseInt(
                                        selectedDay.split('day')[1],
                                    ) - 1
                                ]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i
                        >{{ dayConverter(selectedDay) }}
                    </h2>
                    <button
                        class="btnChangeWeekMobile"
                        @click="() => onMobileMenu()"
                    >
                        <i
                            :class="[
                                'pi',
                                isOpenPlanMobileMenu
                                    ? 'pi-chevron-up'
                                    : 'pi-chevron-down',
                            ]"
                        ></i>
                    </button>
                </div>
                <ul v-if="isOpenPlanMobileMenu === true" class="mobileDayLists">
                    <li
                        :class="[
                            'mobileDayItemList',
                            selectedDay === 'day1' ? 'mobileDaySelected' : '',
                        ]"
                        @click="() => onChangeSelectedDay('day1')"
                    >
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[0]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i>
                        {{ t("design.monday") }}
                    </li>
                    <li
                        :class="[
                            'mobileDayItemList',
                            selectedDay === 'day2' ? 'mobileDaySelected' : '',
                        ]"
                        @click="() => onChangeSelectedDay('day2')"
                    >
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[1]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i>
                        {{ t("design.tuesday") }}
                    </li>
                    <li
                        :class="[
                            'mobileDayItemList',
                            selectedDay === 'day3' ? 'mobileDaySelected' : '',
                        ]"
                        @click="() => onChangeSelectedDay('day3')"
                    >
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[2]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i>
                        {{ t("design.wednesday") }}
                    </li>
                    <li
                        :class="[
                            'mobileDayItemList',
                            selectedDay === 'day4' ? 'mobileDaySelected' : '',
                        ]"
                        @click="() => onChangeSelectedDay('day4')"
                    >
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[3]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i>
                        {{ t("design.thursday") }}
                    </li>
                    <li
                        :class="[
                            'mobileDayItemList',
                            selectedDay === 'day5' ? 'mobileDaySelected' : '',
                        ]"
                        @click="() => onChangeSelectedDay('day5')"
                    >
                        <i
                            :class="[
                                'pi',
                                hasEmptyStringsInClasses()[4]
                                    ? 'pi-clock iconUncheck'
                                    : 'pi-verified iconCheck',
                            ]"
                        ></i>
                        {{ t("design.friday") }}
                    </li>
                </ul>
                <span v-else></span>
            </div>

            <div
                class="classContentContainer"
                :data-theme="isDark ? 'dark' : 'light'"
            >
                <div class="classContent">
                    <div
                        v-for="(value, index) in plans[selectedDay]"
                        :key="index"
                        class="classWrapper"
                        :class="{
                            dragging:
                                selectedElement === index ? 'dragging' : '',
                        }"
                        draggable="true"
                        @dragstart="() => onDragStart(selectedDay, index)"
                        @dragover="(event) => onDragOver(event)"
                        @drop="() => onDrop(selectedDay, index)"
                        @dragend="() => onDragEnd()"
                    >
                        <span class="classDescription">
                            <h2 :data-theme="isDark ? 'dark' : 'light'">
                                📚 {{ t("design.classActivity") }}
                                {{ index + 1 }}:
                            </h2>
                            <div class="hourClass">
                                <i class="pi pi-arrows-v iconReposition"></i>
                                <input
                                    class="inputDescriptionText"
                                    type="text"
                                    :placeholder="`${t('design.inputPlaceholder')}`"
                                    :value="value"
                                    @input="
                                        (event) =>
                                            onChangePlanText(
                                                selectedDay,
                                                index,
                                                (
                                                    event.target! as HTMLInputElement
                                                ).value,
                                            )
                                    "
                                />
                                <span>
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
                                        :value="
                                            startClassHour[selectedDay][index]
                                        "
                                        @input="
                                            (event) =>
                                                onChangeStartHour(
                                                    selectedDay,
                                                    index,
                                                    (
                                                        event.target! as HTMLInputElement
                                                    ).value,
                                                )
                                        "
                                    />
                                    <input
                                        class="timeInput timeInputEnd"
                                        type="time"
                                        lang="pt-BR"
                                        step="900"
                                        title="Fim da aula"
                                        :value="
                                            endClassHour[selectedDay][index]
                                        "
                                        @input="
                                            (event) =>
                                                onChangeEndHour(
                                                    selectedDay,
                                                    index,
                                                    (
                                                        event.target! as HTMLInputElement
                                                    ).value,
                                                )
                                        "
                                    />
                                </span>
                            </div>
                        </span>
                        <button
                            @click="
                                () => onRemoveClass(selectedDay, index)
                            "
                            :class="
                                index === 0
                                    ? 'btnRemoveClassCancel'
                                    : 'btnRemoveClass'
                            "
                        >
                            <i class="pi pi-trash"></i>
                        </button>
                    </div>
                </div>

                <span class="btnControlsContainer">
                    <button id="btnPreviousDay" @click="() => onGoBack()">
                        <i class="pi pi-arrow-left"></i> {{ t("design.back") }}
                    </button>
                    <button
                        id="btnAddActivity"
                        @click="() => onAddNewClass(selectedDay)"
                    >
                        <i class="pi pi-plus-circle"></i>
                        {{ t("design.addActivity") }}
                    </button>
                    <button id="btnForwardDay" @click="() => onGoForward()">
                        {{ t("design.forward") }}
                        <i class="pi pi-arrow-right"></i>
                    </button>
                </span>
            </div>
        </div>
        <button
            id="btnGeneratePlan"
            :class="
                hasEmptyStringsInClasses().find((element) => element === true)
                    ? 'btnGeneratePlanCancel'
                    : 'btnGeneratePlan'
            "
            type="button"
            @click="() => onRequestShowAdditional()"
            :title="
                hasEmptyStringsInClasses().find((element) => element === true)
                    ? 'Planejamento nao finalizado'
                    : 'Avancar'
            "
        >
            {{ t("design.forward") }}
        </button>
    </div>
</template>

<style src="../../styles/contents/designcontent.style.scss" scoped lang="scss" />
