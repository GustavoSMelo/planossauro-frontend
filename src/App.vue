<script setup lang="ts">
import { RouterView } from 'vue-router';
import { provide, ref, watch } from 'vue';
import Loading from './components/loading/Loading.vue';
import type { IPopup } from './interfaces/popup.interface';
import Popup from './components/popup/Popup.vue';

let timeoutId: number;

// refs
const isLoading = ref(false);
const popup = ref<IPopup>({
    message: '',
    status: 'error',
    show: false
});


watch(popup, () => {
    timeoutId = setTimeout(() => {
        popup.value = { ...popup.value, show: false }
    }, 4000);
});

// changing states
const handleChangeIsLoading = (newValue: boolean) => {
    isLoading.value = newValue;
};

const handleChangePopupInfo = (message: string, status: IPopup['status'], show: boolean): void => {
    clearTimeout(timeoutId);
    popup.value = {
        message, show, status
    };
};

const handleChangePopupShow = (): void => {
    popup.value = { ...popup.value, show: !popup.value.show };
    clearTimeout(timeoutId);
};

// defining context
provide('isLoading', { isLoading, handleChangeIsLoading });
provide('popup', { popup, handleChangePopupInfo, handleChangePopupShow });
</script>

<template>
    <RouterView />
    <Loading v-if="isLoading" />
    <Popup v-if="popup.show && popup.message.length > 0" />
</template>
