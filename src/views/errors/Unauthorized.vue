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
    <div class="unauthorizedContainer">
        <div class="unauthorizedContent">
            <img src="../../assets/dino_policeman.png" alt="dinossaur Police man" />

            <h2>{{ t('unauthorized.title') }}</h2>
            <p>
                {{ t('unauthorized.description') }}
            </p>

            <button type="button" @click="handleReturnInitialScreen">{{ t('unauthorized.button') }}</button>
        </div>
    </div>
</template>
<style lang="scss" scoped src="../../styles/errors/unauthorized.style.scss"/>
