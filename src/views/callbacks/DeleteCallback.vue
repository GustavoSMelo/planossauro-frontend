<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
import type { IUser } from '../../interfaces/api/user.interface';
import backendApi from '../../api/api';

const counterDays = ref(0);
const router = useRouter();
const { handleChangePopupInfo } = inject('popup') as IPopupContext;

const handleLogout = () => {
    sessionStorage.clear();
    handleChangePopupInfo('Deslogado', 'info', true);
    return router.push('/');
};

const handleRestoreAccount = async () => {
    try {
        const uuid = sessionStorage.getItem('uuid');
        const response = await backendApi.patch(`/user/restore/${uuid}`);

        if (response.status === 200) {
            const user = JSON.parse(sessionStorage.getItem('user') ?? '') as IUser;
            user.deleted_at = null;
            sessionStorage.setItem('user', JSON.stringify(user));
            handleChangePopupInfo('Conta restaurada com sucesso', 'success', true);
            return router.push('/app');
        }
        handleChangePopupInfo('Nao foi possivel restaurar a conta, tente novamente mais tarde', 'error', true);
    } catch {
        handleChangePopupInfo('Nao foi possivel restaurar a conta, tente novamente mais tarde', 'error', true);
    }

};

onMounted(() => {
    const user = JSON.parse(sessionStorage.getItem('user') ?? '') as IUser;

    const currentDate = new Date();
    const next30Days = new Date(user.deleted_at!);
    next30Days.setDate(next30Days.getDate() + 30);

    counterDays.value = next30Days.getTime() - currentDate.getTime();
});
</script>

<template>
    <div class="deleteUserContainer">
        <div class="deleteUserContent">
            <img src="../../assets/dino_chorandinho.png" alt="dino chorandinho" />
            <h2>Sua conta foi excluida</h2>
            <p>
                Voce selecionou em excluir a conta, voce esta em periodo de delecao de conta, que ira terminar em
                <b>{{ Math.floor(counterDays / (1000 * 60 * 60 * 24)) }} dia(s)</b>,
                <br /> se deseja voltar a usar nosso sistema, basta clicar no botao abaixo para retornar os
                planejamentos
            </p>

            <button type="button" @click="handleRestoreAccount()">Restaurar conta</button>
            <button type="button" class="btnLogout" @click="handleLogout()">Deslogar</button>
        </div>
    </div>
</template>
<style lang="scss" scoped src="../../styles/callbacks/deletecallback.style.scss" />
