<script lang="ts" setup>
import { inject, ref } from 'vue';
import type { IUser } from '../../interfaces/api/user.interface';
import convertIsoDateToBR from '../../helpers/dateIsoConvertToBR';
import type { ILoadingContext } from '../../interfaces/context/loading.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
import backendApi from '../../api/api';
import { useRouter } from 'vue-router';
import type { ILoginType } from '../../interfaces/loginType.interface';
import type { IPageContent } from '../../interfaces/pageContents.interface';

const { handleChangeCurrentContent, handleChangeValidationLoginType } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent["contents"]) => void
    handleChangeValidationLoginType: (newValue: ILoginType["types"]) => void
}
>();

const user = ref<IUser>({} as IUser);
const duplicateUser = ref<IUser>({} as IUser);
const editProfile = ref(false);
const deleteAccountPopup = ref(false);
const unlinkAccountPopup = ref(false);
const unlinkAccountChoose = ref<'' | 'google' | 'github'>('');
const router = useRouter();
const { handleChangeIsLoading } = inject('isLoading') as ILoadingContext;
const { handleChangePopupInfo } = inject('popup') as IPopupContext;
const userFromSession = sessionStorage.getItem('user') as string;

user.value = { ...JSON.parse(userFromSession) };
duplicateUser.value = { ...JSON.parse(userFromSession) };

