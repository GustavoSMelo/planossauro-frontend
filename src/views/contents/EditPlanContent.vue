<script lang="ts" setup>
const handleOpenStripePage = (): void => {
    window.open('https://stripe.com/en-br', '_blank');
};
</script>
<template>
    <div class="selectEditPlanContainer">
        <h2 class="choosePlanTitle">Escolha o plano: </h2>

        <span class="planInformationPayment">
            <span>
                <i class="pi pi-info-circle"></i>
                <h3><i>Informamos:</i> </h3>
            </span>
            <p>Ao selecionar o plano, ira ser redirecionado ao <i @click="handleOpenStripePage()">STRIPE</i>, e apos o
                pagamento, voltara ao
                sistema do Planeja.AI com seu plano atualizado. Nao coletamos nenhum dado sensivel
            </p>
        </span>

        <div class="planScrollContainer">
            <section class="planListContainer">
                <div class="planContainer">
                    <h2>Mais economico</h2>

                    <span class="planWrapper">
                        <img src="../../assets/dino_party.png" alt="dino happy" />

                        <h3>Plano Essential</h3>
                        <small>
                            <p>Este plano eh essencial para educadores que estao trabalhando em 1 escola<br />
                                Voce tera acesso a:</p>
                            <ul>
                                <li><i class="pi pi-check-circle"></i>10 planejamentos diarios</li>
                                <li><i class="pi pi-check-circle"></i>10 planejamentos semanais</li>
                                <li><i class="pi pi-check-circle"></i>10 horas de trabalho economizadas</li>
                            </ul>
                        </small>

                        <div class="priceContainer">
                            <small>R$</small>
                            <h1>20.00</h1>
                            <small> /mes</small>
                        </div>

                        <button type="button">Escolher</button>
                    </span>
                </div>

                <div class="planContainer">
                    <h2>Mais completo</h2>

                    <span class="planWrapper">
                        <img src="../../assets/dino_premium.png" alt="dino happy" />

                        <h3>Plano Premium</h3>
                        <small>
                            <p>Este plano eh essencial para educadores que estao trabalhando em 1 escola<br />
                                Voce tera acesso a:</p>
                            <ul>
                                <li><i class="pi pi-check-circle"></i>90 planejamentos diarios</li>
                                <li><i class="pi pi-check-circle"></i>90 planejamentos semanais</li>
                                <li><i class="pi pi-check-circle"></i>90 horas de trabalho economizadas</li>
                            </ul>
                        </small>

                        <div class="priceContainer">
                            <small>R$</small>
                            <h1>55.00</h1>
                            <small> /mes</small>
                        </div>

                        <button type="button">Escolher</button>
                    </span>
                </div>

                <div class="selectedPlanContainer">
                    <h2>(Atual) Demonstração</h2>

                    <span class="planWrapper">
                        <img src="../../assets/profileDino.png" alt="dino happy" />

                        <h3>Plano Free</h3>
                        <small>
                            <p>Este plano eh essencial para educadores que estao trabalhando em 1 escola<br />
                                Voce tera acesso a:</p>
                            <ul>
                                <li><i class="pi pi-check-circle"></i>03 planejamentos diarios</li>
                                <li><i class="pi pi-check-circle"></i>03 planejamentos semanais</li>
                                <li><i class="pi pi-check-circle"></i>03 horas de trabalho economizadas</li>
                            </ul>
                        </small>

                        <div class="priceContainer">
                            <small>R$</small>
                            <h1>Gratis</h1>
                            <small> /mes</small>
                        </div>

                        <button type="button">Escolher</button>
                    </span>
                </div>
            </section>
        </div>

    </div>
</template>

<style lang="scss" src="../../styles/contents/editplancontent.style.scss" scoped />
