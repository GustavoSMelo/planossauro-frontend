interface IOllamaGemmaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    total_duration: number;
}

interface IClassPlanResponse {
    contextualizacao: string;
    aprendizagem: Array<string>;
    saber: Array<string>;
    eixo: Array<string>;
    foco_avaliativo: Array<string>;
    materiais: string;
}

export type { IOllamaGemmaResponse, IClassPlanResponse };
