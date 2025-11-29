<script lang="ts" setup>
</script>
<template>
    <div class="profileContainer">
        <div class="profileDetails">
            <img src="../../assets/dino_profile_logo.png" />
            <h3>Gustavo Santos Melo</h3>

            <span>
                <b><i class="pi pi-github"></i> Github:</b>
                <p>gsantos15569@gmail.com</p>
            </span>
            <span>
                <b><i class="pi pi-google"></i> Google:</b>
                <button type="button">Conectar</button>
            </span>
            <span>
                <b><i class="pi pi-phone"></i> Celular:</b>
                <p>11939392302</p>
            </span>
            <button class="btnChangeProfile" type="button">Alterar perfil</button>
            <div class="profileAdditionalDetails">
                <p>
                    <b>Email validado:</b>
                    <button type="button" class="checked">
                        <i class="pi pi-verified"></i>Validado
                    </button>
                </p>
                <p>
                    <b>SMS validado: </b>
                    <button type="button" class="unchecked">
                        <i class="pi pi-unlock"></i>
                        Validar
                    </button>
                </p>
                <p class="createdAtText">Usuario desde: 10/10/2010</p>
                <button type="button"><i class="pi pi-trash"></i> Excluir conta</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped src="../../styles/contents/profilecontent.style.scss" />
