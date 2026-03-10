<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core";
import { useRouter } from "vue-router";
import GalleryPhoto from "../components/galleryPhotos/GalleryPhoto.vue";
import { ref } from "vue";

const showPhoto = ref(false);
const selectedPhoto = ref(0);

const isDark = useDark({
    attribute: "data-theme",
    valueLight: "light",
    valueDark: "dark",
});
const toggle = useToggle(isDark);
const router = useRouter();

const handleShowPhoto = (show: boolean) => (showPhoto.value = show);
</script>
<template>
    <nav class="navContainer">
        <figure @click="router.push('/')">
            <img src="../assets/DinoLogo.svg" alt="Dinossaur" />
            <figcaption>Planeja.ai</figcaption>
        </figure>

        <span>
            <button
                v-if="!isDark"
                type="button"
                class="btnIcon"
                @click="toggle(true)"
            >
                <i class="pi pi-sun"></i>
            </button>
            <button v-else type="button" class="btnIcon" @click="toggle(false)">
                <i class="pi pi-moon"></i>
            </button>

            <button
                type="button"
                class="btnLogin"
                @click="router.push('/login')"
            >
                Login
            </button>
        </span>
    </nav>
    <main class="mainContent">
        <GalleryPhoto
            v-if="showPhoto"
            :selected-photo="selectedPhoto"
            :handle-show-photo="handleShowPhoto"
        />
        <div class="mainWrapper">
            <div class="title">
                <span :data-theme="isDark ? 'dark' : 'light'">
                    <h1>Cansado de fazer planejamento na mao ?</h1>
                    <h1>Automatize isso com o Planeja.AI</h1>
                    <h3>Nao acredita? entao se liga no video</h3>
                </span>
            </div>

            <div class="demoVideoContainer">
                <video poster="../assets/video_thumbnail.png" controls>
                    <source src="../assets/demo_plan.mp4" type="video/mp4" />
                </video>
                <small>(Video demonstrativo do software, imagens reais)</small>
            </div>

            <section class="whatIsContainer">
                <h2>O que eh o sistema ?</h2>

                <section>
                    <p>
                        E um sistema de planejamento de aulas com foco para
                        professores/educadores, no qual perdem horas e horas
                        desenvolvendo planejamentos de aula, com o nosso
                        sistema, tudo fica mais simples<br />
                        <br />

                        nosso objetivo eh claro, permitir que voce tenha mais
                        produtividade e liberdade na sua semana, esqueca o tempo
                        perdido no planejamentos de aulas, tudo fica mais facil
                        com o planeja.ai
                    </p>

                    <img
                        src="../assets/dino_playing.gif"
                        alt="impressed dino"
                    />
                </section>
            </section>

            <section class="featuresContainer">
                <h2
                    class="categoryTitle"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    Nossos diferenciais
                </h2>

                <section>
                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>Inteligencia artificial</figcaption>
                        <img src="../assets/ia_dino.png" alt="dino AI" />
                        <p>
                            Utilizamos IA para automatizar e gerar o seu
                            planejamento de acordo com sua necessidade
                        </p>
                    </figure>

                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>Nuvem</figcaption>
                        <img src="../assets/cloud_dino.png" alt="dino nuvem" />
                        <p>
                            Guardamos seu planejamento na nuvem, ter um backup
                            nunca e demais
                        </p>
                    </figure>
                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>Preco</figcaption>
                        <img
                            src="../assets/dino_premium.png"
                            alt="dino preco"
                        />
                        <p>
                            Temos precos super acessiveis desde planos gratuitos
                            ate planos que cabem no seu bolso
                        </p>
                    </figure>
                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>Dinossauros</figcaption>
                        <img
                            src="../assets/profileDino.png"
                            alt="dino feliz pirulito"
                        />
                        <p>
                            Nosso app eh cheio de dinossauros legais que deixa a
                            experiencia mais leve e divertida
                        </p>
                    </figure>

                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>Facilidade</figcaption>
                        <img
                            src="../assets/dininho.png"
                            alt="dino feliz pirulito"
                        />
                        <p>
                            Nosso sistema foi pensado para ser algo facil de
                            usar, descomplicado, porque a vida ja eh muito
                            complicada
                        </p>
                    </figure>

                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>Suporte e atualizacoes</figcaption>
                        <img
                            src="../assets/DinoSupport.png"
                            alt="dino feliz pirulito"
                        />
                        <p>
                            Queremos que nosso sistema seja o mais completo
                            possivel, entre em contato com nosso suporte e de
                            ideias de melhorias
                        </p>
                    </figure>
                </section>
            </section>

            <section class="humansForHumansContainer">
                <h2
                    class="categoryTitle"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    Criado de humanos para humanos
                </h2>

                <div
                    class="humansForHumansContent"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    <img src="../assets/dino_cat.gif" alt="dinocat" />
                    <p>
                        Sistema 100% artesanal que ataca um problema real, nao
                        somos um aplicativo corporativo ou um aplicativo criado
                        por IA, somos completamente humanos (ou melhor
                        dinossauros)
                    </p>
                </div>
            </section>

            <section class="helpContainer">
                <h2>Precisando de ajuda ?</h2>
                <img src="../assets/tablet_green.png" alt="tabletGreen" />

                <p>
                    esta procurando o suporte ou a documentacao ? <br />

                    abaixo temos botoes que vao lhe ajudar
                </p>

                <span class="buttonContainer">
                    <button type="button">
                        <i class="pi pi-book"></i>
                        Documentacao
                    </button>
                    <button type="button">
                        <i class="pi pi-at"></i>
                        Suporte
                    </button>
                </span>
            </section>

            <section class="photosContainer">
                <h2
                    class="categoryTitle"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    Fotos do sistema
                </h2>

                <figure class="photosContent">
                    <span>
                        <img
                            src="../assets/screenshots/screenshot1.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 1;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot2.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 2;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot3.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 3;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot4.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 4;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot5.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 5;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot6.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 6;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot7.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 7;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot8.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 8;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot9.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 9;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot10.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 10;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot11.png"
                            alt="imagem do sistema"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 11;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">Ver mais</button>
                        </div>
                    </span>
                </figure>
            </section>

            <section class="faqContainer">
                <h2
                    class="categoryTitle"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    Perguntas frequentes
                </h2>

                <div class="faqContainer">
                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>Posso usar o sistema gratuitamente ?</summary>
                        <p>
                            Sim, temos um plano gratuito para demonstrar como
                            nosso app funciona, e voce pode utiliza-lo pra
                            sempre, pois todos os tokens sao atualizado
                            mensalmente
                        </p>
                    </details>

                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>Como funciona esses "tokens" ?</summary>
                        <p>
                            Basicamente voce tem limite de planejamentos, esse
                            limite sao chamados de "tokens", quando voce cria um
                            planejamento, voce gasta 1 token, quando chegar no
                            limite de token voce precisa atualizar ou esperar 1
                            mes para ter os tokens de volta
                        </p>
                    </details>

                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>
                            Quais metodos de pagamento sao aceitos ?
                        </summary>
                        <p>
                            Por enquanto apenas cartao de credito (visa e
                            mastercard) e Google Pay, no futuro iremos
                            implementar o Apple pay tambem.
                        </p>
                    </details>

                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>O pagamento eh seguro ?</summary>
                        <p>
                            Sim, nos utilizamos o STRIPE, um sistema de
                            pagamentos utilizado globalmente por diversas
                            empresas gigantescas, como Ford, Uber, Amazon e etc.
                            <br />
                            Por isso quando for fazer um pagamento, uma nova
                            pagina de pagamentos sera aberta, Nos nao guardamos
                            NENHUMA informacao sigilosa que pode comprometer
                            seus dados
                        </p>
                    </details>

                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>O que acontece ao cancelar um plano ?</summary>
                        <p>
                            Seu plano volta a demonstracao gratuita e voce eh
                            reembolsado
                        </p>
                    </details>
                </div>
            </section>
        </div>
    </main>
    <footer>
        <h2>
            Obrigado por chegar ate aqui, app feito com ❤️ by Gustavo S. Melo
        </h2>
    </footer>
</template>
<style lang="scss" src="../styles/learn.style.scss" scoped />
