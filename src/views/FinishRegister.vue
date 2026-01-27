<style lang="scss" scoped src="../styles/finishregister.style.scss" />

<script lang="ts" setup>
import { inject, ref } from 'vue';
import type { IPopupContext } from '../interfaces/context/popup.interface';
import type { ILoadingContext } from '../interfaces/context/loading.interface';
import type { ICreateUser, ICreateUserResponse, IUser } from '../interfaces/api/user.interface';
import backendApi from '../api/api';
import { useRouter } from 'vue-router';
import type { AxiosResponse } from 'axios';
import type { ILoginType } from '../interfaces/loginType.interface';

const urlParams = new URLSearchParams(window.location.search);
const fullName = ref(window.sessionStorage.getItem('fullName') || '');
const popupContext = inject('popup') as IPopupContext;
const loadingContext = inject('isLoading') as ILoadingContext;
const validationCodeInput = ref('');
const showCodeConfirmationScreen = ref(urlParams.has('jumpToValidationCode'));
const user = ref<IUser>();
const router = useRouter();
const userFromSession: IUser | null = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as string) : null;
const cellphoneNumber = ref(userFromSession?.cellphone_number ? userFromSession.cellphone_number : '');

const handleChangeFullName = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    fullName.value = target.value;
};

const handleChangeCellphoneNumber = (event: Event): void => {
    let { value } = event.target as HTMLInputElement;
    value = value.replace(/[a-zA-Z!@#$%^&*_+=]/g, '').trim();

    if (value[value.length - 1] === '(' || value[value.length - 1] === ')') {
        console.log(true);
        if (Boolean(value.length !== 0) && Boolean(value.length !== 4)) {
            value = value.slice(0, value.length - 1);
        }
    }

    if (value[value.length - 1] === '-' && value.length !== 11) {
        value = value.slice(0, value.length - 1);
    }

    if (value.length > 15) {
        value = value.slice(0, 15);
    }

    if (value.length === 1 && !value.includes('(')) {
        value = `(${value}`;
    }

    if (value.length === 5 && !value.includes(' ')) {
        const lastChar = value[value.length - 1];
        const cellphoneContentArray = value.slice(0, value.length - 1).split('');
        let cellphoneContentString = '';

        cellphoneContentArray.forEach(el => cellphoneContentString += el);
        value = `${cellphoneContentString} ${lastChar}`;
    }

    if (value.length === 4 && !value.includes(')') && !value.includes(' ')) {
        const lastChar = value[value.length - 1];
        const cellphoneContent = value.split('');

        value = `${cellphoneContent[0]}${cellphoneContent[1]}${cellphoneContent[2]}) ${lastChar}`;
    }

    if (value.length === 11 && !value.includes('-')) {
        const lastChar = value[value.length - 1];
        const cellphoneContentArray = value.slice(0, value.length - 1).split('');
        let cellphoneContentString = '';

        cellphoneContentArray.forEach(el => cellphoneContentString += el);
        value = `${cellphoneContentString}-${lastChar}`;
    }
    cellphoneNumber.value = value;
};

const isFormCompleted = (): boolean => {
    return fullName.value.length > 3 && cellphoneNumber.value.length === 15 ? true : false;
};

const handleGithubSave = async () => {
    try {
        loadingContext.handleChangeIsLoading(true);
        const githubEmail = sessionStorage.getItem('githubEmail');
        const githubId = sessionStorage.getItem('githubId');

        const userData = {
            'full_name': fullName.value,
            'cellphone_number': cellphoneNumber.value,
            'github_email': githubEmail,
            'github_id': githubId,
        } as unknown as ICreateUser;

        let responseUserCreated: AxiosResponse<any, any, {}>;

        if (userFromSession && userFromSession.uuid) {
            responseUserCreated = await backendApi.put(`/user/${userFromSession.uuid}`, { ...userFromSession, ...userData });
        } else {
            responseUserCreated = await backendApi.post('/user', { ...userData });
        }
        const responseData: ICreateUserResponse['data'] = userFromSession?.uuid ? responseUserCreated.data.user : responseUserCreated.data.data;

        if (responseData.uuid) {
            user.value = { ...responseData };
            user.value.github_is_validated = false;
            showCodeConfirmationScreen.value = true;
            console.log(showCodeConfirmationScreen.value);
            sessionStorage.setItem('uuid', responseData.uuid);
            sessionStorage.setItem('user', JSON.stringify(user.value));
            popupContext.handleChangePopupInfo('Cadastro realizado com sucesso', 'success', true);
        }
        loadingContext.handleChangeIsLoading(false);
    } catch (err) {
        popupContext.handleChangePopupInfo('Erro ao envio de email', 'error', true);
        console.error(err);
        loadingContext.handleChangeIsLoading(false);
    }
};

const handleGoogleSave = async () => {
    try {
        loadingContext.handleChangeIsLoading(true);
        const googleEmail = sessionStorage.getItem('googleEmail');
        const googleId = sessionStorage.getItem('googleId') || '';

        const userData = {
            'full_name': fullName.value,
            'cellphone_number': cellphoneNumber.value,
            'google_email': googleEmail,
            'google_id': googleId,
        } as unknown as ICreateUser;

        let responseUserCreated: AxiosResponse<any, any, {}>;

        if (userFromSession && userFromSession.uuid) {
            responseUserCreated = await backendApi.put(`/user/${userFromSession.uuid}`, { ...userData, ...userFromSession });
        } else {
            responseUserCreated = await backendApi.post('/user', { ...userData });
        }
        const responseData: ICreateUserResponse['data'] = responseUserCreated.data.data;

        if (responseData.uuid) {
            user.value = { ...responseData };
            user.value.google_is_validated = false;
            showCodeConfirmationScreen.value = true;
            console.log(showCodeConfirmationScreen.value);
            sessionStorage.setItem('uuid', responseData.uuid);
            sessionStorage.setItem('user', JSON.stringify(user.value));
            popupContext.handleChangePopupInfo('Cadastro realizado com sucesso', 'success', true);
        }
        loadingContext.handleChangeIsLoading(false);
    } catch (err) {
        popupContext.handleChangePopupInfo('Erro ao envio de email', 'error', true);
        console.error(err);
        loadingContext.handleChangeIsLoading(false);
    }
};

const handleProceed = async (): Promise<void> => {
    if (!isFormCompleted()) return;

    const loginType = sessionStorage.getItem('loginType');

    if (!loginType || loginType !== 'github' && loginType !== 'google') {
        popupContext.handleChangePopupInfo('Tipo de login nao autorizado', 'error', true);
        return;
    }

    if (loginType === 'github') return await handleGithubSave();
    if (loginType === 'google') return await handleGoogleSave();
};

const handleChangeValidationCodeInput = (event: Event): void => {
    let { value } = event.target as HTMLInputElement;
    value = value.replace(/[a-zA-Z!@#$%^&*_+=()-]/g, '').trim();

    if (value.length > 5) value = value.slice(0, 5);
    validationCodeInput.value = value;
};

const resendEmail = async () => {
    try {
        loadingContext.handleChangeIsLoading(true);

        const loginType = sessionStorage.getItem('loginType');
        await backendApi.post('/user/resend/validationcode', {
            'uuid': user.value?.uuid,
            loginType
        });

        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo('Email reenviado com sucesso', 'success', true);
    } catch (err) {
        console.error(err);
        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo('Erro ao reenviar email', 'error', true);
    }
};

const finishValidation = async () => {
    try {
        if (!validationCodeInput.value.length) return;

        const loginType = sessionStorage.getItem('loginType') as ILoginType['types'];
        console.log(validationCodeInput.value);

        const isValidatedResponse = await backendApi.patch(`/user/validate/${user.value?.uuid}`, {
            loginType,
            'validationCode': validationCodeInput.value
        });

        if (isValidatedResponse.status !== 200) {
            popupContext.handleChangePopupInfo('Codigo de validacao invalido', 'error', true);
            return;
        }
        loadingContext.handleChangeIsLoading(true);

        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo('Validacao realizada com sucesso', 'success', true);

        if (loginType === 'github') user.value!.github_is_validated = true;
        else user.value!.google_is_validated = true;

        sessionStorage.setItem('user', JSON.stringify(user.value));
        router.push('/app');
    } catch (err) {
        console.error(err);
        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo('Ocorreu um erro ao\n realizar a validacao\n\n ou codigo invalido', 'error', true);
    }
};
</script>

<template>
    <div class="finishRegisterContainer">
        <form class="formContainer" v-if="!showCodeConfirmationScreen && !user?.github_is_validated">
            <h2>Finalize seu cadastro: </h2>

            <label>Nome completo: </label>
            <input type="text" placeholder="Insira seu nome aqui..." v-model="fullName"
                @change="event => handleChangeFullName(event)" />

            <label>Telefone celular: </label>
            <input type="text" placeholder="Insira seu telefone aqui... " v-model="cellphoneNumber"
                @input="handleChangeCellphoneNumber" />

            <button :class="isFormCompleted() ? 'btnProceedRegister' : ''" type="button" @click="handleProceed">
                Avancar
            </button>
        </form>

        <div class="validationContainer" v-else>
            <h2>Validacao da conta: </h2>
            <form class="validationForm">
                <label>Insira o codigo de validacao</label>
                <input type="text" placeholder="Codigo de validacao..." @input="handleChangeValidationCodeInput"
                    v-model="validationCodeInput" />
                <small>Se nao encontrar o codigo, de uma olhada na caixa de spam</small>
            </form>

            <div class="buttonsContainer">
                <button type="button" @click="() => router.push('/app')">Validar mais tarde</button>
                <span>
                    <button type="button" @click="resendEmail">Re-enviar email</button>
                    <button @click="finishValidation" :class="validationCodeInput.length === 5 ? 'btnFinish' : ''"
                        type="button">Finalizar</button>
                </span>
            </div>
        </div>
    </div>
</template>
