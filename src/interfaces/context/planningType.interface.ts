export interface IPlanningTypeContext {
    planningType: {
        value: "Semanal" | "Diario";
    };
    handleChangePlanningType: (newValue: "Semanal" | "Diario") => void;
}
