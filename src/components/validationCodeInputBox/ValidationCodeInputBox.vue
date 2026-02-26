<script lang="ts" setup>
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ILoginType } from '../../interfaces/loginType.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
import type { ILoadingContext } from '../../interfaces/context/loading.interface';
import backendApi from '../../api/api';
import type { IUser } from '../../interfaces/api/user.interface';
import type { IPageContent } from '../../interfaces/pageContents.interface';

const { t } = useI18n();

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

            handleChangePopupInfo(t('validationCodeInputBox.validationSuccess'), 'success', true);
            handleChangeIsLoading(false);
            handleChangeCurrentContent('profile');
            return;
        }

        handleChangePopupInfo(t('validationCodeInputBox.invalidCode'), 'error', true);
        handleChangeIsLoading(false);
    } catch (err) {
        console.error(err);
        handleChangePopupInfo(t('validationCodeInputBox.invalidCode'), 'error', true);
        handleChangeIsLoading(false);
    }
};

</script>

<template>
    <div class="validationCodeContainer" @click="stopPropagation">
        <h2>{{ t('validationCodeInputBox.confirmEmail') }}</h2>

        <small>{{ t('validationCodeInputBox.sentCodeEmail', { provider: validationLoginType === 'google' ? 'Gmail' : 'Github' }) }}</small>
        <input inputmode="numeric" type="text" :placeholder="t('validationCodeInputBox.insertCodePlaceholder')" v-model="validationCodeInput"
            @input="handleChangeValidationCodeInputText" />

        <span>
            <button type="button" @click="handleChangeCurrentContent('profile')">{{ t('validationCodeInputBox.cancel') }}</button>
            <button type="button" @click="handleValidateCode">{{ t('validationCodeInputBox.validate') }}</button>
        </span>
    </div>
</template>

<style lang="scss" scoped src="./validationcodeinputbox.style.scss" />
