<template>
    <div class="homeContentContainer">
        <h1>Home Page</h1>
        <section class="initialHomeContent">
            <div class="planInfoContainer">
                <h1>Seu plano atual </h1>

                <img src="../../assets/cellphone_pink.png" alt="dino from plan" />
                <h2>Premium</h2>
                <button type="button">Gerenciar plano</button>
            </div>

            <aside class="fullColumnContentContainer">
                <h2 class="planningInfoTitle">Informacoes do planejamento</h2>
                <div class="planningInfoContainer firstPlanningInfoContainer">
                    <div>
                        <img src="../../assets/cracha_yellow.png" />
                    </div>
                    <div class="planningDetailsContainer">
                        <h2>Planejamento semanal</h2>
                        <span>
                            <h4>0/ 10</h4>
                            <progress value="10" max="10"></progress>
                        </span>
                    </div>
                    <button type="button">Planejar</button>
                </div>

                <div class="planningInfoContainer">
                    <div>
                        <img src="../../assets/cracha_yellow.png" />
                    </div>
                    <div class="planningDetailsContainer">
                        <h2>Planejamento diario</h2>
                        <span>
                            <h4>0/ 10</h4>
                            <progress value="0" max="10"></progress>
                        </span>
                    </div>
                    <button type="button">Planejar</button>
                </div>
            </aside>
        </section>
        <section class="aditionalInformationsContainer">
            <span>
                <h2>Duvidas sobre o pagamento ?</h2>
                <button type="button">Confirir pagamentos</button>
            </span>
            <img src="../../assets/bills_dino.png" />
        </section>
    </div>
</template>

<style lang="scss" scoped src="../../styles/contents/homecontent.style.scss" />
