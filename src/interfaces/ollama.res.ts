interface IOllamaGemmaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    total_duration: number;
}

interface IClassPlanResponse {
    contextualizacao: string;
    aprendizagem01: string;
    aprendizagem02: string;
    saber01: string;
    saber02: string;
    eixo: string;
    foco_avaliativo: string;
    materiais: string;
}

export type { IOllamaGemmaResponse, IClassPlanResponse };
