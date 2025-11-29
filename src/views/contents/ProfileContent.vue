<script lang="ts" setup>
</script>
<template>
    <div class="profileContainer">
        <div class="profileDetails">
            <img src="../../assets/dino_profile_logo.png" />
            <h3>Gustavo Santos Melo</h3>

            <span>
                <b><i class="pi pi-github"></i> Github:</b>
                <input disabled type="text" value="gsantos15569@gmail.com"  placeholder="Seu email aqui..."/>
            </span>
            <span>
                <b><i class="pi pi-google"></i> Google:</b>
                <button type="button">Conectar</button>
            </span>
            <span>
                <b><i class="pi pi-phone"></i> Celular:</b>
                <input disabled type="text" value="11 99999-9999"  placeholder="Seu email aqui..."/>
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
        <div class="appSettings">
            <details open>
                <summary>Configuracoes do app</summary>
                <div>
                    <h3><i class="pi pi-language"></i> Linguagem: </h3>

                    <select>
                        <option>🇧🇷 Portugues (Brasil)</option>
                        <option>🇺🇸 English (Internacional / USA)</option>
                    </select>
                </div>

                <div>
                    <h3><i class="pi pi-palette"></i> Tema: </h3>

                    <select>
                        <option>☀️ Tema claro</option>
                        <option>🌑 Tema escuro</option>
                    </select>
                </div>

                <div>
                    <h3><i class="pi pi-book"></i> Documentacao: </h3>

                    <button type="button">Acessar docs</button>
                </div>

                <div>
                    <h3><i class="pi pi-headphones"></i> Ajuda / Suporte: </h3>

                    <button>Acessar ajuda</button>
                </div>

                <div>
                    <h3><i class="pi pi-sign-out"></i> Sair: </h3>

                    <button>Deslogar / Sair</button>
                </div>
                <div>
                    <h3>Versao do app: </h3>

                    <p>Version 0.0.0</p>
                </div>
            </details>
        </div>
    </div>
</template>

<style lang="scss" scoped src="../../styles/contents/profilecontent.style.scss" />
