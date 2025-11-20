<script setup lang="ts">
import { inject, watchEffect } from 'vue';
import axios from 'axios';
import type { IGithubCallbackResponse } from '../../interfaces/githubCallback.interface';
import { useRouter } from 'vue-router';
import type { IUser } from '../../interfaces/api/user.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';

watchEffect(async () => {
    const popupContext: IPopupContext = inject('popup') as IPopupContext;
    const router = useRouter();
    const searchQueryString = window.location.search;
    const urlParams = new URLSearchParams(searchQueryString);
    const codeParam = urlParams.get('code')

    const { data }: { data: IGithubCallbackResponse } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/auth/github/${codeParam}`);
    try {
        if (data.accessToken && data.accessToken.length) {
            const { data: userData }: { data: IUser } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/user/github/${data.data.email}`);
            const userHasUuid = Object.keys(userData).find(key => key === 'uuid') ? true : false;

            if (userHasUuid) {
                sessionStorage.setItem('user', JSON.stringify(userData));
                sessionStorage.setItem('loginType', 'github');
                sessionStorage.setItem('accessToken', data.accessToken);
                popupContext.handleChangePopupInfo('Login realizado com sucesso', 'success', true);

                router.push('/app');
                return;
            }

            sessionStorage.setItem('loginType', 'github');
            sessionStorage.setItem('githubEmail', data.data.email);
            sessionStorage.setItem('githubId', Number(data.data.id).toString());
            sessionStorage.setItem('accessToken', data.accessToken);
            sessionStorage.setItem('fullName', data.data.name);

            router.push('/finish/login');
        }
    } catch (err) {
        sessionStorage.setItem('loginType', 'github');
        sessionStorage.setItem('githubEmail', data.data.email);
        sessionStorage.setItem('githubId', Number(data.data.id).toString());
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('fullName', data.data.name);

        router.push('/finish/login');
    }

});

</script>

<template>
    <div class="githubCallbackContainer">
        <h2>Working on github login...</h2>
        <i class="pi pi-github"></i>
    </div>
</template>

<style src="../../styles/callbacks/githubcallback.style.scss" lang="scss" scoped />
