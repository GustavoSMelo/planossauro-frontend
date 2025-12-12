<script lang="ts" setup>
import { inject, onMounted } from 'vue';
import isApiHealth from '../../api/healthCheck';
import { useRouter } from 'vue-router';
import axios from 'axios';
import type { IGoogleResponse } from '../../interfaces/api/googleResponse.interface';
import backendApi from '../../api/api';
import type { IUser } from '../../interfaces/api/user.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';

onMounted(async () => {
    const popupContext = inject('popup') as IPopupContext;
    const userJson = sessionStorage.getItem('user');
    const router = useRouter();
    const isApiOnline = await isApiHealth();

    if (isApiOnline === false) {
        router.push('/offline');
    }

    let user;

    if (userJson?.length) {
        user = JSON.parse(userJson) as IUser;
    }

    const hashes = window.location.hash;
    const paramsString = hashes.substring(1);

    const searchParams = new URLSearchParams(paramsString);
    console.log(searchParams);
    const accessToken = searchParams.get('access_token') || '';

    const response = await axios.get('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    const googleResponse = response.data as IGoogleResponse;

    console.log(googleResponse);

    try {
        let { data: userData }: { data: IUser } = await backendApi.get(`/user/google/${googleResponse.email}`);
        console.log(userData);
        const userHasUuid = Object.keys(userData).find(key => key === 'uuid') ? true : false;

        if (userHasUuid) {
            if (user && user.uuid && (userData.uuid === user.uuid)) {
                const updatedUser = await backendApi.put(`/user/${user.uuid}`, {
                    ...user,
                    google_email: userData.google_email,
                    google_is_validated: false,
                    google_id: userData.google_id,
                });

                userData = { ...updatedUser.data.user };
            }

            userData.github_validation_code = null;
            userData.google_validation_code = null;
            userData.sms_validation_code = null;

            sessionStorage.setItem('user', JSON.stringify(userData));
            sessionStorage.setItem('loginType', 'github');
            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('uuid', userData.uuid);
            popupContext.handleChangePopupInfo('Login realizado com sucesso', 'success', true);

            const editProfile = Boolean(sessionStorage.getItem('editProfile'));

            if (user && user.uuid === userData.uuid && editProfile && !userData.google_is_validated) {
                router.push('/finish/login?jumpToValidationCode=true');
            } else {
                router.push('/app');
            }
            return;
        }
    } catch (err) {
        sessionStorage.setItem('loginType', 'google');
        sessionStorage.setItem('googleEmail', googleResponse.email);
        sessionStorage.setItem('googleId', googleResponse.sub);
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('fullName', googleResponse.name);


        router.push('/finish/login');
    }


    sessionStorage.setItem('loginType', 'google');
    sessionStorage.setItem('googleEmail', googleResponse.email);
    sessionStorage.setItem('googleId', googleResponse.sub);
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('fullName', googleResponse.name);

    router.push('/finish/login');
});
</script>

<template>
    <div class="googleCallbackContainer">
        <i class="pi pi-google"></i>
        <h2>Realizando login com o Google...</h2>
    </div>
</template>

<style lang="scss" scoped src="../../styles/callbacks/googleCallback.style.scss" />
