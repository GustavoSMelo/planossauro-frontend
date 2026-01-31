interface IPlan {
    amount_planning_day: number;
    amount_planning_week: number;
    plan_name: string;
    uuid: string;
    price: number;
}

interface ISubscription {
    uuid: string;
    daily_plans_used: number;
    weekly_plans_used: number;
    date_verified: Date | string | null;
    next_billing: Date | string | null;
    plans_id: IPlan['uuid'];
    status: 'Ativo' | 'Cancelado' | 'Processando' | 'Pagamento falho' | 'Pago';
    user_id: string;
    last_four_digits: number;
}

export { type ISubscription, type IPlan };
