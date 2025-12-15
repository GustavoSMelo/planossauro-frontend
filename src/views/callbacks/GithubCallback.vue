<script setup lang="ts">
import { inject, watchEffect } from 'vue';
import axios from 'axios';
import type { IGithubCallbackResponse } from '../../interfaces/githubCallback.interface';
import { useRouter } from 'vue-router';
import type { IUser } from '../../interfaces/api/user.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
import backendApi from '../../api/api';
import isApiHealth from '../../api/healthCheck';

watchEffect(async () => {
    const popupContext: IPopupContext = inject('popup') as IPopupContext;
    const router = useRouter();
    const searchQueryString = window.location.search;
    const urlParams = new URLSearchParams(searchQueryString);
    const codeParam = urlParams.get('code')
    const error = urlParams.get('error');
    const userJson = sessionStorage.getItem('user');

    const apiIsRunning = await isApiHealth();

    if (apiIsRunning === false) {
        router.push('/offline');
        return;
    }

    let user;

    if (userJson?.length) {
        user = JSON.parse(userJson) as IUser;
    }

    if (error) {
        popupContext.handleChangePopupInfo('Login nao autorizado pelo usuario', 'error', true);
        router.push('/');
        return;
    }

    const { data }: { data: IGithubCallbackResponse } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/auth/github/${codeParam}`);
    if (data.data.email === null) {
        popupContext.handleChangePopupInfo('Email do github nao esta publico, torne-o publico e tente novamente', 'info', true);
        router.push('/login');
        return;
    }

    try {
        console.log(data);
        if (data.accessToken && data.accessToken.length) {
            let { data: userData }: { data: IUser } = await backendApi.get(`/user/github/${data.data.email}`);
            const userHasUuid = Object.keys(userData).find(key => key === 'uuid') ? true : false;

            console.log(userData);

            if (userHasUuid) {
                if (user && user.uuid && (userData.uuid === user.uuid)) {
                    const updatedUser = await backendApi.put(`/user/${user.uuid}`, {
                        ...user,
                        github_id: userData.github_id,
                        github_email: userData.github_email,
                        github_is_validated: false
                    });

                    userData = { ...updatedUser.data.user };
                }
                userData.github_validation_code = null;
                userData.google_validation_code = null;
                userData.sms_validation_code = null;

                console.log(userData);

                sessionStorage.setItem('user', JSON.stringify(userData));
                sessionStorage.setItem('loginType', 'github');
                sessionStorage.setItem('accessToken', data.accessToken);
                sessionStorage.setItem('uuid', userData.uuid);
                popupContext.handleChangePopupInfo('Login realizado com sucesso', 'success', true);

                const editProfile = Boolean(sessionStorage.getItem('editProfile'));

                if (user && user.uuid === userData.uuid && editProfile && !userData.github_is_validated) {
                    router.push('/finish/login?jumpToValidationCode=true');
                } else {
                    router.push('/app');
                }
                return;
            }

            sessionStorage.setItem('loginType', 'github');
            sessionStorage.setItem('githubEmail', data.data.email);
            sessionStorage.setItem('githubId', Number(data.data.id).toString());
            sessionStorage.setItem('accessToken', data.accessToken);
            sessionStorage.setItem('fullName', data.data.name ? data.data.name : data.data.login);

            router.push('/finish/login');
        }
    } catch (err) {
        sessionStorage.setItem('loginType', 'github');
        sessionStorage.setItem('githubEmail', data.data.email);
        sessionStorage.setItem('githubId', Number(data.data.id).toString());
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('fullName', data.data.name ? data.data.name : data.data.login);

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
