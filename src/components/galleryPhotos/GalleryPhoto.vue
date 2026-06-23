<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";

const { selectedPhoto, handleShowPhoto } = defineProps<{
    selectedPhoto: number;
    handleShowPhoto: (newValue: boolean) => void;
}>();
const currentPhoto = ref(1);

const handleNextPhoto = () => {
    if (currentPhoto.value === 11) currentPhoto.value = 1;
    else currentPhoto.value++;
};

const handlePreviousPhoto = () => {
    if (currentPhoto.value === 1) currentPhoto.value = 11;
    else currentPhoto.value--;
};

const photoSrc = computed(() => new URL(`../../assets/screenshots/screenshot${currentPhoto.value}.png`, import.meta.url).href);

onMounted(() => {
    currentPhoto.value = selectedPhoto;
});
</script>
<template>
    <div class="galleryPhotoContainer" @click="handleShowPhoto(false)">
        <img
            :src="photoSrc"
            alt="photo"
            @click="(event) => event.stopPropagation()"
        />
        <span
            class="galleryControls"
            @click="(event) => event.stopPropagation()"
        >
            <button type="button" @click="handlePreviousPhoto()">
                <i class="pi pi-arrow-left"></i>
            </button>
            <button @click="handleShowPhoto(false)">
                <i class="pi pi-times"></i>
            </button>
            <button type="button" @click="handleNextPhoto()">
                <i class="pi pi-arrow-right"></i>
            </button>
        </span>
    </div>
</template>
<style lang="scss" scoped src="./galleryphoto.style.scss" />
