import type { AxiosResponse } from "axios";
import type {
    IClassPlanResponse,
    IOllamaGemmaResponse,
} from "../interfaces/ollama.res";

const parseLLMResponse = (rawResponse: string): IClassPlanResponse => {
    let cleaned = rawResponse
        .replace(/\\/g, "")
        .replace(/\n/g, "")
        .replace(/`/g, "")
        .replace(/json/g, "")
        .replace(/-/g, "")
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");

    // Try to parse
    try {
        const parsed = JSON.parse(cleaned);
        return validateAndFillResponse(parsed);
    } catch {
        cleaned = cleaned
            .replace(/(\w+):/g, '"$1":')
            .replace(/'([^']*)'/g, '"$1"')
            .replace(/"\s*:/g, '":')
            .replace(/:\s*"([^"]*?)\s*"/g, ': "$1"');

        try {
            const parsed = JSON.parse(cleaned);
            return validateAndFillResponse(parsed);
        } catch {
            console.error(
                "Failed to parse after cleanup:",
                cleaned.substring(0, 500),
            );
            return getDefaultResponse();
        }
    }
};

const validateAndFillResponse = (parsed: Record<string, unknown>): IClassPlanResponse => {
    const requiredFields = [
        "contextualizacao",
        "aprendizagem01",
        "aprendizagem02",
        "saber01",
        "saber02",
        "eixo",
        "foco_avaliativo",
        "materiais",
    ];

    const response: IClassPlanResponse = {
        contextualizacao: "",
        aprendizagem01: "",
        aprendizagem02: "",
        saber01: "",
        saber02: "",
        eixo: "",
        foco_avaliativo: "",
        materiais: "",
    };

    for (const field of requiredFields) {
        if (parsed[field] && typeof parsed[field] === "string") {
            (response as unknown as Record<string, string>)[field] = parsed[field].trim();
        }
    }

    return response;
};

const getDefaultResponse = (): IClassPlanResponse => {
    return {
        contextualizacao: "Erro ao gerar - resposta inválida",
        aprendizagem01: "Erro ao gerar",
        aprendizagem02: "Erro ao gerar",
        saber01: "Erro ao gerar",
        saber02: "Erro ao gerar",
        eixo: "Erro ao gerar",
        foco_avaliativo: "Erro ao gerar",
        materiais: "Erro ao gerar",
    };
};

const extractResponseData = (
    response: AxiosResponse,
    isLocal: boolean,
): IClassPlanResponse => {
    if (isLocal) {
        const localData = (response.data as IOllamaGemmaResponse).response;
        return parseLLMResponse(localData);
    } else {
        return parseLLMResponse(response.data.message);
    }
};

export { parseLLMResponse, getDefaultResponse, extractResponseData };
