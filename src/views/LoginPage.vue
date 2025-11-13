<script lang="ts" setup>

const clickFooter = () => {
    window.open('https://github.com/GustavoSMelo/planeja.ai-frontend', 'blank');
};

const loginGithubPage = () => {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=read:user,user:email,`);
};

</script>

<template>
    <div class="loginContainer">
        <div class="loginWrapper">
            <h2>Conecte suas contas para continuar: </h2>

            <button type="button" class="btnSocialMediaLogin btnGoogle firstButton">
                <i class="pi pi-google"></i>Continuar com o Google
            </button>

            <small>ou</small>

            <button type="button" class="btnSocialMediaLogin btnGithub" @click="loginGithubPage()">
                <i class="pi pi-github"></i>Continuar com o Github
            </button>
        </div>
        <h1 @click="clickFooter()">Desenvolvido por Gustavo S. Melo</h1>
    </div>
</template>

<style lang="scss" scoped src="../styles/loginpage.style.scss" />
