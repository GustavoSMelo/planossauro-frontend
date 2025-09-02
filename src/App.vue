<script setup lang="ts">
import './styles/app.style.scss';
import 'primeicons/primeicons.css';
</script>

<template>
    <div class="containerLP">
        <div class="wrapper">
            <navbar class="navbar">
                <span></span>

                <button>
                    <i class="pi pi-sun iconThemeSwitcher" />
                </button>
            </navbar>

            <main class="mainContent">
                <div>
                    <figure>
                        <img src="./assets/DinoLogo.svg" alt="Dino Logo" />
                        <figcaption> Projeta.ai</figcaption>
                    </figure>
                    <h2>Seu planejador pessoal</h2>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ut nobis rem, perspiciatis nesciunt
                        nulla
                        mollitia quam fugit veniam et veritatis asperiores libero corrupti magnam. Molestias tenetur
                        saepe
                        laborum porro eveniet!
                    </p>

                    <button class="btnLogin" type="button">Login</button>
                    <button class="btnExamples" type="button">Ver examples</button>
                </div>

                <figure>
                    <img src="./assets/kids.png" alt="kids" />
                </figure>
            </main>
        </div>
    </div>
</template>
