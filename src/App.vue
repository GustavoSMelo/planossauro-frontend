<script setup lang="ts">
import './styles/app.style.scss';
</script>

<template>
    <div class="containerLP">
        <div class="wrapper">
            <navbar class="navbar">
                <figure class="dinoLogo">
                    <img src="./assets/dino2.svg" alt="Planeja.ai dino logo" />
                </figure>

                <button>
                    <img src="./assets/dino2.svg" alt="imageTheme" />
                </button>
            </navbar>

            <main class="mainContent">
                <div>
                    <h1>Projeta.ai</h1>
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
