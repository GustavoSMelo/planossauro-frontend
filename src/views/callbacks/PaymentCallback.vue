<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<template>
    <div class="paymentContainer">
        <div class="paymentContent">
            <img alt="Dino payment" src="../../assets/dino_premium.png" />
            <h1>{{ $t('paymentcallback.title') }}</h1>

            <p>
                {{ $t('paymentcallback.description') }}
            </p>

            <button type="button" @click="router.push('/app')">{{ $t('paymentcallback.cta') }}</button>
        </div>
    </div>
</template>
<style lang="scss" scoped src="../../styles/callbacks/paymentCallback.style.scss" />
