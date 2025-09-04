<script setup lang="ts">
import './navbar.style.scss';
</script>
<template>
    <nav class="mainNavbar">
        <figure>
            <img src="../../assets/DinoLogoWhite.svg" alt="Dino Logo" />
            <figcaption>Planeja.ai</figcaption>
        </figure>

        <ul>
            <li>
                <p>Plano free</p>
            </li>
            <li>
                <button>
                    <i class="pi pi-sun"></i>
                </button>
            </li>
            <li>
                <button>
                    <i class="pi pi-sign-out"></i>
                </button>
            </li>
        </ul>
    </nav>
</template>
