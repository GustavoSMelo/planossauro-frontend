<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core";
import { useRouter } from "vue-router";
import GalleryPhoto from "../components/galleryPhotos/GalleryPhoto.vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const showPhoto = ref(false);
const router = useRouter();
const selectedPhoto = ref(0);

const isDark = useDark({
    attribute: "data-theme",
    valueLight: "light",
    valueDark: "dark",
});
const toggle = useToggle(isDark);
const { t } = useI18n();

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
                    <h1>{{ t("learn.title.h1_1") }}</h1>
                    <h1>{{ t("learn.title.h1_2") }}</h1>
                    <h3>{{ t("learn.title.h3") }}</h3>
                </span>
            </div>

            <div class="demoVideoContainer">
                <video poster="../assets/video_thumbnail.png" controls>
                    <source src="../assets/demo_plan.mp4" type="video/mp4" />
                </video>
                <small>{{ t("learn.videoInfo") }}</small>
            </div>

            <section class="whatIsContainer">
                <h2>{{ t("learn.whatIsH2") }}</h2>

                <section>
                    <p>
                        {{ t("learn.whatIsContent") }}
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
                    {{ t("learn.featuresH2") }}
                </h2>

                <section>
                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>{{ t("learn.feature_ia") }}</figcaption>
                        <img src="../assets/ia_dino.png" alt="dino AI" />
                        <p>
                            {{ t("learn.feature_ia_desc") }}
                        </p>
                    </figure>

                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>{{ t("learn.featureCloud") }}</figcaption>
                        <img src="../assets/cloud_dino.png" alt="dino nuvem" />
                        <p>
                            {{ t("learn.featureCloud_desc") }}
                        </p>
                    </figure>
                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>{{ t("learn.featurePrice") }}</figcaption>
                        <img
                            src="../assets/dino_premium.png"
                            alt="dino preco"
                        />
                        <p>
                            {{ t("learn.featurePrice_desc") }}
                        </p>
                    </figure>
                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>{{ t("learn.featureDinos") }}</figcaption>
                        <img
                            src="../assets/profileDino.png"
                            alt="dino feliz pirulito"
                        />
                        <p>
                            {{ t("learn.featureDinos_desc") }}
                        </p>
                    </figure>

                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>{{ t("learn.featureEasy") }}</figcaption>
                        <img
                            src="../assets/dininho.png"
                            alt="dino feliz pirulito"
                        />
                        <p>
                            {{ t("learn.featureEasy_desc") }}
                        </p>
                    </figure>

                    <figure :data-theme="isDark ? 'dark' : 'light'">
                        <figcaption>{{ t("learn.featureSupport") }}</figcaption>
                        <img
                            src="../assets/DinoSupport.png"
                            alt="dino feliz pirulito"
                        />
                        <p>
                            {{ t("learn.featureSupport_desc") }}
                        </p>
                    </figure>
                </section>
            </section>

            <section class="humansForHumansContainer">
                <h2
                    class="categoryTitle"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    {{ t("learn.humansForHumansH2") }}
                </h2>

                <div
                    class="humansForHumansContent"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    <img
                        src="../assets/dino_cat.gif"
                        alt="{{ t('learn.humansForHumansContent') }}"
                    />
                    <p>
                        {{ t("learn.humansForHumansContent") }}
                    </p>
                </div>
            </section>

            <section class="helpContainer">
                <h2>{{ t("learn.helpH2") }}</h2>
                <img
                    src="../assets/tablet_green.png"
                    alt="{{ t('learn.buttons.support') }}"
                />

                <p>
                    {{ t("learn.help_content_1") }} <br /><br />

                    {{ t("learn.help_content_2") }}
                </p>

                <span class="buttonContainer">
                    <button type="button">
                        <i class="pi pi-book"></i>
                        {{ t("learn.buttons.documentation") }}
                    </button>
                    <button type="button">
                        <i class="pi pi-at"></i>
                        {{ t("learn.buttons.support") }}
                    </button>
                </span>
            </section>

            <section class="photosContainer">
                <h2
                    class="categoryTitle"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    {{ t("learn.photosH2") }}
                </h2>

                <figure class="photosContent">
                    <span>
                        <img
                            src="../assets/screenshots/screenshot1.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 1;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot2.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 2;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot3.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 3;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot4.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 4;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot5.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 5;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot6.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 6;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot7.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 7;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot8.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 8;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot9.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 9;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot10.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 10;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                    <span>
                        <img
                            src="../assets/screenshots/screenshot11.png"
                            alt="screenshot"
                        />
                        <div
                            class="buttonContainer"
                            @click="
                                selectedPhoto = 11;
                                handleShowPhoto(true);
                            "
                        >
                            <button type="button">
                                {{ t("learn.photoButton") }}
                            </button>
                        </div>
                    </span>
                </figure>
            </section>

            <section class="faqContainer">
                <h2
                    class="categoryTitle"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    {{ t("learn.faqH2") }}
                </h2>

                <div class="faqContainer">
                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>{{ t("learn.faq_1_q") }}</summary>
                        <p>
                            {{ t("learn.faq_1_a") }}
                        </p>
                    </details>

                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>{{ t("learn.faq_2_q") }}</summary>
                        <p>
                            {{ t("learn.faq_2_a") }}
                        </p>
                    </details>

                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>{{ t("learn.faq_3_q") }}</summary>
                        <p>
                            {{ t("learn.faq_3_a") }}
                        </p>
                    </details>

                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>{{ t("learn.faq_4_q") }}</summary>
                        <p>
                            {{ t("learn.faq_4_a") }}
                        </p>
                    </details>

                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>{{ t("learn.faq_5_q") }}</summary>
                        <p>
                            {{ t("learn.faq_5_a") }}
                        </p>
                    </details>

                    <details :data-theme="isDark ? 'dark' : 'light'" open>
                        <summary>{{ t("learn.faq_6_q") }}</summary>
                        <p>
                            {{ t("learn.faq_6_a") }}
                        </p>
                    </details>
                </div>
            </section>
        </div>
    </main>
    <footer>
        <h2>
            {{ t("learn.footer") }}
        </h2>
    </footer>
</template>
<style lang="scss" src="../styles/learn.style.scss" scoped />
