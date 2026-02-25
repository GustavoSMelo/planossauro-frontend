<script lang="ts" setup>
import { inject, ref } from 'vue';
import type { ILoginType } from '../../interfaces/loginType.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
import type { ILoadingContext } from '../../interfaces/context/loading.interface';
import backendApi from '../../api/api';
import type { IUser } from '../../interfaces/api/user.interface';
import type { IPageContent } from '../../interfaces/pageContents.interface';

const { validationLoginType, handleChangeCurrentContent } = defineProps<{
    validationLoginType: ILoginType['types'],
    handleChangeCurrentContent: (newValue: IPageContent["contents"]) => void
}>();
const validationCodeInput = ref('');
const { handleChangePopupInfo } = inject('popup') as IPopupContext;
const { handleChangeIsLoading } = inject('isLoading') as ILoadingContext;
const user = JSON.parse(sessionStorage.getItem('user') as string) as IUser;

const handleChangeValidationCodeInputText = (event: Event) => {
    const target = event.target as HTMLInputElement;
    validationCodeInput.value = target.value.replace('/\D+/g', '');
};

const stopPropagation = (event: Event) => {
    event.stopPropagation();
};

const handleValidateCode = async () => {
    try {
        handleChangeIsLoading(true);

        const response = await backendApi.patch(`/user/validate/${user.uuid}`, {
            'loginType': validationLoginType,
            validationCode: validationCodeInput.value
        });

        if (response.status === 200) {
            const sanitizedUser: IUser = {
                ...user,
                github_is_validated: validationLoginType === 'github' ? true : user.github_is_validated,
                google_is_validated: validationLoginType === 'google' ? true : user.google_is_validated,
            };

            sessionStorage.setItem('user', JSON.stringify(sanitizedUser));

            handleChangePopupInfo('Validado com sucesso', 'success', true);
            handleChangeIsLoading(false);
            handleChangeCurrentContent('profile');
            return;
        }

        handleChangePopupInfo('Codigo invalido', 'error', true);
        handleChangeIsLoading(false);
    } catch (err) {
        console.error(err);
        handleChangePopupInfo('Codigo invalido', 'error', true);
        handleChangeIsLoading(false);
    }
};

</script>

<template>
    <div class="validationCodeContainer" @click="stopPropagation">
        <h2>Confirme seu email</h2>

        <small>Enviamos um codigo no email cadastro no {{ validationLoginType === 'google' ? 'Gmail' : 'Github' }}</small>
        <input inputmode="numeric" type="text" placeholder="Insira o codigo aqui... " v-model="validationCodeInput"
            @input="handleChangeValidationCodeInputText" />

        <span>
            <button type="button" @click="handleChangeCurrentContent('profile')">Cancelar</button>
            <button type="button" @click="handleValidateCode">Validar</button>
        </span>
    </div>
</template>

<style lang="scss" scoped src="./validationcodeinputbox.style.scss" />
