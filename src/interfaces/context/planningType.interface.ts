export interface IPlanningTypeContext {
    planningType: {
        value: "Semanal" | "Diario" | "Contexto";
    };
    handleChangePlanningType: (
        newValue: "Semanal" | "Diario" | "Contexto",
    ) => void;
}
