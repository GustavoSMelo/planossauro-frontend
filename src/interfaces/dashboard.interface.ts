interface IDashboard {
    max_amount_planning_week: number;
    max_amount_planning_daily: number;
    used_weekly_planning: number;
    used_daily_planning: number;
    current_plan: string;
    subscription_id: string;
    plan_id: string;
}

export { type IDashboard };
