<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import backendApi from '../../api/api';
import { type IPlan, type ISubscription } from '../../interfaces/subscription.interface';

const hasPayments = ref(false);
const subscriptionInfo = ref<ISubscription>();
const planInfo = ref<IPlan>();

const handleGetPlanContent = async () => {
    const uuid = sessionStorage.getItem('uuid');
    const response = (await backendApi.get(`/subscription/${uuid}`)).data as { subscription: ISubscription, plan: IPlan };

    subscriptionInfo.value = { ...response.subscription };
    planInfo.value = { ...response.plan };
};

onMounted(() => { handleGetPlanContent(); });
</script>
<template>
    <div class="plansContainer">
        <h2 class="plansTitle">Gerenciar assinatura</h2>

        <div class="currentPlanContainer">
            <h2>Informacoes do plano</h2>

            <ul>
                <li><b>Plano:</b> {{ planInfo?.plan_name }}</li>
                <li><b>Proximo faturamento:</b> {{ subscriptionInfo?.next_billing ? subscriptionInfo?.next_billing : 'Proximo faturamento em processamento' }}</li>
                <li><b>Valor:</b> {{ planInfo?.price === 0 ? 'Gratis' : `R$ ${planInfo?.price}` }}</li>
                <li><b>Status do plano: </b>
                    <p class="statusActive"><i class="pi pi-verified"></i> {{ subscriptionInfo?.status }} </p>
                </li>
                <li>
                    <b>Cartao: </b>
                    <span v-if="subscriptionInfo?.last_four_digits">**** **** ****</span>
                    <span v-else>Nenhum cartao cadastrado</span>
                </li>
            </ul>

            <span class="btnContainers">
                <button type="button">Alterar cartao</button>
                <button type="button">Alterar plano</button>
                <button type="button">Cancelar plano</button>
            </span>
        </div>

        <div class="paymentHistoryListContainer">
            <h2>Historico de pagamentos</h2>

            <table v-if="hasPayments">
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
                    <tr>
                        <td data-cell="Data: ">10/10/2010</td>
                        <td data-cell="Descricao: ">Pagamento referente ao mes de janeiro</td>
                        <td data-cell="Plano: ">Plano free</td>
                        <td data-cell="Bandeira: ">
                            <img src="../../assets/mastercard_logo.svg" alt="bandeira logo" />
                        </td>
                        <td data-cell="Cartao: " class="cardInfoTable">
                            <p>**** **** **** 1010</p>
                        </td>
                        <td data-cell="Valor: ">R$10.00</td>
                        <td data-cell="Status: ">Pago</td>
                        <td data-cell="Acao: "><button type="button">Baixar</button></td>
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
