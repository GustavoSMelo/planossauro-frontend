<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import backendApi from '../../api/api';
import type { IUser } from '../../interfaces/api/user.interface';
import type { ILoginType } from '../../interfaces/loginType.interface';
import type { IPlan, ISubscription } from '../../interfaces/subscription.interface';

const subscriptionInfo = ref<ISubscription>({
    weekly_plans_used: 0,
    daily_plans_used: 0,
    date_verified: '',
    last_four_digits: 0,
    next_billing: '',
    plans_id: '',
    status: 'Ativo',
    user_id: '',
    uuid: ''
});

const planInfo = ref<IPlan>({
    amount_planning_day: 0,
    amount_planning_week: 0,
    plan_name: '',
    price: 0,
    uuid: ''
});

const showPopupCancel = ref(false);

const handleOpenStripePage = (): void => {
    window.open('https://stripe.com/en-br', '_blank');
};

const handleEditYourPlan = async (choosedPlan: 'essential' | 'premium' | 'free') => {
    const userStringfied = sessionStorage.getItem('user') ?? null;
    const loginType = sessionStorage.getItem('loginType') as ILoginType['types'] ?? 'google';

    if (userStringfied === null) return;

    const user: IUser = JSON.parse(userStringfied);

    if (planInfo.value.plan_name.toLowerCase() === choosedPlan.toLowerCase()) return;

    if (!subscriptionInfo.value.last_four_digits) {
        if (choosedPlan === 'essential') {
            const essentialLink = import.meta.env.VITE_STRIPE_ESSENTIAL_PLAN_URL;
            return window.open(`${essentialLink}${loginType === 'google' ? user.google_email : user.github_email}`);
        }

        const premiumLink = import.meta.env.VITE_STRIPE_PREMIUM_PLAN_URL;
        return window.open(`${premiumLink}${loginType === 'google' ? user.google_email : user.github_email}`);
    } else if (choosedPlan === 'free') {
        return showPopupCancel.value = true;
    }

    const essentialPriceId = import.meta.env.VITE_STRIPE_ESSENTIAL_PRICE_ID;
    const premiumPriceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;

    const changePaymentMethod = await backendApi.put(`/subscription/change/subscription/plan`, {
        "user_id": user.uuid,
        'return_url': 'http://localhost:5173/callback/payment',
        'price': choosedPlan === 'essential' ? essentialPriceId : premiumPriceId
    });

    const updateURL = changePaymentMethod.data.update_url;
    if (updateURL) window.open(updateURL);
};


onMounted(async () => {
    const userUUID = sessionStorage.getItem('uuid') ?? '';

    if (!userUUID.length) return;

    const subscriptionDetails = (await backendApi.get(`subscription/${userUUID}`)).data as { plan: IPlan, subscription: ISubscription };
    subscriptionInfo.value = { ...subscriptionDetails.subscription };
    planInfo.value = { ...subscriptionDetails.plan };
});
</script>
<template>
    <div class="popupCancelContainer" v-if="showPopupCancel">
        <section class="popupCancelContent">
            <h2>Deseja trocar para o plano free ?</h2>
            <p>Trocando para o plano gratuito, voce estara cancelando o seu plano atual, <b>Deseja continuar ?</b></p>

            <span class="btnContainer">
                <button type="button">Voltar</button>
                <button type="button">Ir para plano free</button>
            </span>
        </section>
    </div>
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
                            <p>Este plano é essencial para educadores que estão trabalhando em uma escola e dão aulas
                                para uma turma.<br />
                                Você terá acesso a:</p>
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

                        <button type="button" @click="handleEditYourPlan('essential')">Escolher</button>
                    </span>
                </div>

                <div class="planContainer">
                    <h2>Mais completo</h2>

                    <span class="planWrapper">
                        <img src="../../assets/dino_premium.png" alt="dino happy" />

                        <h3>Plano Premium</h3>
                        <small>
                            <p>Este plano é ideal para educadores que dão aulas para multiplas escolas, turmas e gostam
                                de poupar seu tempo<br />
                                Você terá acesso a:</p>
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

                        <button type="button" @click="handleEditYourPlan('premium')">Escolher</button>
                    </span>
                </div>

                <div class="selectedPlanContainer">
                    <h2>(Atual) Demonstração</h2>

                    <span class="planWrapper">
                        <img src="../../assets/profileDino.png" alt="dino happy" />

                        <h3>Plano Free</h3>
                        <small>
                            <p>Plano com foco em apresentar a nossa plataforma e demonstrar o tempo poupado que
                                tera<br />
                                Você terá acesso a:
                            </p>
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
