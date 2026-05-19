<script lang="ts" setup>
import { inject, ref, onMounted } from "vue";
import type { IUser } from "../../interfaces/api/user.interface";
import convertIsoDateToBR from "../../helpers/dateIsoConvertToBR";
import type { ILoadingContext } from "../../interfaces/context/loading.interface";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import backendApi from "../../api/api";
import { useRouter } from "vue-router";
import type { ILoginType } from "../../interfaces/loginType.interface";
import type { IPageContent } from "../../interfaces/pageContents.interface";
import { useI18n } from "vue-i18n";
import { useDark, useToggle } from "@vueuse/core";

const { handleChangeCurrentContent, handleChangeValidationLoginType } =
    defineProps<{
        handleChangeCurrentContent: (
            newValue: IPageContent["contents"],
        ) => void;
        handleChangeValidationLoginType: (
            newValue: ILoginType["types"],
        ) => void;
    }>();

const isDark = useDark();
const toggle = useToggle(isDark);
const user = ref<IUser>({} as IUser);
const duplicateUser = ref<IUser>({} as IUser);
const editProfile = ref(false);
const deleteAccountPopup = ref(false);
const unlinkAccountPopup = ref(false);
const unlinkAccountChoose = ref<"" | "google" | "github">("");
const router = useRouter();
const { handleChangeIsLoading } = inject("isLoading") as ILoadingContext;
const { handleChangePopupInfo } = inject("popup") as IPopupContext;
const userFromSession = JSON.parse(sessionStorage.getItem("user") as string);
const userUuid = userFromSession?.uuid ?? "";
const { t, locale } = useI18n();

onMounted(async () => {
    try {
        handleChangeIsLoading(true);
        const userResponse = await backendApi.get(`/user/${userUuid}`);
        user.value = userResponse.data;
        duplicateUser.value = { ...userResponse.data };

        const minimalUserData = {
            google_email: userResponse.data.google_email,
            github_email: userResponse.data.github_email,
            uuid: userResponse.data.uuid,
            created_at: userResponse.data.created_at,
        };
        sessionStorage.setItem("user", JSON.stringify(minimalUserData));
        handleChangeIsLoading(false);
    } catch {
        handleChangePopupInfo(t("profile.errorLoadingUser"), "error", true);
        handleChangeIsLoading(false);
    }
});

const handleChangeCellphone = (event: Event): void => {
    let { value } = event.target as HTMLInputElement;
    value = value.replace(/[a-zA-Z!@#$%^&*_+=]/g, "").trim();

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
            handleChangePopupInfo(
                t("profile.invalidUsername"),
                "warning",
                true,
            );
            return;
        }

        if (
            user.value.cellphone_number.length < 15 ||
            !user.value.cellphone_number.includes("(") ||
            !user.value.cellphone_number.includes(")") ||
            !user.value.cellphone_number.includes("-")
        ) {
            handleChangePopupInfo(
                t("profile.invalidCellphone"),
                "warning",
                true,
            );
            return;
        }

        handleChangeIsLoading(true);

        await backendApi.put(`/user/${user.value.uuid}`, { ...user.value });

        duplicateUser.value = { ...user.value };
        sessionStorage.setItem("user", JSON.stringify(user.value));
        editProfile.value = false;

        handleChangeIsLoading(false);
        handleChangePopupInfo(t("profile.userEditSuccess"), "success", true);
    } catch {
        handleChangePopupInfo(t("profile.userEditError"), "error", true);
        handleChangeIsLoading(false);
    }
};

// const handleChangeGithubAccount = async () => {
//     const user = JSON.parse(sessionStorage.getItem("user") as string) as IUser;

//     if (!user.google_email || !user.google_email.length) {
//         handleChangePopupInfo(t("profile.connectGoogle"), "warning", true);
//         return;
//     }

//     const logoutPage = window.open(
//         "https://github.com/logout",
//         "githubLogout",
//         "width=600,height=700",
//     );

//     sessionStorage.setItem("editProfile", "true");
//     const timer = setInterval(() => {
//         if (logoutPage?.closed) {
//             clearInterval(timer);
//             window.location.assign(
//                 `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=read:user,user:email&allow_signup=true`,
//             );
//         }
//     }, 300);
// };

const handleConnectGithubAccout = async () => {
    window.location.assign(
        `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=read:user,user:email,`,
    );
};

