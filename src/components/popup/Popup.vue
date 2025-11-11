<script setup lang="ts">
import { inject } from 'vue';
import type { IPopupContext } from '../../interfaces/context/popup.interface';

const popupContext = inject('popup') as IPopupContext;
</script>
<template>
    <div class="popupContainer">
        <div class="popup" :class="popupContext.popup.status">
            <i v-if="popupContext.popup.status === 'error'" class="pi pi-exclamation-circle popupLogo"></i>
            <i v-else-if="popupContext.popup.status === 'info'" class="pi pi-info-circle popupLogo"></i>
            <i v-else-if="popupContext.popup.status === 'success'" class="pi pi-check-circle popupLogo"></i>
            <i v-else class="pi pi-exclamation-triangle popupLogo"></i>

            <p class="popupMessage">{{ popupContext.popup.message }}</p>

            <i class="pi pi-times popupClose" @click="popupContext.handleChangePopupShow()"></i>
        </div>
    </div>
</template>

<style src="./popup.style.scss" lang="scss" scoped />