const handleChangeCellphone = (event: Event): void => {
    let { value } = event.target as HTMLInputElement;
    value = value.replace(/[a-zA-Z!@#$%^&*_+=]/g, '').trim();

    if (value[value.length - 1] === '(' || value[value.length - 1] === ')') {
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

    user.value!.cellphone_number = value;
};

const handleChangeFullName = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    user.value.full_name = target.value;
};

const handleCancelAndResetInfo = () => {
    user.value = { ...duplicateUser.value };
    editProfile.value = false;
};

const handleEditProfile = async () => {
    try {
        if (user.value.full_name.length < 5) {
            handleChangePopupInfo('Nome de usuario invalido', 'warning', true);
            return;
        }

        if (user.value.cellphone_number.length < 15 || !user.value.cellphone_number.includes('(') || !user.value.cellphone_number.includes(')') || !user.value.cellphone_number.includes('-')) {
            handleChangePopupInfo('Numero de celular invalido', 'warning', true);
            return;
        }

        handleChangeIsLoading(true);

        await backendApi.put(`/user/${user.value.uuid}`, { ...user.value });

        duplicateUser.value = { ...user.value };
        sessionStorage.setItem('user', JSON.stringify(user.value));
        editProfile.value = false

        handleChangeIsLoading(false);
        handleChangePopupInfo('Usuario editado com sucesso', 'success', true);

    } catch (err) {
        handleChangePopupInfo('Erro ao editar usuario', 'error', true);
        handleChangeIsLoading(false);
    }
};

const handleChangeGithubAccount = async () => {
    const user = JSON.parse(sessionStorage.getItem('user') as string) as IUser;

    if (!user.google_email || !user.google_email.length) {
        handleChangePopupInfo('Vincule uma conta google primeiro', 'warning', true);
        return;
    }

    const logoutPage = window.open('https://github.com/logout', 'githubLogout', 'width=600,height=700');

    sessionStorage.setItem('editProfile', 'true');
    const timer = setInterval(() => {
        if (logoutPage?.closed) {
            clearInterval(timer);
            window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=read:user,user:email&allow_signup=true`);
        }
    }, 300);
};

const handleConnectGithubAccout = async () => {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=read:user,user:email,`);
};

const handleConnectGoogleAccount = () => {
    const params = new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirect_uri: `${window.location.origin}/callback/google`,
        response_type: "token",
        scope: "profile email"
    });

    window.location.href = `http://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

const handleDeleteAccount = async () => {
    try {
        const uuid = sessionStorage.getItem('uuid') ?? '';
        const response = await backendApi.delete(`/user/${uuid}`);

        if (response.status === 200) {
            return router.push('/callback/user/delete');
        }

        handleChangePopupInfo('Valide o seu email e tente novamente', 'error', true);
    } catch (err) {
        handleChangePopupInfo('Valide o seu email e tente novamente', 'error', true);
    }
};

const logout = async () => {
    const uuid = sessionStorage.getItem('uuid') ?? '';
    await backendApi.delete(`/logout/${uuid}`);
    sessionStorage.clear();
    handleChangePopupInfo('Deslogado', 'info', true);
    router.push('/');
};

const handleSendValidationEmail = async (loginType: ILoginType['types']) => {
    if (loginType === 'github' && user.value.github_is_validated) return;
    if (loginType === 'google' && user.value.google_is_validated) return;

    try {
        handleChangeIsLoading(true);

        const userResponse: IUser = (await backendApi.get(`/user/${user.value.uuid}`)).data;
        if ((loginType === 'google' && userResponse.google_is_validated) || (loginType === 'google' && !userResponse.google_email?.length)) {
            handleChangeIsLoading(false);
            handleChangePopupInfo('Conecte uma conta google', 'info', true);
            return;
        };

        if ((loginType === 'github' && userResponse.github_is_validated) || (loginType === 'github' && !userResponse.github_email?.length)) {
            handleChangeIsLoading(false);
            handleChangePopupInfo('Conecte uma conta github', 'info', true);
            return;
        };

        await backendApi.post('/user/resend/validationcode', {
            uuid: user.value.uuid,
            loginType
        });

        handleChangeValidationLoginType(loginType);
        handleChangePopupInfo('Codigo enviado para seu email', 'success', true);
        handleChangeIsLoading(false);
        handleChangeCurrentContent('validation_code');
    } catch {
        handleChangePopupInfo('Nao foi possivel enviar o email, servico indisponivel', 'error', true);
        handleChangeIsLoading(false);
    }

};

const handleUnlinkAccount = async () => {
    try {
        handleChangeIsLoading(true);
        const uuid = sessionStorage.getItem('uuid') ?? '';
        await backendApi.patch(`/user/unlink/${uuid}`, { unlink: unlinkAccountChoose.value });
        handleChangeIsLoading(false);
        handleChangePopupInfo('Conta disvinculada, realize o login novamente', 'info', true);
        sessionStorage.clear();
        router.push('/');
    } catch (err) {
        console.error(err);
        handleChangeIsLoading(false);
        handleChangePopupInfo('Nao foi possivel desvincular conta', 'error', true);
    }
};

</script>
<template>
    <div class="unlinkAccountContainer" v-if="unlinkAccountPopup" @click="unlinkAccountPopup = false">
        <div class="unlinkAccountContent" @click="event => event.stopPropagation()">
            <h2>Deseja desvincular sua conta do {{ unlinkAccountChoose }} ?</h2>

            <p>Voce precisa pelo menos ter duas contas de redes sociais para desvincular 1 conta</p>
            <small>Exemplo: eh necessario ter a conta do google e github vinculadas para desvincular uma delas</small>

            <span class="buttonsContainer">
                <button type="button" @click="unlinkAccountPopup = false">Voltar</button>
                <button type="button" @click="handleUnlinkAccount()">Desvincular</button>
            </span>
        </div>
    </div>
    <div class="deletePopupContainer" v-if="deleteAccountPopup" @click="deleteAccountPopup = false">
        <div class="deletePopupContent" @click="event => event.stopPropagation()">
            <h2>Deseja mesmo deletar sua conta ?</h2>
            <p>
                Sua conta ficara suspensa por um periodo de 30 dias, seu plano sera cancelado automaticamente (caso
                houver um) <br />
                Dentro desse periodo de 30 dias voce podera recuperar sua conta a qualquer momento, apos isso <b>todos
                    os dados serao deletados</b>
            </p>
            <span class="buttonsContainer">
                <button type="button" @click="deleteAccountPopup = false">Voltar</button>
                <button type="button" @click="handleDeleteAccount()">Deletar</button>
            </span>
        </div>
    </div>
    <div class="profileContainer">
        <div class="profileDetails">
            <img src="../../assets/dino_profile_logo.png" alt="Dino user profile logo" />
            <h3 v-if="!editProfile">{{ user?.full_name }}</h3>
            <input v-if="editProfile" type="text" :value="user.full_name" @input="handleChangeFullName"
                placeholder="Insira seu nome..." class="fullNameInput" />

            <span>
                <b><i class="pi pi-github"></i> Github:</b>
                <input v-if="user?.github_email?.length && !editProfile" :disabled="true" type="text"
                    :value="user.github_email" placeholder="Seu email aqui..." />
                <div class="containerBtnChangeSocialMedia" v-else-if="user?.github_email?.length && editProfile">
                    <button @click="handleChangeGithubAccount" class="btnChangeSocialMediaProfile" type="button">
                        Mudar perfil Github
                    </button>
                    <button type="button" @click="unlinkAccountChoose = 'github'; unlinkAccountPopup = true"><i
                            class="pi pi-lock-open"></i></button>
                </div>

                <button v-else type="button" @click="handleConnectGithubAccout">Conectar</button>
            </span>
            <span>
                <b><i class="pi pi-google"></i> Google:</b>
                <input v-if="user?.google_email?.length && !editProfile" :disabled="true" type="text"
                    :value="user.google_email" placeholder="Seu email aqui..."
                    :class="editProfile ? 'ableToEdit' : ''" />

                <div class="containerBtnChangeSocialMedia" v-else-if="user?.google_email?.length && editProfile">
                    <button @click="handleConnectGoogleAccount" class="btnChangeSocialMediaProfile" type="button">
                        Mudar perfil Gmail
                    </button>
                    <button type="button" @click="unlinkAccountChoose = 'google'; unlinkAccountPopup = true">
                        <i class="pi pi-lock-open"></i>
                    </button>
                </div>

                <button v-else type="button" @click="handleConnectGoogleAccount">Conectar</button>
            </span>
            <span>
                <b><i class="pi pi-phone"></i> Celular:</b>
                <input :disabled="editProfile ? false : true" type="text" v-model="user.cellphone_number"
                    placeholder="Seu celular aqui..." :class="editProfile ? 'ableToEdit' : ''"
                    @input="handleChangeCellphone" />
            </span>
            <button v-if="!editProfile" class="btnChangeProfile" type="button" @click="editProfile = true">Habilitar
                edicao</button>

            <button v-if="editProfile" class="btnChangeProfile btnChangeProfileAction" type="button"
                @click="handleEditProfile">
                Editar perfil
            </button>
            <button v-if="editProfile" class="btnChangeProfile btnCancel" type="button"
                @click="handleCancelAndResetInfo">Cancelar</button>
            <div class="profileAdditionalDetails">
                <p>
                    <b><i class="pi pi-google"></i> Google validado:</b>
                    <button @click="handleSendValidationEmail('google')" type="button"
                        :class="user?.google_is_validated == true ? 'checked' : 'unchecked'">
                        <i :class="['pi', user.google_is_validated == true ? 'pi-verified' : 'pi-unlock']"></i>{{
                            user?.google_is_validated == true? 'Validado' : 'Validar' }}
                    </button>
                </p>
                <p>
                    <b><i class="pi pi-github"></i> Github validado:</b>
                    <button @click="handleSendValidationEmail('github')" type="button"
                        :class="user?.github_is_validated == true ? 'checked' : 'unchecked'">
                        <i :class="['pi', user.github_is_validated == true ? 'pi-verified' : 'pi-unlock']"></i>{{
                            user?.github_is_validated == true ? 'Validado' : 'Validar' }}
                    </button>
                </p>
                <p>
                    <b><i class="pi pi-phone"></i> SMS validado: </b>
                    <button type="button" class="unchecked">
                        <i :class="['pi', user.sms_is_validated == true ? 'pi-verified' : 'pi-unlock']"></i>
                        Validar
                    </button>
                </p>
                <p class="createdAtText">Usuario desde: {{ convertIsoDateToBR(user?.created_at as string) }}</p>
                <button type="button" @click="deleteAccountPopup = true"><i class="pi pi-trash"></i> Excluir
                    conta</button>
            </div>
        </div>
        <div class="appSettings">
            <details open>
                <summary>Configuracoes do app</summary>
                <div>
                    <h3><i class="pi pi-language"></i> Linguagem: </h3>

                    <select>
                        <option>🇧🇷 Portugues (Brasil)</option>
                        <option>🇺🇸 English (USA)</option>
                    </select>
                </div>

                <div>
                    <h3><i class="pi pi-palette"></i> Tema: </h3>

                    <select>
                        <option>☀️ Tema claro</option>
                        <option>🌑 Tema escuro</option>
                    </select>
                </div>

                <div>
                    <h3><i class="pi pi-book"></i> Documentacao: </h3>

                    <button type="button">Acessar docs</button>
                </div>

                <div>
                    <h3><i class="pi pi-headphones"></i> Ajuda / Suporte: </h3>

                    <button @click="router.push('/support')">Acessar ajuda</button>
                </div>

                <div>
                    <h3><i class="pi pi-sign-out"></i> Sair: </h3>

                    <button type="button" @click="logout">Deslogar / Sair</button>
                </div>
                <div>
                    <h3>Versao do app: </h3>

                    <p>Version 0.0.0</p>
                </div>
            </details>
        </div>
    </div>
</template>

<style lang="scss" scoped src="../../styles/contents/profilecontent.style.scss" />
