<script lang="ts" setup>
import { inject, onMounted } from "vue";
import type { ILoadingContext } from "../interfaces/context/loading.interface";
import backendApi from "../api/api";
import { useRouter } from "vue-router";

const router = useRouter();
const { handleChangeIsLoading } = inject("isLoading") as ILoadingContext;
const lastLoginType = window.localStorage.getItem("lastLoginType");

const clickFooter = () => {
    window.open(
        "https://github.com/GustavoSMelo/planossauro-frontend",
        "blank",
    );
};

const loginGithubPage = () => {
    localStorage.setItem("lastLoginType", "github");
    window.location.assign(
        `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=read:user,user:email,`,
    );
};

const loadGoogleSignInPage = () => {
    localStorage.setItem("lastLoginType", "google");
    const params = new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirect_uri: `${window.location.origin}/callback/google`,
        response_type: "token",
        scope: "profile email",
    });

    window.location.href = `http://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

onMounted(async () => {
    try {
        const token = sessionStorage.getItem("@auth/token") ?? "";
        const uuid =
            JSON.parse(sessionStorage.getItem("user") || "{uuid: ''}").uuid ??
            "";

        if (!token || !uuid) return;

        handleChangeIsLoading(true);

        const response = await backendApi.get(`/user/${uuid}`);

        if (response.status === 200) {
            handleChangeIsLoading(false);
            router.push("/app");
        }

        handleChangeIsLoading(false);
    } catch {
        handleChangeIsLoading(false);
    }
});
</script>

<template>
    <div class="loginContainer">
        <div class="loginWrapper">
            <h2>{{ $t("login.title") }}</h2>

            <span>
                <label
                    v-if="lastLoginType === 'google'"
                    class="lastLoginGoogle"
                    >{{ $t("login.lastLogin") }}</label
                >
                <button
                    type="button"
                    class="btnSocialMediaLogin btnGoogle firstButton"
                    @click="loadGoogleSignInPage"
                >
                    <i class="pi pi-google"></i>{{ $t("login.btnGoogle") }}
                </button>

                <small>ou</small>

                <label
                    v-if="lastLoginType === 'github'"
                    class="lastLoginGithub"
                    >{{ $t("login.lastLogin") }}</label
                >
                <button
                    type="button"
                    class="btnSocialMediaLogin btnGithub"
                    @click="loginGithubPage()"
                >
                    <i class="pi pi-github"></i>{{ $t("login.btnGithub") }}
                </button>
            </span>
        </div>
        <footer @click="clickFooter()">{{ $t("login.developedBy") }}</footer>
    </div>
</template>

<style lang="scss" scoped src="../styles/loginpage.style.scss" />
