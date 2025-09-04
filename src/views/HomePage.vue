<script setup lang="ts">
import '../styles/homepage.style.scss';
import Navbar from '../components/Navbar/Navbar.vue';
import { ref } from 'vue';
import Footer from '../components/Footer/Footer.vue';

const activities = ref(['testando'] as Array<string>);
const hours = new Date().getHours();

const addNewActivity = (): void => {
    activities.value = [...activities.value, '']
};
</script>
<template>
    <Navbar />
    <main class="homePageContainer">
        <div class="welcomeContainer">
            <figure>
                <img src="../assets//Screenshot_From_2025-09-03_12-57-19-removebg-preview.png" />
            </figure>
            <h2 class="homeTitle titleDay" v-if="hours > 6 && hours < 12">
                <b> <i class="pi pi-sun"></i>Bom dia,</b> <br /> seja bem vindo de<br /> volta prof Gustavo
            </h2>
            <h2 class="homeTitle titleAfternoon" v-else-if="hours >= 12 && hours <= 18">
                <b><i class="pi pi-sun"></i> Boa tarde,</b> <br />seja bem vindo de<br /> volta prof Gustavo
            </h2>
            <h2 class="homeTitle titleNight" v-else>
                <b><i class="pi pi-moon"></i>Boa noite,</b> <br />seja bem vindo de<br /> volta prof Gustavo
            </h2>
        </div>

        <section class="contentContainer">
            <div class="planGenerator">
                <h2>Gerar planejamento</h2>

                <span v-for="activity in activities">
                    <small>Atividade 01: </small>
                    <input :value="activity" type="text" placeholder="Insira a descricao da aula/atividade" />
                </span>

                <button class="btnAddNewActivity" type="button" @click="addNewActivity"><i class="pi pi-plus-circle"></i></button>
                <button class="generatePlan" type="button">Gerar planejamento</button>
            </div>

            <aside class="commandButtons">
                <figure>
                    <img class="commandButontsImg" src="../assets/profileDino.png" alt="Profile dino" />
                    <figcaption>Perfil</figcaption>
                </figure>
                <figure>
                    <img src="../assets/DinoConsultaPlanejamentos.png" alt="Profile plans" />
                    <figcaption> Visualizar planejamentos</figcaption>
                </figure>
                <figure>
                    <img src="../assets/DinoPlans.png" alt="Profile account plan" />
                    <figcaption> Planos</figcaption>
                </figure>
            </aside>
        </section>
    </main>
    <Footer />
</template>