const handleConnectGoogleAccount = () => {
    const params = new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirect_uri: `${window.location.origin}/callback/google`,
        response_type: "token",
        scope: "profile email",
    });

    window.location.href = `http://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

const handleDeleteAccount = async () => {
    try {
        const uuid =
            JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid ?? "";
        const response = await backendApi.delete(`/user/${uuid}`);

        if (response.status === 200) {
            return router.push("/callback/user/delete");
        }

        handleChangePopupInfo(t("profile.validateYourEmail"), "error", true);
    } catch {
        handleChangePopupInfo(t("profile.validateYourEmail"), "error", true);
    }
};

const logout = async () => {
    const uuid = JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid ?? "";
    await backendApi.delete(`/logout/${uuid}`);
    sessionStorage.clear();
    handleChangePopupInfo(t("profile.logoutMessage"), "info", true);
    router.push("/");
};

const handleSendValidationEmail = async (loginType: ILoginType["types"]) => {
    if (
        loginType === "github" &&
        user.value.github_is_validated.toString() === "true"
    )
        return;
    if (
        loginType === "google" &&
        user.value.google_is_validated.toString() == "true"
    )
        return;

    try {
        handleChangeIsLoading(true);

        const userResponse: IUser = (
            await backendApi.get(`/user/${user.value.uuid}`)
        ).data;

        if (
            (loginType === "google" &&
                userResponse.google_is_validated == true) ||
            (loginType === "google" && !userResponse.google_email?.length)
        ) {
            handleChangeIsLoading(false);
            handleChangePopupInfo(t("profile.connectGoogle"), "info", true);
            return;
        }

        if (loginType === "github" && !userResponse.github_email?.length) {
            handleChangeIsLoading(false);
            handleChangePopupInfo(t("profile.connectGithub"), "info", true);
            return;
        }

        await backendApi.post("/user/resend/validationcode", {
            uuid: user.value.uuid,
            loginType,
        });

        handleChangeValidationLoginType(loginType);
        handleChangePopupInfo(t("profile.codeEmailSended"), "success", true);
        handleChangeIsLoading(false);
        handleChangeCurrentContent("validation_code");
    } catch {
        handleChangePopupInfo(t("profile.errorCodeSended"), "error", true);
        handleChangeIsLoading(false);
    }
};

const handleUnlinkAccount = async () => {
    try {
        handleChangeIsLoading(true);
        const uuid =
            JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid ?? "";
        await backendApi.patch(`/user/unlink/${uuid}`, {
            unlink: unlinkAccountChoose.value,
        });
        handleChangeIsLoading(false);
        handleChangePopupInfo(
            t("profile.unlinkedAccountWithSuccess"),
            "info",
            true,
        );
        sessionStorage.clear();
        router.push("/");
    } catch {
        handleChangeIsLoading(false);
        handleChangePopupInfo(t("profile.errorToUnlinkAccount"), "error", true);
    }
};
</script>
<template>
    <div
        class="unlinkAccountContainer"
        v-if="unlinkAccountPopup"
        @click="unlinkAccountPopup = false"
    >
        <div
            class="unlinkAccountContent"
            @click="(event) => event.stopPropagation()"
        >
            <h2>{{ t("profile.unlinkTitle") }} {{ unlinkAccountChoose }} ?</h2>

            <p>{{ t("profile.unlinkSubDescription1") }}</p>
            <small>{{ t("profile.unlinkSubDescription2") }}</small>

            <span class="buttonsContainer">
                <button type="button" @click="unlinkAccountPopup = false">
                    {{ t("profile.back") }}
                </button>
                <button type="button" @click="handleUnlinkAccount()">
                    {{ t("profile.deleteAccountTitle") }}
                </button>
            </span>
        </div>
    </div>
    <div
        class="deletePopupContainer"
        v-if="deleteAccountPopup"
        @click="deleteAccountPopup = false"
    >
        <div
            class="deletePopupContent"
            @click="(event) => event.stopPropagation()"
        >
            <h2>{{ t("profile.deleteAccountTitle") }}</h2>
            <p>
                {{ t("profile.deleteAccountDescription") }}
            </p>
            <span class="buttonsContainer">
                <button type="button" @click="deleteAccountPopup = false">
                    {{ t("profile.back") }}
                </button>
                <button type="button" @click="handleDeleteAccount()">
                    {{ t("profile.delete") }}
                </button>
            </span>
        </div>
    </div>
    <div class="profileContainer">
        <div class="profileDetails" :data-theme="isDark ? 'dark' : 'light'">
            <img
                src="../../assets/dino_profile_logo.png"
                alt="Dino user profile logo"
            />
            <h3 id="fullNameInputText" v-if="!editProfile">
                {{ user?.full_name }}
            </h3>
            <input
                v-if="editProfile"
                type="text"
                :value="user.full_name"
                @input="handleChangeFullName"
                :placeholder="`${t('profile.namePlaceholder')}`"
                :data-theme="isDark ? 'dark' : 'light'"
                class="fullNameInput"
            />

            <span id="githubEmailInserted">
                <b><i class="pi pi-github"></i> Github:</b>
                <input
                    v-if="user?.github_email?.length && !editProfile"
                    :disabled="true"
                    type="text"
                    :value="user.github_email"
                    :placeholder="`${t('profile.email')}`"
                    :data-theme="isDark ? 'dark' : 'light'"
                />
                <div
                    class="containerBtnChangeSocialMedia"
                    v-else-if="user?.github_email?.length && editProfile"
                >
                    <input
                        :disabled="true"
                        type="text"
                        :value="
                            user.github_email.length
                                ? user.github_email
                                : 'Empty'
                        "
                        :placeholder="`${t('profile.email')}`"
                        :data-theme="isDark ? 'dark' : 'light'"
                        :class="editProfile ? 'unableToEdit' : ''"
                    />
                    <button
                        type="button"
                        @click="
                            unlinkAccountChoose = 'github';
                            unlinkAccountPopup = true;
                        "
                    >
                        <i class="pi pi-lock-open"></i>
                    </button>
                </div>

                <button v-else type="button" @click="handleConnectGithubAccout">
                    {{ t("profile.connect") }}
                </button>
            </span>
            <span id="googleEmailInserted">
                <b><i class="pi pi-google"></i> Google:</b>
                <input
                    id="googleEmailInserted"
                    v-if="user?.google_email?.length && !editProfile"
                    :disabled="true"
                    type="text"
                    :value="user.google_email"
                    :placeholder="`${t('profile.emailPlaceholder')}`"
                    :class="editProfile ? 'ableToEdit' : ''"
                    :data-theme="isDark ? 'dark' : 'light'"
                />

                <div
                    class="containerBtnChangeSocialMedia"
                    v-else-if="user?.google_email?.length && editProfile"
                >
                    <input
                        :disabled="true"
                        type="text"
                        :value="
                            user.google_email.length
                                ? user.google_email
                                : 'Empty'
                        "
                        :placeholder="`${t('profile.emailPlaceholder')}`"
                        :class="editProfile ? 'unableToEdit' : ''"
                        :data-theme="isDark ? 'dark' : 'light'"
                    />
                    <button
                        type="button"
                        @click="
                            unlinkAccountChoose = 'google';
                            unlinkAccountPopup = true;
                        "
                    >
                        <i class="pi pi-lock-open"></i>
                    </button>
                </div>

                <button
                    v-else
                    type="button"
                    @click="handleConnectGoogleAccount"
                >
                    {{ t("profile.connect") }}
                </button>
            </span>
            <span id="cellphoneInserted">
                <b><i class="pi pi-phone"></i> {{ t("profile.cellphone") }}:</b>
                <input
                    :disabled="editProfile ? false : true"
                    type="text"
                    v-model="user.cellphone_number"
                    :placeholder="`${t('profile.cellphonePlaceholder')}`"
                    :class="editProfile ? 'ableToEdit' : ''"
                    @input="handleChangeCellphone"
                    :data-theme="isDark ? 'dark' : 'light'"
                />
            </span>
            <button
                id="updateInformations"
                v-if="!editProfile"
                class="btnChangeProfile"
                type="button"
                @click="editProfile = true"
            >
                {{ t("profile.enableEdit") }}
            </button>

            <button
                v-if="editProfile"
                class="btnChangeProfile btnChangeProfileAction"
                type="button"
                @click="handleEditProfile"
            >
                {{ t("profile.editProfile") }}
            </button>
            <button
                :data-theme="isDark ? 'dark' : 'light'"
                v-if="editProfile"
                class="btnChangeProfile btnCancel"
                type="button"
                @click="handleCancelAndResetInfo"
            >
                {{ t("profile.cancel") }}
            </button>
            <div class="profileAdditionalDetails">
                <p>
                    <b
                        ><i class="pi pi-github"></i> Github
                        {{ t("profile.validated") }}:</b
                    >
                    <button
                        id="validateEmail"
                        @click="handleSendValidationEmail('github')"
                        type="button"
                        :class="
                            user?.github_is_validated == true
                                ? 'checked'
                                : 'unchecked'
                        "
                    >
                        <i
                            :class="[
                                'pi',
                                user.github_is_validated == true
                                    ? 'pi-verified'
                                    : 'pi-unlock',
                            ]"
                        ></i
                        >{{
                            user?.github_is_validated == true
                                ? `${t("profile.validated")}`
                                : `${t("profile.validate")}`
                        }}
                    </button>
                </p>
                <p>
                    <b
                        ><i class="pi pi-google"></i> Google
                        {{ t("profile.validated") }}:</b
                    >
                    <button
                        @click="handleSendValidationEmail('google')"
                        type="button"
                        :class="
                            user?.google_is_validated == true
                                ? 'checked'
                                : 'unchecked'
                        "
                    >
                        <i
                            :class="[
                                'pi',
                                user.google_is_validated == true
                                    ? 'pi-verified'
                                    : 'pi-unlock',
                            ]"
                        ></i
                        >{{
                            user?.google_is_validated == true
                                ? `${t("profile.validated")}`
                                : `${t("profile.validate")}`
                        }}
                    </button>
                </p>
                <!-- <p>
                    <b
                        ><i class="pi pi-phone"></i> SMS
                        {{ t("profile.validated") }}:
                    </b>
                    <button type="button" class="unchecked">
                        <i
                            :class="[
                                'pi',
                                user.sms_is_validated == true
                                    ? 'pi-verified'
                                    : 'pi-unlock',
                            ]"
                        ></i>
                        {{ t("profile.validate") }}
                    </button>
                </p> -->
                <p class="createdAtText">
                    {{ t("profile.userSince") }}:
                    {{ convertIsoDateToBR((user?.created_at as string) ?? "") }}
                </p>
                <button type="button" @click="deleteAccountPopup = true">
                    <i class="pi pi-trash"></i>
                    {{ t("profile.deleteAccount") }}
                </button>
            </div>
        </div>
        <div class="appSettings">
            <details open>
                <summary>{{ t("profile.appSettings") }}</summary>
                <div id="languageSettings">
                    <h3>
                        <i class="pi pi-language"></i>
                        {{ t("profile.language") }}:
                    </h3>

                    <select v-model="locale">
                        <option value="pt-BR">🇧🇷 Portugues (Brasil)</option>
                        <option value="en-US">🇺🇸 English (USA)</option>
                    </select>
                </div>

                <div id="themeSettings">
                    <h3>
                        <i class="pi pi-palette"></i> {{ t("profile.theme") }}:
                    </h3>

                    <select
                        v-model="isDark"
                        @change="
                            (event) => {
                                const target = event.target as HTMLInputElement;
                                target.value == 'true'
                                    ? toggle(true)
                                    : toggle(false);
                            }
                        "
                    >
                        <option value="false">
                            ☀️ {{ t("profile.lightTheme") }}
                        </option>
                        <option value="true">
                            🌑 {{ t("profile.darkTheme") }}
                        </option>
                    </select>
                </div>

                <!-- <div id="documentationView">
                    <h3>
                        <i class="pi pi-book"></i>
                        {{ t("profile.documentation") }}
                    </h3>

                    <button type="button" @click="router.push('/docs')">
                        {{ t("profile.viewDocs") }}
                    </button>
                </div> -->

                <div id="helpView">
                    <h3>
                        <i class="pi pi-headphones"></i>
                        {{ t("profile.help") }}:
                    </h3>

                    <button @click="handleChangeCurrentContent('support')">
                        {{ t("profile.viewHelp") }}
                    </button>
                </div>

                <div id="logoutView">
                    <h3>
                        <i class="pi pi-sign-out"></i>
                        {{ t("profile.logout") }}:
                    </h3>

                    <button type="button" @click="logout">
                        {{ t("profile.disconnect") }}
                    </button>
                </div>
                <div>
                    <h3>{{ t("profile.appVersion") }}:</h3>

                    <p>Version 1.0.0</p>
                </div>
                <div>
                    <h3>{{ t("profile.bibleVersicle") }}</h3>
                </div>
            </details>
        </div>
    </div>
</template>

<style
    lang="scss"
    scoped
    src="../../styles/contents/profilecontent.style.scss"
/>
