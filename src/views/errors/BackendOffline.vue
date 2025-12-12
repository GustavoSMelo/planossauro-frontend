<script setup lang="ts">
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
    const router = useRouter();
    const { handleChangePopupInfo } = inject('popup') as IPopupContext;

    const reportError = () => {
        handleChangePopupInfo('Report enviado com sucesso', 'success', true);
        router.push('/');
    };
</script>
<template>
    <div class="backendOfflineErrorContainer">
        <div class="backendOfflineError">
            <img src="../../assets/sad_yellow.png" alt="Sad dinossaur" />
            <h2>Estamos offline</h2>

            <p>Um de nossos dinossauros quebrou o sistema</p>
            <p>Nao se preocupe, o dino especialista esta arrumando tudo</p>
            <p>Clique no botao para nos informar a instabilidade</p>

            <button type="button" @click="reportError">Reportar instabilidade</button>
        </div>
    </div>
</template>
<style lang="scss" src="../../styles/errors/backendoffiline.style.scss" scoped />
