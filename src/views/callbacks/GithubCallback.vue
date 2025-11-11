<script setup lang="ts">
import axios from 'axios';

const searchQueryString = window.location.search;
const urlParams = new URLSearchParams(searchQueryString);
const codeParam = urlParams.get('code')

const response = await axios.get(`http://localhost:8000/api/auth/github/${codeParam}`);

console.log(response.data);

</script>

<template>
    <div class="githubCallbackContainer">
        <h2>Working on github login...</h2>
        <i class="pi pi-github"></i>
    </div>
</template>

<style src="../../styles/callbacks/githubcallback.style.scss" lang="scss" scoped />
