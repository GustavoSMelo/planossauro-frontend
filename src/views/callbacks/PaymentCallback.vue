<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<template>
    <div class="paymentContainer">
        <div class="paymentContent">
            <img alt="Dino payment" src="../../assets/dino_premium.png" />
            <h1>Seu pagamento foi aceito com sucesso</h1>

            <p>
                Seu pagamento esta em processamento, em alguns instantes seu plano vai ser alterado :D
                <br /> Caso nao altere, saia do sistema e entre novamente. <br />
                Se precisar de ajuda, entre em suporte com nosso time :D
            </p>

            <button type="button" @click="router.push('/app')">Ir para a pagina inicial</button>
        </div>
    </div>
</template>
<style lang="scss" scoped src="../../styles/callbacks/paymentCallback.style.scss" />
