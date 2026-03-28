<style lang="scss" scoped src="../styles/finishregister.style.scss" />

<script lang="ts" setup>
import { inject, ref } from "vue";
import backendApi from "../api/api";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { IPopupContext } from "../interfaces/context/popup.interface";
import type { ILoadingContext } from "../interfaces/context/loading.interface";
import type {
    ICreatedUserResponseAPIOptions,
    ICreateUser,
    ICreateUserResponse,
    IUser,
} from "../interfaces/api/user.interface";
import type { AxiosResponse } from "axios";
import type { ILoginType } from "../interfaces/loginType.interface";
import type { IAccessSanctumToken } from "../interfaces/auth.interface";
import { setToken } from "../helpers/token";
import type { ISubscription } from "../interfaces/subscription.interface";
import { useDark } from "@vueuse/core";

const isDark = useDark({
    attribute: "data-theme",
    valueLight: "light",
    valueDark: "dark",
});
const { t } = useI18n();

const urlParams = new URLSearchParams(window.location.search);
const fullName = ref(window.sessionStorage.getItem("fullName") || "");
const popupContext = inject("popup") as IPopupContext;
const loadingContext = inject("isLoading") as ILoadingContext;
const validationCodeInput = ref("");
const showCodeConfirmationScreen = ref(urlParams.has("jumpToValidationCode"));
const user = ref<IUser>();
const router = useRouter();
const userFromSession: IUser | null = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user") as string)
    : null;
const cellphoneNumber = ref(
    userFromSession?.cellphone_number ? userFromSession.cellphone_number : "",
);

const handleChangeFullName = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    fullName.value = target.value;
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

const isFormCompleted = (): boolean => {
    return fullName.value.length > 3 && cellphoneNumber.value.length === 15
        ? true
        : false;
};

const handleGithubSave = async () => {
    try {
        loadingContext.handleChangeIsLoading(true);
        const githubEmail = sessionStorage.getItem("githubEmail");
        const githubId = sessionStorage.getItem("githubId");

        const userData = {
            full_name: fullName.value,
            cellphone_number: cellphoneNumber.value,
            github_email: githubEmail,
            github_id: githubId,
        } as unknown as ICreateUser;

        let responseUserCreated: AxiosResponse<ICreatedUserResponseAPIOptions>;

        if (userFromSession && userFromSession.uuid) {
            responseUserCreated = await backendApi.put(
                `/user/${userFromSession.uuid}`,
                { ...userFromSession, ...userData },
            );
        } else {
            responseUserCreated = await backendApi.post("/user", {
                ...userData,
            });
        }
        const responseData = (
            userFromSession?.uuid
                ? responseUserCreated.data.user
                : responseUserCreated.data.data
        ) as ICreateUserResponse["data"] | null;

        if (responseData && responseData.uuid) {
            const urlParams = new URLSearchParams(window.location.search);
            const at = urlParams.get("at");
            const sanctumResponse = (await backendApi.get(`/auth/github/${at}`))
                .data as IAccessSanctumToken;

            setToken(sanctumResponse.token.plainTextToken);
            const userHasSubscription = (
                await backendApi.get(`/subscription/${responseData.uuid}`)
            ).data.subscription as ISubscription;

            if (
                !userHasSubscription ||
                userHasSubscription === null ||
                userHasSubscription.uuid === null ||
                !userHasSubscription.uuid
            )
                await backendApi.post(
                    `/subscription/assign/free/${responseData.uuid}`,
                );

            user.value = { ...responseData };
            user.value.github_is_validated = false;
            showCodeConfirmationScreen.value = true;
            sessionStorage.setItem("user", JSON.stringify(user.value));
            popupContext.handleChangePopupInfo(
                t("finishRegister.registrationSuccess"),
                "success",
                true,
            );
        }
        loadingContext.handleChangeIsLoading(false);
    } catch {
        popupContext.handleChangePopupInfo(
            t("finishRegister.emailSendError"),
            "error",
            true,
        );
        loadingContext.handleChangeIsLoading(false);
    }
};

const handleGoogleSave = async () => {
    try {
        loadingContext.handleChangeIsLoading(true);
        const googleEmail = sessionStorage.getItem("googleEmail");
        const googleId = sessionStorage.getItem("googleId") || "";

        const userData = {
            full_name: fullName.value,
            cellphone_number: cellphoneNumber.value,
            google_email: googleEmail,
            google_id: googleId.toString(),
        } as unknown as ICreateUser;

        let responseUserCreated: AxiosResponse<ICreatedUserResponseAPIOptions>;

        if (userFromSession && userFromSession.uuid) {
            userData.google_email = sessionStorage.getItem("googleEmail");
            userData.google_id = sessionStorage.getItem("googleId") ?? "";
            responseUserCreated = await backendApi.put(
                `/user/${userFromSession.uuid}`,
                { ...userFromSession, ...userData },
            );
            sessionStorage.setItem(
                "user",
                JSON.stringify({
                    ...userFromSession,
                    google_email: sessionStorage.getItem("googleEmail") ?? "",
                }),
            );
        } else {
            responseUserCreated = await backendApi.post("/user", {
                ...userData,
            });
        }
        const helper = responseUserCreated.data;
        const responseData = (
            Object.prototype.hasOwnProperty.call(helper, "user")
                ? helper.user
                : helper.data
        ) as ICreateUserResponse["data"] | null;

        if (responseData && responseData.uuid) {
            user.value = { ...responseData };
            user.value.google_is_validated = false;
            showCodeConfirmationScreen.value = true;
            const urlParams = new URLSearchParams(window.location.search);
            const at = urlParams.get("at");

            const sanctumResponse = (await backendApi.get(`/auth/google/${at}`))
                .data as IAccessSanctumToken;
            setToken(sanctumResponse.token.plainTextToken);
            await backendApi.post(
                `/subscription/assign/free/${responseData.uuid}`,
            );

            sessionStorage.setItem("user", JSON.stringify(user.value));
            popupContext.handleChangePopupInfo(
                t("finishRegister.registrationSuccess"),
                "success",
                true,
            );
            loadingContext.handleChangeIsLoading(false);
        }
        loadingContext.handleChangeIsLoading(false);
    } catch (err) {
        const errHelper = err as { response?: { status: number } };
        loadingContext.handleChangeIsLoading(false);

        if (errHelper.response?.status === 401) return;
        popupContext.handleChangePopupInfo(
            t("finishRegister.emailSendError"),
            "error",
            true,
        );
    }
};

