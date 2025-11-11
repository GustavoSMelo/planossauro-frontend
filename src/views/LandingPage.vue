<script setup lang="ts">
import 'primeicons/primeicons.css';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLoginPage = () => {
    router.push({ path: '/login' });
};

</script>

<template>
    <div class="containerLP">
        <div class="wrapper">
            <nav class="navbar">
                <span></span>

                <button>
                    <i class="pi pi-sun iconThemeSwitcher" />
                </button>
            </nav>

            <main class="mainContent">
                <div>
                    <figure>
                        <img src="../assets/DinoLogo.svg" alt="Dino Logo" />
                        <figcaption> Planeja.ai</figcaption>
                    </figure>
                    <h2>Seu planejador pessoal</h2>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut nobis rem, perspiciatis nesciunt
                        nulla
                        mollitia quam fugit veniam et veritatis asperiores libero corrupti magnam. Molestias tenetur
                        saepe
                        laborum porro eveniet!
                    </p>

                    <button class="btnLogin" type="button" @click="goToLoginPage">Login</button>
                    <button class="btnExamples" type="button">Ver examples</button>
                </div>

                <figure>
                    <img src="../assets/kids.png" alt="kids" />
                </figure>
            </main>
        </div>
        <h4>
            <a href="https://github.com/GustavoSMelo/planeja.ai-frontend" target="_blank">
                Desenvolvido por Gustavo Santos Melo
            </a>
        </h4>
    </div>
</template>

<style lang="scss" scoped src="../styles/landingPage.style.scss" />
