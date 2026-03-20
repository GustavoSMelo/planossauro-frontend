<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import backendApi from "../../api/api";
import convertIsoDateToBR from "../../helpers/dateIsoConvertToBR";
import {
    type IPlan,
    type ISubscription,
} from "../../interfaces/subscription.interface";
import type { IPageContent } from "../../interfaces/pageContents.interface";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import type { IPaymentHistory } from "../../interfaces/paymentHistory.interface";
import { useI18n } from "vue-i18n";
import { useDark } from "@vueuse/core";

const { handleChangeCurrentContent } = defineProps<{
    handleChangeCurrentContent: (newValue: IPageContent["contents"]) => void;
}>();

const isDark = useDark({
    attribute: "data-themes",
    valueDark: "dark",
    valueLight: "light",
});
const allPlansInfo = ref<Array<IPlan>>([]);
const subscriptionInfo = ref<ISubscription>({
    daily_plans_used: 0,
    date_verified: "",
    last_four_digits: 0,
    next_billing: "",
    plans_id: "",
    status: "Ativo",
    user_id: "",
    uuid: "",
    weekly_plans_used: 0,
});
const planInfo = ref<IPlan>();
const showCancelPlan = ref(false);
const paymentHistory = ref<IPaymentHistory>({ payments: [] });
const { t } = useI18n();
const { handleChangePopupInfo } = inject("popup") as IPopupContext;

const handleGetPlanContent = async () => {
    const uuid = JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid;
    const response = (await backendApi.get(`/subscription/${uuid}`)).data as {
        subscription: ISubscription;
        plan: IPlan;
    };
    subscriptionInfo.value = { ...response.subscription };
    const plan = (
        await backendApi.get(`/plans/${subscriptionInfo.value.plans_id}`)
    ).data as IPlan;
    const allPlans = (await backendApi.get("/plans")).data
        .plans as Array<IPlan>;

    allPlansInfo.value = [...allPlans];
    planInfo.value = { ...plan };
};

const handleGetPaymentHistory = async () => {
    const uuid = JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid;
    const response = (await backendApi.get(`/payment/history/${uuid}`))
        .data as IPaymentHistory;

    if (!response.payments.length) return;
    paymentHistory.value.payments = [...response.payments];
};

const handleChangeCardNumbers = async () => {
    const userId =
        JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid ?? "";
    if (!userId) return;

    const response = await backendApi.put(
        `/subscription/change/payment/method`,
        {
            user_id: userId,
            return_url: "http://localhost:5173/callback/payment",
        },
    );

    return window.open(response.data.update_url);
};

const handleCancelSubscription = async () => {
    const userUUID =
        JSON.parse(sessionStorage.getItem("user") ?? "{}").uuid ?? "";
    const subscriptionResponse = await backendApi.get(
        `/subscription/${userUUID}`,
    );
    const subscriptionId = subscriptionResponse.data.subscription.uuid;
    await backendApi.delete(`/subscription/cancel/${subscriptionId}`);
    handleChangePopupInfo(
        "Plano free assinado, plano anterior cancelado",
        "success",
        true,
    );
    handleChangeCurrentContent("home");
};

const handleOpenNFeLink = (index: number) => {
    const nfeLink = paymentHistory.value.payments[index].NFe;
    return window.open(nfeLink, "_blank");
};

