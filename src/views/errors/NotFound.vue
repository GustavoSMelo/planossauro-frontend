<script lang="ts" setup>
import { useRouter } from 'vue-router';

    const router = useRouter();

    const handleReturnInitialScreen = () => {
        router.push('/');
    };

</script>
<template>
    <div class="notFoundContainer">
        <div class="notFoundContent">
            <img src="../../assets/dino_not_found.png" alt="dinossaur hidden" />

            <h2>Pagina nao encontrada</h2>
            <p>
                Um de nossos dinossauros pegou essa pagina e a escondeu. <br />
                ou essa pagina nunca existiu. Clique no botao abaixo para voltar a tela inicial
            </p>

            <button type="button" @click="handleReturnInitialScreen">Voltar para a tela inicial</button>
        </div>
    </div>
</template>

<style lang="scss" scoped src="../../styles/errors/notfound.style.scss" />
