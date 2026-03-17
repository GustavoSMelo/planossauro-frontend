<script lang="ts" setup>
import { inject, onMounted, ref } from "vue";
import backendApi from "../../api/api";
import type { IUser } from "../../interfaces/api/user.interface";
import type { ILoginType } from "../../interfaces/loginType.interface";
import type {
    IPlan,
    ISubscription,
} from "../../interfaces/subscription.interface";
import type { IPopupContext } from "../../interfaces/context/popup.interface";
import type { IPageContent } from "../../interfaces/pageContents.interface";
import { useDark } from "@vueuse/core";

const isDark = useDark({
    attribute: "data-theme",
    valueDark: "dark",
    valueLight: "light",
});

const { handleChangeCurrentContent } = defineProps<{
    handleChangeCurrentContent(newValue: IPageContent["contents"]): void;
}>();

const subscriptionInfo = ref<ISubscription>({
    weekly_plans_used: 0,
    daily_plans_used: 0,
    date_verified: "",
    last_four_digits: 0,
    next_billing: "",
    plans_id: "",
    status: "Ativo",
    user_id: "",
    uuid: "",
});

const planInfo = ref<IPlan>({
    amount_planning_day: 0,
    amount_planning_week: 0,
    plan_name: "",
    price: 0,
    uuid: "",
});

const showPopupCancel = ref(false);
const { handleChangePopupInfo } = inject("popup") as IPopupContext;

const handleEditYourPlan = async (
    choosedPlan: "essential" | "premium" | "free",
) => {
    const userStringfied = sessionStorage.getItem("user") ?? null;
    const loginType =
        (sessionStorage.getItem("loginType") as ILoginType["types"]) ??
        "google";

    if (userStringfied === null) return;

    const user: IUser = JSON.parse(userStringfied);

    if (planInfo.value.plan_name.toLowerCase() === choosedPlan.toLowerCase())
        return;

    if (!subscriptionInfo.value.last_four_digits) {
        if (choosedPlan === "essential") {
            const essentialLink = import.meta.env
                .VITE_STRIPE_ESSENTIAL_PLAN_URL;
            return window.open(
                `${essentialLink}${loginType === "google" ? user.google_email : user.github_email}`,
            );
        }

        const premiumLink = import.meta.env.VITE_STRIPE_PREMIUM_PLAN_URL;
        return window.open(
            `${premiumLink}${loginType === "google" ? user.google_email : user.github_email}`,
        );
    } else if (choosedPlan === "free") {
        return (showPopupCancel.value = true);
    }

    const essentialPriceId = import.meta.env.VITE_STRIPE_ESSENTIAL_PRICE_ID;
    const premiumPriceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;

    const changePaymentMethod = await backendApi.put(
        `/subscription/change/subscription/plan`,
        {
            user_id: user.uuid,
            return_url: "http://localhost:5173/callback/payment",
            price:
                choosedPlan === "essential" ? essentialPriceId : premiumPriceId,
        },
    );

    const updateURL = changePaymentMethod.data.update_url;
    if (updateURL) window.open(updateURL);
};