onMounted(() => {
    handleGetPlanContent();
    handleGetPaymentHistory();
});
</script>
<template>
    <div
        v-if="showCancelPlan"
        class="popupCancelContainer"
        @click="showCancelPlan = false"
    >
        <section
            class="popupCancelContent"
            @click="(event) => event.stopPropagation()"
        >
            <h2>{{ $t("plans.changeToFree") }}</h2>
            <p>{{ $t("plans.changeToFreeDescription") }}</p>

            <span class="btnContainer">
                <button type="button" @click="showCancelPlan = false">
                    Voltar
                </button>
                <button type="button" @click="handleCancelSubscription">
                    Ir para plano free
                </button>
            </span>
        </section>
    </div>
    <div class="plansContainer">
        <h2 class="plansTitle">{{ $t("plans.manageSubscription") }}</h2>

        <div
            class="currentPlanContainer"
            :data-theme="isDark ? 'dark' : 'light'"
        >
            <h2>{{ $t("plans.planInformations") }}</h2>

            <ul>
                <li>
                    <b>{{ $t("plans.plan") }}:</b> {{ planInfo?.plan_name }}
                </li>
                <li>
                    <b>{{ $t("plans.nextBilling") }}</b>
                    {{
                        subscriptionInfo?.next_billing
                            ? convertIsoDateToBR(
                                  subscriptionInfo?.next_billing.toString(),
                              )
                            : t("plans.nextBillingProcessing")
                    }}
                </li>
                <li>
                    <b>{{ $t("plans.value") }}:</b>
                    {{
                        planInfo?.price === 0
                            ? t("plans.free")
                            : `R$
                    ${planInfo?.price}.00`
                    }}
                </li>
                <li>
                    <b>{{ $t("plans.planStatus") }} </b>
                    <p
                        :class="
                            subscriptionInfo?.status.toLowerCase() ===
                                'active' ||
                            subscriptionInfo?.status.toLowerCase() === 'paid'
                                ? 'statusActive'
                                : 'statusWarning'
                        "
                    >
                        <i
                            :class="
                                subscriptionInfo?.status.toLowerCase() ===
                                'paid'
                                    ? 'pi pi-verified'
                                    : 'pi pi-exclamation-triangle'
                            "
                        ></i>
                        {{ subscriptionInfo?.status }}
                    </p>
                </li>
                <li>
                    <b>{{ $t("plans.card") }}: </b>
                    <span v-if="subscriptionInfo?.last_four_digits"
                        >**** **** ****
                        {{ subscriptionInfo.last_four_digits }}</span
                    >
                    <span v-else>{{ $t("plans.noCardFounded") }}</span>
                </li>
            </ul>

            <span class="btnContainers">
                <button
                    type="button"
                    @click="
                        subscriptionInfo &&
                        subscriptionInfo?.last_four_digits === null
                            ? () => {}
                            : handleChangeCardNumbers()
                    "
                    :class="
                        (subscriptionInfo &&
                            subscriptionInfo?.last_four_digits === 0) ||
                        subscriptionInfo?.last_four_digits === null
                            ? 'btnDisable'
                            : 'buttonPressable'
                    "
                >
                    {{ $t("plans.changeCard") }}
                </button>
                <button
                    type="button"
                    @click="handleChangeCurrentContent('edit_plan')"
                >
                    {{ $t("plans.changePlan") }}
                </button>
                <button
                    type="button"
                    @click="
                        subscriptionInfo &&
                        subscriptionInfo?.last_four_digits === null
                            ? () => {}
                            : (showCancelPlan = true)
                    "
                    :class="
                        (subscriptionInfo &&
                            subscriptionInfo?.last_four_digits === 0) ||
                        subscriptionInfo?.last_four_digits === null
                            ? 'btnDisable'
                            : 'buttonPressable'
                    "
                >
                    {{ $t("plans.cancelPlan") }}
                </button>
            </span>
        </div>

        <div
            class="paymentHistoryListContainer"
            :data-theme="isDark ? 'dark' : 'light'"
        >
            <h2>{{ $t("plans.paymentHistory") }}</h2>

            <table v-if="paymentHistory.payments.length">
                <thead>
                    <tr>
                        <th>{{ $t("plans.date") }}</th>
                        <th>{{ $t("plans.description") }}</th>
                        <th>{{ $t("plans.plan") }}</th>
                        <th>{{ $t("plans.flag") }}</th>
                        <th>{{ $t("plans.card") }}</th>
                        <th>{{ $t("plans.value") }}</th>
                        <th>{{ $t("plans.status") }}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(paymentH, index) in paymentHistory.payments"
                        :key="paymentH.payment_date"
                    >
                        <td :data-cell="`${t('plans.date')}:`">
                            {{ convertIsoDateToBR(paymentH.payment_date) }}
                        </td>
                        <td :data-cell="`${t('plans.description')}:`">
                            {{ paymentH.description }}
                        </td>
                        <td :data-cell="`${t('plans.plan')}:`">
                            Plano
                            {{
                                allPlansInfo.find(
                                    (plan) => plan.uuid === paymentH.plan_id,
                                )?.plan_name
                            }}
                        </td>
                        <td :data-cell="`${t('plans.flag')}:`">
                            <img
                                v-if="paymentH.card_brand === 'mastercard'"
                                src="../../assets/mastercard_logo.svg"
                                alt="bandeira logo"
                            />
                            <img
                                v-else-if="paymentH.card_brand === 'visa'"
                                src="../../assets/visa.png"
                                alt="bandeira logo"
                            />
                            <img
                                v-else-if="
                                    paymentH.card_brand === 'american express'
                                "
                                src="../../assets/american-express.png"
                                alt="bandeira logo"
                            />
                        </td>
                        <td
                            :data-cell="`${t('plans.card')}:`"
                            class="cardInfoTable"
                        >
                            <p>
                                **** **** **** {{ paymentH.last_four_digits }}
                            </p>
                        </td>
                        <td :data-cell="`${t('plans.value')}:`">
                            R${{ paymentH.price }}.00
                        </td>
                        <td :data-cell="`${t('plans.status')}:`">Pago</td>
                        <td>
                            <button
                                type="button"
                                @click="handleOpenNFeLink(index)"
                            >
                                Download
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <section class="paymentNotFound" v-else>
                <img
                    src="../../assets/DinoConsultaPlanejamentos.png"
                    alt="imagem Dino"
                />
                <h3>{{ $t("plans.noPaymentFounded") }}</h3>
            </section>
        </div>
    </div>
</template>
<style lang="scss" scoped src="../../styles/contents/plancontent.style.scss" />
