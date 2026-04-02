<script lang="ts" setup>
import confetti from "@hiseb/confetti";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
    confetti({
        fade: true,
        velocity: 200,
        size: 1.6,
        count: 230,
        position: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
    });
});
</script>
<template>
    <div class="paymentContainer">
        <div class="paymentContent">
            <img alt="Dino payment" src="../../assets/dino_premium.png" />
            <h1>{{ $t("paymentcallback.title") }}</h1>

            <p>
                {{ $t("paymentcallback.description") }}
            </p>

            <button type="button" @click="router.push('/app')">
                {{ $t("paymentcallback.cta") }}
            </button>
        </div>
    </div>
</template>
<style
    lang="scss"
    scoped
    src="../../styles/callbacks/paymentCallback.style.scss"
/>
