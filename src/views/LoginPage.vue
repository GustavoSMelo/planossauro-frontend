<script lang="ts" setup>
const clickFooter = () => {
    window.open('https://github.com/GustavoSMelo/planeja.ai-frontend', 'blank');
};

const loginGithubPage = () => {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=read:user,user:email,`);
};

const loadGoogleSignInPage = () => {

    const params = new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirect_uri: `${window.location.origin}/callback/google`,
        response_type: "token",
        scope: "profile email"
    });

    window.location.href = `http://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

</script>

<template>
    <div class="loginContainer">
        <div class="loginWrapper">
            <h2>Conecte suas contas para continuar: </h2>

            <button type="button" class="btnSocialMediaLogin btnGoogle firstButton" @click="loadGoogleSignInPage">
                <i class="pi pi-google"></i>Continuar com o Google
            </button>

            <small>ou</small>

            <button type="button" class="btnSocialMediaLogin btnGithub" @click="loginGithubPage()">
                <i class="pi pi-github"></i>Continuar com o Github
            </button>
        </div>
        <footer @click="clickFooter()">Desenvolvido por Gustavo S. Melo</footer>
    </div>
</template>

<style lang="scss" scoped src="../styles/loginpage.style.scss" />