const handleCancelSubscription = async () => {
    const userUUID = JSON.parse(sessionStorage.getItem("user")).uuid ?? "";
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

onMounted(async () => {
    const userUUID = JSON.parse(sessionStorage.getItem("user")).uuid ?? "";

    if (!userUUID.length) return;

    const subscriptionDetails = (
        await backendApi.get(`subscription/${userUUID}`)
    ).data as { plan: IPlan; subscription: ISubscription };
    subscriptionInfo.value = { ...subscriptionDetails.subscription };

    const plan = (
        await backendApi.get(`/plans/${subscriptionInfo.value.plans_id}`)
    ).data as IPlan;
    planInfo.value = { ...plan };
});
</script>
<template>
    <div class="popupCancelContainer" v-if="showPopupCancel">
        <section class="popupCancelContent">
            <h2>Deseja trocar para o plano free ?</h2>
            <p>
                Trocando para o plano gratuito, voce estara cancelando o seu
                plano atual, <b>Deseja continuar ?</b>
            </p>

            <span class="btnContainer">
                <button type="button" @click="showPopupCancel = false">
                    Voltar
                </button>
                <button type="button" @click="handleCancelSubscription">
                    Ir para plano free
                </button>
            </span>
        </section>
    </div>
    <div class="selectEditPlanContainer">
        <h2 class="choosePlanTitle">{{ $t("choosePlans.choosePlan") }}</h2>

        <span class="planInformationPayment">
            <span>
                <i class="pi pi-info-circle"></i>
                <h3>
                    <i>{{ $t("choosePlans.weInformYou") }}</i>
                </h3>
            </span>
            <p>{{ $t("choosePlans.informationDetails") }}</p>
        </span>

        <div class="planScrollContainer">
            <section class="planListContainer">
                <div
                    :class="[
                        'planContainer',
                        planInfo.plan_name === 'essential'
                            ? 'selectedPlanContainer'
                            : '',
                    ]"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    <h2>
                        <span v-if="planInfo.plan_name === 'essential'"
                            >({{ $t("choosePlans.current") }}) </span
                        >{{ $t("choosePlans.moreEconomical") }}
                    </h2>

                    <span class="planWrapper">
                        <img
                            src="../../assets/dino_party.png"
                            alt="dino happy"
                        />

                        <h3>{{ $t("choosePlans.essentialPlan") }}</h3>
                        <small>
                            <p>
                                {{ $t("choosePlans.essentialPlanDescription") }}
                            </p>
                            <ul>
                                <li>
                                    <i class="pi pi-check-circle"></i
                                    >{{
                                        $t("choosePlans.essentialDailyTokens")
                                    }}
                                </li>
                                <li>
                                    <i class="pi pi-check-circle"></i
                                    >{{
                                        $t("choosePlans.essentialWeeklyTokens")
                                    }}
                                </li>
                                <li>
                                    <i class="pi pi-check-circle"></i
                                    >{{ $t("choosePlans.essentialHours") }}
                                </li>
                            </ul>
                        </small>

                        <div class="priceContainer">
                            <small>R$</small>
                            <h1>20.0</h1>
                            <small> /{{ $t("choosePlans.month") }}</small>
                        </div>

                        <button
                            type="button"
                            @click="
                                planInfo.plan_name !== 'essential' &&
                                handleEditYourPlan('essential')
                            "
                        >
                            {{ $t("choosePlans.choose") }}
                        </button>
                    </span>
                </div>

                <div
                    :class="[
                        'planContainer',
                        planInfo.plan_name === 'premium'
                            ? 'selectedPlanContainer'
                            : '',
                    ]"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    <h2>
                        <span v-if="planInfo.plan_name === 'premium'"
                            >({{ $t("choosePlans.current") }})
                        </span>
                        {{ $t("choosePlans.moreCompleted") }}
                    </h2>

                    <span class="planWrapper">
                        <img
                            src="../../assets/dino_premium.png"
                            alt="dino happy"
                        />

                        <h3>{{ $t("choosePlans.premiumPlan") }}</h3>
                        <small>
                            <p>
                                {{ $t("choosePlans.premiumPlanDescription") }}
                            </p>
                            <ul>
                                <li>
                                    <i class="pi pi-check-circle"></i
                                    >{{ $t("choosePlans.premiumDailyTokens") }}
                                </li>
                                <li>
                                    <i class="pi pi-check-circle"></i
                                    >{{ $t("choosePlans.premiumWeeklyTokens") }}
                                </li>
                                <li>
                                    <i class="pi pi-check-circle"></i
                                    >{{ $t("choosePlans.premiumHours") }}
                                </li>
                            </ul>
                        </small>

                        <div class="priceContainer">
                            <small>R$</small>
                            <h1>55.0</h1>
                            <small> /{{ $t("choosePlans.month") }}</small>
                        </div>

                        <button
                            type="button"
                            @click="
                                planInfo.plan_name !== 'premium' &&
                                handleEditYourPlan('premium')
                            "
                        >
                            {{ $t("choosePlans.choose") }}
                        </button>
                    </span>
                </div>

                <div
                    :class="[
                        'planContainer',
                        planInfo.plan_name === 'free'
                            ? 'selectedPlanContainer'
                            : '',
                    ]"
                    :data-theme="isDark ? 'dark' : 'light'"
                >
                    <h2>
                        <span v-if="planInfo.plan_name === 'free'"
                            >({{ $t("choosePlans.current") }})
                        </span>
                        {{ $t("choosePlans.demo") }}
                    </h2>

                    <span class="planWrapper">
                        <img
                            src="../../assets/profileDino.png"
                            alt="dino happy"
                        />

                        <h3>{{ $t("choosePlans.freePlan") }}</h3>
                        <small>
                            <p>
                                {{ $t("choosePlans.freePlanDescription") }}
                            </p>
                            <ul>
                                <li>
                                    <i class="pi pi-check-circle"></i
                                    >{{ $t("choosePlans.freeDailyTokens") }}
                                </li>
                                <li>
                                    <i class="pi pi-check-circle"></i
                                    >{{ $t("choosePlans.freeWeeklyTokens") }}
                                </li>
                                <li>
                                    <i class="pi pi-check-circle"></i
                                    >{{ $t("choosePlans.freeHours") }}
                                </li>
                            </ul>
                        </small>

                        <div class="priceContainer">
                            <small>R$</small>
                            <h1>{{ $t("choosePlans.free") }}</h1>
                            <small> /{{ $t("choosePlans.month") }}</small>
                        </div>

                        <button
                            type="button"
                            @click="handleEditYourPlan('free')"
                        >
                            {{ $t("choosePlans.choose") }}
                        </button>
                    </span>
                </div>
            </section>
        </div>
    </div>
</template>

<style
    lang="scss"
    src="../../styles/contents/editplancontent.style.scss"
    scoped
/>
