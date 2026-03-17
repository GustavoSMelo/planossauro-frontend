<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import "primeicons/primeicons.css";
import { useRouter } from "vue-router";

const router = useRouter();
const isDark = useDark({
    attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
});

const toggleDark = useToggle(isDark);

const goToLoginPage = () => {
    router.push({ path: "/login" });
};

const goToAboutPage = () => {
    router.push({ path: "/learn" });
};
</script>

<template>
    <div class="containerLP">
        <div class="wrapper">
            <nav class="navbar">
                <span></span>

                <button type="button" @click="toggleDark()">
                    <i v-if="isDark" class="pi pi-sun iconThemeSwitcher" />
                    <i v-else class="pi pi-moon iconThemeSwitcher"></i>
                </button>
            </nav>

            <main class="mainContent">
                <div>
                    <figure>
                        <img src="../assets/DinoLogo.svg" alt="Dino Logo" />
                        <figcaption>Planossauro</figcaption>
                    </figure>
                    <h2>Seu planejador pessoal</h2>
                    <p>
                        Cansado(a) de demorar 1 hora ou mais todos os fins de
                        semana para fazer seu planejamento? Seus problemas estao
                        a 1 click de serem resolvidos, venha fazer seu
                        planejamento em questao de segundos com o Planossauro
                        (inicie gratuitamente sem vinculos)
                    </p>

                    <button
                        class="btnLogin"
                        type="button"
                        @click="goToLoginPage"
                    >
                        Login
                    </button>
                    <button
                        class="btnExamples"
                        type="button"
                        @click="goToAboutPage"
                    >
                        Sobre o projeto
                    </button>
                </div>

                <figure>
                    <img src="../assets/kids.png" alt="kids" />
                </figure>
            </main>
        </div>
        <h4>
            <a
                href="https://github.com/GustavoSMelo/planossauro-frontend"
                target="_blank"
            >
                Desenvolvido por Gustavo Santos Melo
            </a>
        </h4>
    </div>
</template>

<style lang="scss" scoped src="../styles/landingPage.style.scss" />
