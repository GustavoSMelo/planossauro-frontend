<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core";
import { onMounted } from "vue";

const isDark = useDark({
    attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
});

const toggle = useToggle(isDark);

onMounted(() => {
    const demoVideo = window.document.querySelector(
        ".dinoDemoPlan",
    ) as HTMLVideoElement;
    if (demoVideo) demoVideo.defaultPlaybackRate = 2;
});
</script>
<template>
    <nav class="navbarContainer">
        <span>
            <img src="../assets/DinoLogo.svg" alt="planeja.ai logo" />
            <h3>Planeja.ai</h3>
        </span>

        <button type="button" @click="toggle()">
            <i v-if="!isDark" class="pi pi-sun"></i>
            <i v-else class="pi pi-moon"></i>
        </button>
    </nav>
    <main class="aboutContainer">
        <aside class="asideHelper" :data-theme="isDark ? 'dark' : 'light'">
            <ul>
                <li><span>#</span> Introducao</li>
                <li><span>#</span> Demonstracao</li>
                <li><span>#</span> Como funciona ?</li>
                <li><span>#</span> Tour pelo sistema</li>
                <li><span>#</span> Planos e assinatura</li>
                <li><span>#</span> Suporte</li>
            </ul>
        </aside>
        <div class="aboutContent" :data-theme="isDark ? 'dark' : 'light'">
            <span class="softwareTitle">
                <img src="../assets/DinoLogo.svg" alt="planeja.ai logo" />
                <h2>Planeja.ai</h2>
            </span>

            <section id="intro">
                <h3># Introdução</h3>
                <p>
                    Nosso sistema e um planejador de aulas para educadores
                    focados em educacao infantil, mas visamos cobrir ensino
                    medio e superior tambem. <br />
                    O <italic>Software</italic> foi criado com objetivo de
                    diminuir/eliminar a dificuldade ao realizar um planejamento
                    de aula, no qual o mesmo pode demorar mais que
                    <b>1 hora</b> para ficar pronto. <br />
                    Essa era uma dificuldade <b>real</b> que eu passava toda
                    semana, noqual eu precisava parar o meu domingo a noite para
                    fazer uma tarefa chata, repetitiva, burocratica e nada
                    produtiva
                </p>

                <p>
                    Ao decorrer do desenvolvimento desse sistema que era apenas
                    algo pessoal e de escopo pequeno (era um sistema de apenas 2
                    semanas), quando eu finalizei o MVP dessa aplicacao, percebi
                    que era uma verdadeira <b>solucao</b>, no qual demorava
                    cerca de 1 hora para fazer o planejamento, com o planeja.ai
                    eu tinha um plano em questao de 3 ~ 5 minutos, entao acabei
                    pensando comigo mesmo
                    <italic>
                        "Por que nao fazer um sistema para professores num geral
                        ?", "Por que nao disponbilizar essa solucao pra todo
                        mundo ?"
                    </italic>
                </p>

                <p>
                    Com isso nasceu o sistema que voce esta sendo apresentado
                    agora
                </p>

                <figure class="dinoCookieContainer">
                    <img src="../assets/cookie_pink.png" alt="cookie" />
                </figure>
            </section>
            <section id="demo">
                <h3># Demonstracao</h3>

                <p>
                    Beleza, voce ja entendeu o projeto, mas se liga o quao facil
                    eh fazer um planejamento (eu fiz esse planejamento basico em
                    50 segundos)
                </p>
                <video class="dinoDemoPlan" controls speed="2">
                    <source src="../assets/demo_plan.mp4" type="video/mp4" />
                </video>
            </section>

            <section id="howWorks">
                <figure class="dinoTabletWorks">
                    <img src="../assets/tablet_green.png" alt="planejamento" />
                </figure>
                <h3># Como funciona ?</h3>
                <p>
                    Voce deve estar se perguntando
                    <italic>
                        "Ok, isso eh bem legal, mas como isso funciona por baixo
                        dos panos ?"
                    </italic>
                    Basicamente IA (Inteligencia Artificial), voce insere as
                    atividades/aula que vai dar na semana, e com isso ele gera o
                    planejamento usando como base de analise as suas atividades
                    e no QSN (Quadro de Saberes Necessários), por conta disso eh
                    <b>importantissimo voce checkar</b> se a IA gerou um
                    planejamento, isso porque ela pode errar em alguma coisa
                </p>
            </section>

            <section id="tour">
                <h3># Um tour pelo sistema</h3>

                <p>Abaixo tera um video mostrando um pouco do sistema</p>
                <video class="tour">
                    <source src="../assets/tour.mp4" type="video/mp4" />
                </video>

                <p>
                    Nosso sistema eh bem simples, ele possui login/cadastro
                    atraves de redes sociais como Google (gmail) e Github. Isso
                    foi planejado para voce nao precisar criar conta em mais um
                    sistema que voce nao ira lembrar a senha,                     Alem disso, o sistema eh enxuto possuindo apenas algumas
                    paginas:
                </p>
                <p>
                    <ul class="pageList">
                        <li><b>Home page:</b> Pagina para voce ver a quantidade de planejamentos voce consegue gerar </li>
                        <li><b>Planejar:</b> Pagina onde voce conseguira realizar os planejamentos</li>
                        <li><b>Planejamentos:</b> Pagina para voce visualizar/baixar os planejamentos gerados</li>
                        <li><b>Planos:</b> Pagina focado em gerenciar o seu plano e ver o historico de pagamentos</li>
                        <li><b>Perfil:</b> Aqui eh alto explicativo, pagina para visualizar/gerencia seu perfil e configuracoes do aplicativo</li>
                    </ul>
                </p>
            </section>

            <section id="plans">
                <figure class="dinoHappyYellow">
                    <img src="../assets/happy_yellow.png" alt="yellow dino" />
                </figure>
                <h3># Sobre planos e assinatura</h3>
                <h4>## Planos</h4>
                <p class="aboutPlans">
                    Falando sobre os planos, atualmente temos 3 planos, o gratuito,
                    focado em demonstrar nossa plataforma
                    <b>Voce nao precisa de cartao de credito para testar nosso app</b>,
                    temos o plano essential, onde voce podera realizar 10 planos diarios e semanais;
                    e por ultimo o plano premium, onde tera 90 planejamentos diarios e semanais
                </p>

                <h4>## Assinatura</h4>
                <p class="aboutPlans">Sobre assinatura, o preco do plano essential eh 20 Reais (atualmente) e 55 Reais o premium (atualmente), para realizar o pagamento, estamos usando o <b>STRIPE</b>, um sistema usado globalmente, no qual nos nao seguramos seus dados sensiveis, apenas dados publicos do cartao de credito, e o pagamento fica por parte do stripe, caso tenha alguma duvida, na pagina do perfil consegue entrar em contato com nosso suporte</p>
            </section>
            <section id="support">
                <h3># Suporte</h3>
                <p>
                    O Suporte do app pode ser acessado dentro da pagina de perfil do app, voce enviara um email e teremos um prazo de 24 horas (uteis) para responde-lo(a) <br />
                </p>
            </section>
        </div>
    </main>
    <footer>App desenvolvido com muito amor, carinho e paciencia ❤️, por Gustavo S. Melo</footer>
</template>
<style lang="scss" src="../styles/aboutpage.style.scss" scoped />
