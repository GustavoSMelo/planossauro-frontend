<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from "vue";

const isDark = useDark({
    attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
});

const toggle = useToggle(isDark);

const activeSection = ref("intro");

const sections = [
    "intro",
    "createPlanning",
    "planningList",
    "accountDelete",
    "plans",
    "support",
];

const scrollToSection = (id: string) => {
    activeSection.value = id;
    const element = document.getElementById(id);
    if (element) {
        const navHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    }
};

const handleScroll = () => {
    const navHeight = 80;
    const scrollPosition = window.scrollY;
    let current = "";

    for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const sectionTop = rect.top + scrollPosition;
            if (sectionTop - navHeight <= scrollPosition + 50) {
                current = id;
            }
        }
    }

    if (current) {
        activeSection.value = current;
    }
};

onMounted(() => {
    const demoVideo = window.document.querySelector(
        ".dinoDemoPlan",
    ) as HTMLVideoElement;
    if (demoVideo) demoVideo.defaultPlaybackRate = 2;

    window.addEventListener("scroll", handleScroll);
    handleScroll();
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
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
                <li
                    :class="{ active: activeSection === 'intro' }"
                    @click="scrollToSection('intro')"
                >
                    <span>#</span> Introducao
                </li>
                <li
                    :class="{ active: activeSection === 'createPlanning' }"
                    @click="scrollToSection('createPlanning')"
                >
                    <span>#</span> Criar planejamento
                </li>
                <li
                    :class="{ active: activeSection === 'planningList' }"
                    @click="scrollToSection('planningList')"
                >
                    <span>#</span> Listar planejamentos
                </li>
                <li
                    :class="{ active: activeSection === 'plans' }"
                    @click="scrollToSection('plans')"
                >
                    <span>#</span> Planos e assinatura
                </li>
                <li
                    :class="{ active: activeSection === 'support' }"
                    @click="scrollToSection('support')"
                >
                    <span>#</span> Suporte
                </li>
                <li
                    :class="{ active: activeSection === 'accountDelete' }"
                    @click="scrollToSection('accountDelete')"
                >
                    <span>#</span> Deletar conta
                </li>
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
                    Essa documentacao visa responder algumas duvidas de
                    usabilidade de sistema e ser um onboarding de todo o
                    aplicativo
                </p>

                <figure class="dinoCookieContainer">
                    <img src="../assets/cookie_pink.png" alt="cookie" />
                </figure>
            </section>
            <section id="createPlanning">
                <h3># Como criar um planejamento ?</h3>

                <p>
                    Primeiramente voce precisa criar uma conta no app, para
                    isso, basta clickar em Login e conectar sua conta do Google
                    ou Github, apos isso, entre na pagina Home, va para aba de
                    "Planejar" ou "Design", nessa aba, voce podera escolher duas
                    opcoes, semanal ou diario. Escolhendo qualquer uma das
                    opcoes, preencha o formulario e click em avancar, preencha
                    os detalhes da escola e click em finalizar e escolha seu
                    template, espere o planejamento ficar pronto que ele sera
                    baixado automaticamente
                </p>
                <video class="dinoDemoPlan" controls speed="2">
                    <source src="../assets/demo_plan.mp4" type="video/mp4" />
                </video>
            </section>

            <section id="planningList">
                <figure class="dinoTabletWorks">
                    <img src="../assets/tablet_green.png" alt="planejamento" />
                </figure>
                <h3># Como verificar os planejamentos ja criados ?</h3>
                <p>
                    Dentro do sistema, clique em "Planejamentos", nisso ira
                    aparecer uma tabela listando todos os planejamentos ja
                    criado por voce, voce pode escolher baixar o planejamento,
                    editar informacoes basicas ou ate mesmo exclui-lo. Caso
                    precise, podera utilizar os campos de busca para ter uma
                    listagem mais assertiva
                </p>
            </section>

            <section id="plans">
                <figure class="dinoHappyYellow">
                    <img src="../assets/happy_yellow.png" alt="yellow dino" />
                </figure>
                <h3># Sobre planos e assinatura</h3>
                <h4>## Como fazer um upgrade ?</h4>
                <p class="aboutPlans">
                    Ao realizar o login no app, eh possivel verificar nas suas
                    abas que possuimos a aba de "plano", clicando nessa aba
                    podera ver as informacoes do plano e do historico de
                    pagamentos. Para fazer o upgrade, click no botao "Alterar
                    plano", escolha o plano que mais encaixa com seu perfil e
                    click em "Escolher". Sera aberta uma nova pagina para voce
                    fazer o pagamento, apos isso, volte ao sistema e atualize a
                    pagina, caso nao funcione, sai e entre no sistema novamente,
                    caso nao funcione, espere alguns minutos. Se nada disso
                    funcionar, podera entrar em contato conosco que iremos
                    resolver seu problema.
                </p>

                <h4>## Como fazer um downgrade ?</h4>
                <p class="aboutPlans">
                    Para fazer o downgrade eh o mesmo processo, porem voce
                    precisara escolher um plano diferente do seu atual, apos
                    fazer isso, confirme a escolha do plano e ele sera
                    atualizado automaticamente.
                </p>

                <h4>## Como cancelar um plano ?</h4>
                <p class="aboutPlans">
                    Cancelar um plano eh bem simples, voce simplesmente vai ate
                    a aba de planos, e clica no botao de cancelar e depois no
                    botao de confirmar, fazendo isso voce volta para o plano
                    gratuito
                </p>

                <h4>## Como Alterar o cartao ?</h4>
                <p class="aboutPlans">
                    Na pagina de planos, clique no botao de alterar cartao,
                    nesse momento sera aberta uma tela para atualizar seus dados
                    de pagamentos, apos isso, volte ao sistema e seu cartao sera
                    atualizado
                </p>

                <h4>## Como baixar o comprovante de pagamento ?</h4>
                <p class="aboutPlans">
                    No historico de pagamentos, clique no botao "download", voce
                    recebera um .pdf com todas as informacoes necessarios sobre
                    a comprovacao de seu pagamento.
                </p>
            </section>
            <section id="support">
                <h3># Ajuda / Suporte</h3>
                <p>
                    Para acessar a ajuda/suporte voce pode ir na aba de perfil e
                    clickar no botao "Acessar ajuda", na categoria Ajuda/Suporte
                </p>
            </section>
            <section id="accountDelete">
                <h3># Exclusao de conta</h3>

                <p>
                    Para realizar a exclusao de uma conta, primeiro voce deve
                    validar ela, para isso clique no botao de validar que se
                    encontra na aba de perfil, ao clicar nesse botao, ira
                    receber um email na sua caixa de entrada e dentro do nosso
                    app sera redirecionado para uma pagina para colocar o codigo
                    de validacao. Ao colocar esse codigo, agora podera clicar no
                    botao de excluir conta, apos isso, sua conta estara suspensa
                    por 30 dias, podendo reativa-la a qualquer momento durante
                    esse tempo. Passado esse periodo, sua conta sera excluida
                    permanentemente
                </p>
            </section>
        </div>
    </main>
    <footer>
        App desenvolvido com muito amor, carinho e paciencia ❤️, por Gustavo S.
        Melo
    </footer>
</template>
<style lang="scss" src="../styles/docspage.style.scss" scoped />
