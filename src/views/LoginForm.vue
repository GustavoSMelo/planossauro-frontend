<style lang="scss" scoped src="../styles/loginform.style.scss" />

<script lang="ts" setup>
import { inject, ref } from "vue";
import { useDark } from "@vueuse/core";
import { useRouter } from "vue-router";
import { setToken } from "../helpers/token";
import backendApi from "../api/api";
import type { IPopupContext } from "../interfaces/context/popup.interface";
import type { ILoadingContext } from "../interfaces/context/loading.interface";
import type { IAccessSanctumToken } from "../interfaces/auth.interface";

const isDark = useDark({
    attribute: "data-theme",
    valueLight: "light",
    valueDark: "dark",
});

const router = useRouter();
const popupContext = inject("popup") as IPopupContext;
const loadingContext = inject("isLoading") as ILoadingContext;

const isRegisterMode = ref(false);
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const fullName = ref("");
const cellphoneNumber = ref("");
const initialHour = ref("12:00");
const intervalBetweenClasses = ref("30min");

const toggleMode = () => {
    isRegisterMode.value = !isRegisterMode.value;
};

const handleChangeCellphoneNumber = (event: Event): void => {
    let { value } = event.target as HTMLInputElement;
    value = value.replace(/[^0-9() -]/g, "").trim();

    if (value[value.length - 1] === "(" || value[value.length - 1] === ")") {
        if (Boolean(value.length !== 0) && Boolean(value.length !== 4)) {
            value = value.slice(0, value.length - 1);
        }
    }

    if (value[value.length - 1] === "-" && value.length !== 11) {
        value = value.slice(0, value.length - 1);
    }

    if (value.length > 15) {
        value = value.slice(0, 15);
    }

    if (value.length === 1 && !value.includes("(")) {
        value = `(${value}`;
    }

    if (value.length === 5 && !value.includes(" ")) {
        const lastChar = value[value.length - 1];
        const cellphoneContentArray = value
            .slice(0, value.length - 1)
            .split("");
        let cellphoneContentString = "";

        cellphoneContentArray.forEach((el) => (cellphoneContentString += el));
        value = `${cellphoneContentString} ${lastChar}`;
    }

    if (value.length === 4 && !value.includes(")") && !value.includes(" ")) {
        const lastChar = value[value.length - 1];
        const cellphoneContent = value.split("");

        value = `${cellphoneContent[0]}${cellphoneContent[1]}${cellphoneContent[2]}) ${lastChar}`;
    }

    if (value.length === 11 && !value.includes("-")) {
        const lastChar = value[value.length - 1];
        const cellphoneContentArray = value
            .slice(0, value.length - 1)
            .split("");
        let cellphoneContentString = "";

        cellphoneContentArray.forEach((el) => (cellphoneContentString += el));
        value = `${cellphoneContentString}-${lastChar}`;
    }
    cellphoneNumber.value = value;
};

const handleChangeInitialHour = (hour: string) => {
    initialHour.value = hour;
};

const handleChangeIntervalBetweenClasses = (interval: string) => {
    intervalBetweenClasses.value = interval;
};

const isLoginFormValid = (): boolean => {
    return email.value.length > 0 && password.value.length > 0;
};

const isRegisterFormValid = (showPopup: boolean = true): boolean => {
    if (email.value.length === 0) {
        popupContext.handleChangePopupInfo("E-mail vazio!", "error", showPopup);
        return false;
    }
    if (password.value.length <= 7) {
        popupContext.handleChangePopupInfo(
            "Senha muito curta (8 digitos minimos)",
            "error",
            showPopup,
        );
        return false;
    }
    if (password.value !== passwordConfirmation.value) {
        popupContext.handleChangePopupInfo(
            "Senha de confirmação não corresponde",
            "error",
            showPopup,
        );
        return false;
    }
    if (fullName.value.length <= 3) {
        popupContext.handleChangePopupInfo(
            "Nome invalido ou muito curto",
            "error",
            showPopup,
        );
        return false;
    }
    if (cellphoneNumber.value.length !== 15) {
        popupContext.handleChangePopupInfo(
            "Numero de telefone invalido",
            "error",
            showPopup,
        );
        return false;
    }

    return true;
};

const handleLogin = async () => {
    if (!isLoginFormValid()) return;

    try {
        loadingContext.handleChangeIsLoading(true);
        const response = await backendApi.post("/auth/login", {
            email: email.value,
            password: password.value,
        });

        const sanctumResponse = response.data as IAccessSanctumToken;
        setToken(sanctumResponse.token.plainTextToken);
        sessionStorage.setItem("user", JSON.stringify(sanctumResponse.user));

        popupContext.handleChangePopupInfo(
            "Login realizado com sucesso!",
            "success",
            true,
        );
        loadingContext.handleChangeIsLoading(false);
        router.push("/app");
    } catch {
        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo(
            "E-mail ou senha inválidos",
            "error",
            true,
        );
    }
};

