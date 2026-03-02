<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const handleReturnInitialScreen = () => {
    router.push('/');
};

</script>
<template>
    <div class="notFoundContainer">
        <div class="notFoundContent">
            <img src="../../assets/dino_not_found.png" alt="dinossaur hidden" />

            <h2>{{ t('notFound.title') }}</h2>
            <p>
                {{ t('notFound.description') }}
            </p>

            <button type="button" @click="handleReturnInitialScreen">{{ t('notFound.button') }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped src="../../styles/errors/notfound.style.scss" />
