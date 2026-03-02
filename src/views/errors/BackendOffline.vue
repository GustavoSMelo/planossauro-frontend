<script setup lang="ts">
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { IPopupContext } from '../../interfaces/context/popup.interface';

const { t } = useI18n();
const router = useRouter();
const { handleChangePopupInfo } = inject('popup') as IPopupContext;

const reportError = () => {
    handleChangePopupInfo(t('backendOffline.successMessage'), 'success', true);
    router.push('/');
};
</script>
<template>
    <div class="backendOfflineErrorContainer">
        <div class="backendOfflineError">
            <img src="../../assets/sad_yellow.png" alt="Sad dinossaur" />
            <h2>{{ t('backendOffline.title') }}</h2>

            <p>{{ t('backendOffline.description1') }}</p>
            <p>{{ t('backendOffline.description2') }}</p>
            <p>{{ t('backendOffline.description3') }}</p>

            <button type="button" @click="reportError">{{ t('backendOffline.button') }}</button>
        </div>
    </div>
</template>
<style lang="scss" src="../../styles/errors/backendoffiline.style.scss" scoped />