const handleRegister = async () => {
    if (!isRegisterFormValid()) return;

    try {
        loadingContext.handleChangeIsLoading(true);
        const hours = Math.floor(
            Number(intervalBetweenClasses.value.split("min")[0]) / 60,
        );
        const mins = Math.round(
            Number(intervalBetweenClasses.value.split("min")[0]) % 60,
        );
        const interval = `${hours}:${mins}`;

        const userData = {
            full_name: fullName.value,
            cellphone_number: cellphoneNumber.value,
            email: email.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
            initial_hour: initialHour.value,
            interval_between_classes: interval,
        };

        await backendApi.post("/auth/register", userData);

        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo(
            "Registro realizado com sucesso! Faça login para continuar.",
            "success",
            true,
        );
        isRegisterMode.value = false;
    } catch {
        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo(
            "Erro ao criar conta. Tente novamente.",
            "error",
            true,
        );
    }
};
</script>

<template>
    <div class="loginFormContainer">
        <form class="formContainer" v-if="!isRegisterMode">
            <h2>Login</h2>

            <label>E-mail</label>
            <input
                type="email"
                :data-theme="isDark ? 'dark' : 'light'"
                placeholder="seu@email.com"
                v-model="email"
            />

            <label>Senha</label>
            <input
                type="password"
                :data-theme="isDark ? 'dark' : 'light'"
                placeholder="Sua senha"
                v-model="password"
            />

            <button
                :class="isLoginFormValid() ? 'btnProceed' : ''"
                type="button"
                @click="handleLogin"
            >
                Entrar
            </button>

            <p class="toggleMode">
                Não tem uma conta?
                <a href="#" @click.prevent="toggleMode">Registre-se</a>
            </p>
        </form>

        <form class="formContainer" v-else>
            <h2>Registro</h2>

            <div class="formGrid">
                <div class="formField">
                    <label>Nome completo</label>
                    <input
                        type="text"
                        :data-theme="isDark ? 'dark' : 'light'"
                        placeholder="Seu nome completo"
                        v-model="fullName"
                    />
                </div>

                <div class="formField">
                    <label>E-mail</label>
                    <input
                        type="email"
                        :data-theme="isDark ? 'dark' : 'light'"
                        placeholder="seu@email.com"
                        v-model="email"
                    />
                </div>

                <div class="formField">
                    <label>Celular</label>
                    <input
                        type="text"
                        :data-theme="isDark ? 'dark' : 'light'"
                        placeholder="(00) 00000-0000"
                        v-model="cellphoneNumber"
                        @input="handleChangeCellphoneNumber"
                    />
                </div>

                <div class="formField">
                    <label>Senha</label>
                    <input
                        type="password"
                        :data-theme="isDark ? 'dark' : 'light'"
                        placeholder="Sua senha"
                        v-model="password"
                    />
                </div>

                <div class="formField">
                    <label>Confirmar senha</label>
                    <input
                        type="password"
                        :data-theme="isDark ? 'dark' : 'light'"
                        placeholder="Confirme sua senha"
                        v-model="passwordConfirmation"
                    />
                </div>

                <div class="formField">
                    <label>Horário de início de suas aulas</label>
                    <input
                        type="time"
                        :data-theme="isDark ? 'dark' : 'light'"
                        v-model="initialHour"
                        @input="
                            (event) =>
                                handleChangeInitialHour(
                                    (event.target! as HTMLInputElement).value,
                                )
                        "
                    />
                </div>

                <div class="formField">
                    <label>Cada aula possui quantos minutos?</label>
                    <select
                        :data-theme="isDark ? 'dark' : 'light'"
                        v-model="intervalBetweenClasses"
                        @input="
                            (event) =>
                                handleChangeIntervalBetweenClasses(
                                    (event.target! as HTMLSelectElement).value,
                                )
                        "
                    >
                        <option value="15min">15 minutos</option>
                        <option value="30min">30 minutos</option>
                        <option value="45min">45 minutos</option>
                        <option value="60min">60 minutos</option>
                        <option value="75min">75 minutos</option>
                        <option value="90min">90 minutos</option>
                        <option value="120min">120 minutos</option>
                    </select>
                </div>
            </div>

            <button
                :class="isRegisterFormValid(false) ? 'btnProceed' : ''"
                type="button"
                @click="handleRegister"
            >
                Registrar
            </button>

            <p class="toggleMode">
                Já tem uma conta?
                <a href="#" @click.prevent="toggleMode">Faça login</a>
            </p>
        </form>
    </div>
</template>
