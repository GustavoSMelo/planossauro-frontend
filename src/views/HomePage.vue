<script setup lang="ts">
import '../styles/homepage.style.scss';
import Navbar from '../components/navbar/Navbar.vue';
import HomeContent from './contents/HomeContent.vue';
import PlanningContent from './contents/PlanningContent.vue';

const hourTime = new Date().getHours();
</script>
<template>
    <Navbar />
    <main class="homePageContainer">
        <div class="welcomeContainer">
            <h2 v-if="hourTime >= 6 && hourTime <= 12"><span class="goodDay">Bom dia</span><br /> Professor
                Gustavo,<br /> bem-vindo
                de
                volta</h2>
            <h2 v-else-if="hourTime > 12 && hourTime < 19"><span class="goodAfternoon">Boa tarde</span><br /> Professor
                Gustavo,<br />
                bem-vindo de volta</h2>
            <h2 v-else><span class="goodNight">Boa noite</span><br /> Professor Gustavo, bem-vindo de volta</h2>

            <img src="../assets/mushroom.png" alt="DinoWelcome" />
        </div>

        <div class="tabsContentContainer">
            <ul class="tabs">
                <li class="home" id="homeTab"><i class="pi pi-home"></i> Home</li>
                <li class="" id="planTab"><i class="pi pi-book"></i>Planejar</li>
            </ul>

            <div class="tabsContent">
                <PlanningContent />
            </div>
        </div>
    </main>
</template>
<style />