const handleProceed = async (): Promise<void> => {
    if (!isFormCompleted()) return;

    const loginType = sessionStorage.getItem("loginType");

    if (!loginType || (loginType !== "github" && loginType !== "google")) {
        popupContext.handleChangePopupInfo(
            t("finishRegister.unauthorizedLoginType"),
            "error",
            true,
        );
        return;
    }

    if (loginType === "github") return await handleGithubSave();
    if (loginType === "google") return await handleGoogleSave();
};

const handleChangeValidationCodeInput = (event: Event): void => {
    let { value } = event.target as HTMLInputElement;
    value = value.replace(/[a-zA-Z!@#$%^&*_+=()-]/g, "").trim();

    if (value.length > 5) value = value.slice(0, 5);
    validationCodeInput.value = value;
};

const resendEmail = async () => {
    try {
        loadingContext.handleChangeIsLoading(true);

        const loginType = sessionStorage.getItem("loginType");
        await backendApi.post("/user/resend/validationcode", {
            uuid: user.value?.uuid,
            loginType,
        });

        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo(
            t("finishRegister.emailResendSuccess"),
            "success",
            true,
        );
    } catch {
        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo(
            t("finishRegister.emailResendError"),
            "error",
            true,
        );
    }
};

const finishValidation = async () => {
    try {
        if (!validationCodeInput.value.length) return;

        const loginType = sessionStorage.getItem(
            "loginType",
        ) as ILoginType["types"];
        const isValidatedResponse = await backendApi.patch(
            `/user/validate/${user.value?.uuid}`,
            {
                loginType,
                validationCode: validationCodeInput.value,
            },
        );

        if (isValidatedResponse.status !== 200) {
            popupContext.handleChangePopupInfo(
                t("finishRegister.invalidValidationCode"),
                "error",
                true,
            );
            return;
        }
        loadingContext.handleChangeIsLoading(true);

        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo(
            t("finishRegister.validationSuccess"),
            "success",
            true,
        );

        if (loginType === "github") user.value!.github_is_validated = true;
        else user.value!.google_is_validated = true;

        sessionStorage.setItem("user", JSON.stringify(user.value));
        router.push("/app");
    } catch {
        loadingContext.handleChangeIsLoading(false);
        popupContext.handleChangePopupInfo(
            t("finishRegister.validationError"),
            "error",
            true,
        );
    }
};
</script>

<template>
    <div class="finishRegisterContainer">
        <form
            class="formContainer"
            v-if="!showCodeConfirmationScreen && !user?.github_is_validated"
        >
            <h2>{{ t("finishRegister.completeRegistration") }}</h2>

            <label>{{ t("finishRegister.fullName") }}</label>
            <input
                type="text"
                :data-theme="isDark ? 'dark' : 'light'"
                :placeholder="t('finishRegister.fullNamePlaceholder')"
                v-model="fullName"
                @change="(event) => handleChangeFullName(event)"
            />

            <label>{{ t("finishRegister.cellphone") }}</label>
            <input
                type="text"
                :data-theme="isDark ? 'dark' : 'light'"
                :placeholder="t('finishRegister.cellphonePlaceholder')"
                v-model="cellphoneNumber"
                @input="handleChangeCellphoneNumber"
            />

            <button
                :class="isFormCompleted() ? 'btnProceedRegister' : ''"
                type="button"
                @click="handleProceed"
            >
                {{ t("finishRegister.advance") }}
            </button>
        </form>

        <div class="validationContainer" v-else>
            <h2>{{ t("finishRegister.accountValidation") }}</h2>
            <form class="validationForm">
                <label>{{ t("finishRegister.insertValidationCode") }}</label>
                <input
                    type="text"
                    :data-theme="isDark ? 'dark' : 'light'"
                    :placeholder="t('finishRegister.validationCodePlaceholder')"
                    @input="handleChangeValidationCodeInput"
                    v-model="validationCodeInput"
                />
                <small>{{ t("finishRegister.spamCheckHint") }}</small>
            </form>

            <div class="buttonsContainer">
                <button
                    :data-theme="isDark ? 'dark' : 'light'"
                    type="button"
                    @click="() => router.push('/app')"
                >
                    {{ t("finishRegister.validateLater") }}
                </button>
                <span>
                    <button
                        type="button"
                        @click="resendEmail"
                        :data-theme="isDark ? 'dark' : 'light'"
                    >
                        {{ t("finishRegister.resendEmail") }}
                    </button>
                    <button
                        :data-theme="isDark ? 'dark' : 'light'"
                        @click="finishValidation"
                        :class="
                            validationCodeInput.length === 5 ? 'btnFinish' : ''
                        "
                        type="button"
                    >
                        {{ t("finishRegister.finish") }}
                    </button>
                </span>
            </div>
        </div>
    </div>
</template>
