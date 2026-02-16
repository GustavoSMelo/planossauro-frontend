export interface IPaymentHistoryData {
    uuid: string;
    payment_date: string;
    description: string;
    card_brand: string;
    last_four_digits: number;
    price: number;
    status: string;
    NFe: string;
    plan_id: string;
    user_id: string;
}

export interface IPaymentHistory {
    payments: Array<IPaymentHistoryData>;
}
