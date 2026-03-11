<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const isDark = useDark({
    attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
});
const toggle = useToggle(isDark);
const router = useRouter();

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
        <span @click="router.push('/')">
            <img src="../assets/DinoLogo.svg" alt="Planossauro logo" />
            <h3>Planossauro</h3>
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
                    <span>#</span> {{ t("docs.nav.intro") }}
                </li>
                <li
                    :class="{ active: activeSection === 'createPlanning' }"
                    @click="scrollToSection('createPlanning')"
                >
                    <span>#</span> {{ t("docs.nav.createPlanning") }}
                </li>
                <li
                    :class="{ active: activeSection === 'planningList' }"
                    @click="scrollToSection('planningList')"
                >
                    <span>#</span> {{ t("docs.nav.planningList") }}
                </li>
                <li
                    :class="{ active: activeSection === 'plans' }"
                    @click="scrollToSection('plans')"
                >
                    <span>#</span> {{ t("docs.nav.plans") }}
                </li>
                <li
                    :class="{ active: activeSection === 'support' }"
                    @click="scrollToSection('support')"
                >
                    <span>#</span> {{ t("docs.nav.support") }}
                </li>
                <li
                    :class="{ active: activeSection === 'accountDelete' }"
                    @click="scrollToSection('accountDelete')"
                >
                    <span>#</span> {{ t("docs.nav.accountDelete") }}
                </li>
            </ul>
        </aside>
        <div class="aboutContent" :data-theme="isDark ? 'dark' : 'light'">
            <span class="softwareTitle">
                <img src="../assets/DinoLogo.svg" alt="Planossauro logo" />
                <h2>{{ t("docs.title") }}</h2>
            </span>

            <section id="intro">
                <h3># {{ t("docs.intro.title") }}</h3>
                <p>
                    {{ t("docs.intro.description") }}
                </p>

                <figure class="dinoCookieContainer">
                    <img src="../assets/cookie_pink.png" alt="cookie" />
                </figure>
            </section>
            <section id="createPlanning">
                <h3># {{ t("docs.createPlanning.title") }}</h3>

                <p>
                    {{ t("docs.createPlanning.description") }}
                </p>
                <video class="dinoDemoPlan" controls speed="2">
                    <source src="../assets/demo_plan.mp4" type="video/mp4" />
                </video>
            </section>

            <section id="planningList">
                <figure class="dinoTabletWorks">
                    <img src="../assets/tablet_green.png" alt="planejamento" />
                </figure>
                <h3># {{ t("docs.planningList.title") }}</h3>
                <p>
                    {{ t("docs.planningList.description") }}
                </p>
            </section>

            <section id="plans">
                <figure class="dinoHappyYellow">
                    <img src="../assets/happy_yellow.png" alt="yellow dino" />
                </figure>
                <h3># {{ t("docs.plans.title") }}</h3>
                <h4>## {{ t("docs.plans.upgrade.title") }}</h4>
                <p class="aboutPlans">
                    {{ t("docs.plans.upgrade.description") }}
                </p>

                <h4>## {{ t("docs.plans.downgrade.title") }}</h4>
                <p class="aboutPlans">
                    {{ t("docs.plans.downgrade.description") }}
                </p>

                <h4>## {{ t("docs.plans.cancel.title") }}</h4>
                <p class="aboutPlans">
                    {{ t("docs.plans.cancel.description") }}
                </p>

                <h4>## {{ t("docs.plans.changeCard.title") }}</h4>
                <p class="aboutPlans">
                    {{ t("docs.plans.changeCard.description") }}
                </p>

                <h4>## {{ t("docs.plans.downloadReceipt.title") }}</h4>
                <p class="aboutPlans">
                    {{ t("docs.plans.downloadReceipt.description") }}
                </p>
            </section>
            <section id="support">
                <h3># {{ t("docs.support.title") }}</h3>
                <p>
                    {{ t("docs.support.description") }}
                </p>
            </section>
            <section id="accountDelete">
                <h3># {{ t("docs.accountDelete.title") }}</h3>

                <p>
                    {{ t("docs.accountDelete.description") }}
                </p>
            </section>
        </div>
    </main>
    <footer>
        {{ t("docs.footer") }}
    </footer>
</template>
<style lang="scss" src="../styles/docspage.style.scss" scoped />
