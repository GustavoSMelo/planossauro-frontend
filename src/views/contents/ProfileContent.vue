<script lang="ts" setup>
import { ref } from 'vue';
import type { IUser } from '../../interfaces/api/user.interface';
import convertIsoDateToBR from '../../helpers/dateIsoConvertToBR';
const user = ref<IUser>();
const duplicateUser = ref<IUser>();
const editProfile = ref(false);

const userFromSession = sessionStorage.getItem('user') as string;
user.value = { ...JSON.parse(userFromSession) };
duplicateUser.value = { ...JSON.parse(userFromSession) };

console.log(userFromSession);

const handleChangeCellphone = (event: Event) => {
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

    user.value!.cellphone_number = value;
};

</script>
<template>
    <div class="profileContainer">
        <div class="profileDetails">
            <img src="../../assets/dino_profile_logo.png" alt="Dino user profile logo" />
            <h3>{{ user?.full_name }}</h3>

            <span>
                <b><i class="pi pi-github"></i> Github:</b>
                <input v-if="user?.github_email?.length && !editProfile" :disabled="true" type="text"
                    :value="user.github_email" placeholder="Seu email aqui..." />
                <button v-else-if="user?.github_email?.length && editProfile" class="btnChangeSocialMediaProfile">Mudar perfil Github</button>
                <button v-else type="button">Conectar</button>
            </span>
            <span>
                <b><i class="pi pi-google"></i> Google:</b>
                <input v-if="user?.google_email?.length" :disabled="editProfile ? false : true"
                    :value="user.google_email" placeholder="Seu email aqui..."
                    :class="editProfile ? 'ableToEdit' : ''" />
                <button v-else-if="user?.google_email?.length && editProfile">Mudar perfil gmail</button>

                <button v-else type="button">Conectar</button>
            </span>
            <span>
                <b><i class="pi pi-phone"></i> Celular:</b>
                <input :disabled="editProfile ? false : true" type="text" :value="user?.cellphone_number"
                    placeholder="Seu celular aqui..." :class="editProfile ? 'ableToEdit' : ''" />
            </span>
            <button v-if="!editProfile" class="btnChangeProfile" type="button" @click="editProfile = true">Habilitar
                edicao</button>

            <button v-if="editProfile" class="btnChangeProfile btnChangeProfileAction" type="button">Editar perfil</button>
            <button v-if="editProfile" class="btnChangeProfile btnCancel" type="button"
                @click="editProfile = false">Cancelar</button>
            <div class="profileAdditionalDetails">
                <p>
                    <b>Email validado:</b>
                    <button type="button" :class="user?.is_validated ? 'checked' : 'unchecked'">
                        <i class="pi pi-verified"></i>{{ user?.is_validated ? 'Validado' : 'Validar' }}
                    </button>
                </p>
                <p>
                    <b>SMS validado: </b>
                    <button type="button" class="unchecked">
                        <i class="pi pi-unlock"></i>
                        Validar
                    </button>
                </p>
                <p class="createdAtText">Usuario desde: {{ convertIsoDateToBR(user?.created_at as string) }}</p>
                <button type="button"><i class="pi pi-trash"></i> Excluir conta</button>
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

                    <button>Acessar ajuda</button>
                </div>

                <div>
                    <h3><i class="pi pi-sign-out"></i> Sair: </h3>

                    <button>Deslogar / Sair</button>
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
