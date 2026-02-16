<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
import backendApi from '../../api/api';
import convertIsoDateToBR from '../../helpers/dateIsoConvertToBR';
import { type IPlan, type ISubscription } from '../../interfaces/subscription.interface';
import type { IPageContent } from '../../interfaces/pageContents.interface';
import type { IPopupContext } from '../../interfaces/context/popup.interface';
import type { IPaymentHistory } from '../../interfaces/paymentHistory.interface';

const { handleChangeCurrentContent } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent['contents']) => void
}>();

const allPlansInfo = ref<Array<IPlan>>([]);
const subscriptionInfo = ref<ISubscription>({
    daily_plans_used: 0,
    date_verified: '',
    last_four_digits: 0,
    next_billing: '',
    plans_id: '',
    status: 'Ativo',
    user_id: '',
    uuid: '',
    weekly_plans_used: 0
});
const planInfo = ref<IPlan>();
const showCancelPlan = ref(false);
const paymentHistory = ref<IPaymentHistory>({ payments: [] });

const { handleChangePopupInfo } = inject('popup') as IPopupContext;

const handleGetPlanContent = async () => {
    const uuid = sessionStorage.getItem('uuid');
    const response = (await backendApi.get(`/subscription/${uuid}`)).data as { subscription: ISubscription, plan: IPlan };
    subscriptionInfo.value = { ...response.subscription };
    const plan = (await backendApi.get(`/plans/${subscriptionInfo.value.plans_id}`)).data as IPlan;

    const allPlans = (await backendApi.get('/plans')).data.plans as Array<IPlan>;

    console.log(allPlans);

    allPlansInfo.value = [...allPlans ];
    planInfo.value = { ...plan };
};

const handleGetPaymentHistory = async () => {
    const uuid = await sessionStorage.getItem('uuid');
    const response = (await backendApi.get(`/payment/history/${uuid}`)).data as IPaymentHistory;

    if (!response.payments.length) return;
    paymentHistory.value.payments = [...response.payments];
};

const handleChangeCardNumbers = async () => {
    const userId = sessionStorage.getItem('uuid') ?? '';
    if (!userId) return;

    const response = await backendApi.put(`/subscription/change/payment/method`, {
        user_id: userId,
        return_url: 'http://localhost:5173/callback/payment'
    });

    return window.open(response.data.update_url);
};

const handleCancelSubscription = async () => {
    const subscriptionId = sessionStorage.getItem('subscriptionId') ?? '';
    await backendApi.delete(`/subscription/cancel/${subscriptionId}`);
    handleChangePopupInfo('Plano free assinado, plano anterior cancelado', 'success', true);
    handleChangeCurrentContent('home');
};

const handleOpenNFeLink = (index: number) => {
    const nfeLink = paymentHistory.value.payments[index].NFe;
    return window.open(nfeLink, '_blank');
};

onMounted(() => {
    handleGetPlanContent();
    handleGetPaymentHistory();
});
</script>
<template>
    <div v-if="showCancelPlan" class="popupCancelContainer">
        <section class="popupCancelContent">
            <h2>Deseja trocar para o plano free ?</h2>
            <p>Trocando para o plano gratuito, voce estara cancelando o seu plano atual, <b>Deseja continuar ?</b></p>

            <span class="btnContainer">
                <button type="button" @click="showCancelPlan = false">Voltar</button>
                <button type="button" @click="handleCancelSubscription">Ir para plano free</button>
            </span>
        </section>
    </div>
    <div class="plansContainer">
        <h2 class="plansTitle">Gerenciar assinatura</h2>

        <div class="currentPlanContainer">
            <h2>Informacoes do plano</h2>

            <ul>
                <li><b>Plano:</b> {{ planInfo?.plan_name }}</li>
                <li><b>Proximo faturamento:</b> {{ subscriptionInfo?.next_billing ?
                    convertIsoDateToBR(subscriptionInfo?.next_billing.toString()) :
                    'Proximo faturamento em processamento' }}</li>
                <li><b>Valor:</b> {{ planInfo?.price === 0 ? 'Gratis' : `R$ ${planInfo?.price}.00` }}</li>
                <li><b>Status do plano: </b>
                    <p class="statusActive"><i class="pi pi-verified"></i> {{ subscriptionInfo?.status }} </p>
                </li>
                <li>
                    <b>Cartao: </b>
                    <span v-if="subscriptionInfo?.last_four_digits">**** **** **** {{ subscriptionInfo.last_four_digits
                        }}</span>
                    <span v-else>Nenhum cartao cadastrado</span>
                </li>
            </ul>

            <span class="btnContainers">
                <button type="button" @click="handleChangeCardNumbers()" :class="subscriptionInfo
                    && subscriptionInfo?.last_four_digits === 0 ||
                    subscriptionInfo?.last_four_digits === null ?
                    'btnDisable' : 'buttonPressable'">
                    Alterar cartao
                </button>
                <button type="button" @click="handleChangeCurrentContent('edit_plan')">Alterar plano</button>
                <button type="button" @click="showCancelPlan = true" :class="subscriptionInfo
                    && subscriptionInfo?.last_four_digits === 0 ||
                    subscriptionInfo?.last_four_digits === null ?
                    'btnDisable' : 'buttonPressable'">Cancelar plano</button>
            </span>
        </div>

        <div class="paymentHistoryListContainer">
            <h2>Historico de pagamentos</h2>

            <table v-if="paymentHistory.payments.length">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descricao</th>
                        <th>Plano</th>
                        <th>Bandeira</th>
                        <th>Cartao</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Acao</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(paymentH, index) in paymentHistory.payments">
                        <td data-cell="Data: ">{{ convertIsoDateToBR(paymentH.payment_date) }}</td>
                        <td data-cell="Descricao: ">{{ paymentH.description }}</td>
                        <td data-cell="Plano: ">Plano {{ allPlansInfo.find(plan => plan.uuid === paymentH.plan_id)?.plan_name }}</td>
                        <td data-cell="Bandeira: ">
                            <img v-if="paymentH.card_brand === 'mastercard'" src="../../assets/mastercard_logo.svg" alt="bandeira logo" />
                            <img v-else-if="paymentH.card_brand === 'visa'" src="../../assets/visa.png" alt="bandeira logo" />
                            <img v-else-if="paymentH.card_brand === 'american express'" src="../../assets/american-express.png" alt="bandeira logo" />
                        </td>
                        <td data-cell="Cartao: " class="cardInfoTable">
                            <p>**** **** **** {{ paymentH.last_four_digits }}</p>
                        </td>
                        <td data-cell="Valor: ">R${{ paymentH.price }}.00</td>
                        <td data-cell="Status: ">Pago</td>
                        <td data-cell="Acao: "><button type="button" @click="handleOpenNFeLink(index)">Baixar</button></td>
                    </tr>
                </tbody>
            </table>
            <section class="paymentNotFound" v-else>
                <img src="../../assets/DinoConsultaPlanejamentos.png" alt="imagem Dino" />
                <h3>Nenhum pagamento foi encontrado </h3>
            </section>
        </div>
    </div>
</template>
<style lang="scss" scoped src="../../styles/contents/plancontent.style.scss" />
