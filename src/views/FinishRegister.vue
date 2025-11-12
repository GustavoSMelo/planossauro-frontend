<script lang="ts" setup>
import { ref } from 'vue';

const fullName = ref(window.sessionStorage.getItem('fullName') || '');
const cellphoneNumber = ref('');

const handleChangeFullName = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    fullName.value = target.value;
};

const handleChangeCellphoneNumber = (event: Event): void => {
    let { value } = event.target as HTMLInputElement;
    value = value.replaceAll(/[a-zA-Z@#!$%^&*_+=]+/g, '').trim();


    if (value[value.length - 1] === '(' || value[value.length - 1] === ')') {
        console.log(true);
        if (Boolean(value.length !== 0) || Boolean(value.length !== 4)) {
            return;
        }
    }

    if (value.length > 15) {
        value = value.slice(0, 15);
    }

    if (value.length === 1 && !value.includes('(')) {
        value = `(${value}`;
    }

    if (value.length === 5 && !value.includes(' ')) {
        const lastChar = value[value.length - 1];
        const cellphoneContentArray = value.slice(0, value.length - 1).split('');

        let cellphoneContentString = '';

        cellphoneContentArray.forEach(el => cellphoneContentString += el);
        value = `${cellphoneContentString} ${lastChar}`;
    }

    if (value.length === 4 && !value.includes(')') && !value.includes(' ')) {
        const lastChar = value[value.length - 1];
        const cellphoneContent = value.split('');

        value = `${cellphoneContent[0]}${cellphoneContent[1]}${cellphoneContent[2]}) ${lastChar}`;
    }

    if (value.length === 11 && !value.includes('-')) {
        const lastChar = value[value.length - 1];
        const cellphoneContentArray = value.slice(0, value.length - 1).split('');

        let cellphoneContentString = '';

        cellphoneContentArray.forEach(el => cellphoneContentString += el);

        value = `${cellphoneContentString}-${lastChar}`;
    }

    console.log('teste');
    cellphoneNumber.value = value;
};

const isFormCompleted = (): boolean => {
    return fullName.value.length && cellphoneNumber.value.length ? true : false;
};
</script>
<template>
    <div class="finishRegisterContainer">
        <form class="formContainer">
            <h2>Finalize seu cadastro: </h2>

            <label>Nome completo: </label>
            <input type="text" placeholder="Insira seu nome aqui..." v-model="fullName"
                @change="event => handleChangeFullName(event)" />

            <label>Telefone celular: </label>
            <input type="text" placeholder="Insira seu telefone aqui... " :value="cellphoneNumber"
                @input="event => handleChangeCellphoneNumber(event)" />

            <button :class="isFormCompleted() ? 'btnProceedRegister' : ''" type="button">Avancar</button>
        </form>
    </div>
</template>

<style lang="scss" scoped src="../styles/finishregister.style.scss" />
