<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleReturnInitialScreen = () => {
    router.push('/');
};

</script>
<template>
    <div class="unauthorizedContainer">
        <div class="unauthorizedContent">
            <img src="../../assets/dino_policeman.png" alt="dinossaur Police man" />

            <h2>Não autorizado</h2>
            <p>
                Nosso dinossauro (Larry) barrou você pois não possui permissão <br />
                Realize o login no sistema e tente novamente
            </p>

            <button type="button" @click="handleReturnInitialScreen">Voltar para a tela inicial</button>
        </div>
    </div>
</template>
<style lang="scss" scoped src="../../styles/errors/unauthorized.style.scss"/>
