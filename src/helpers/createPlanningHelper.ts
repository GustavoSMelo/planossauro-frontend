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
            return getDefaultResponse();
        }
    }
};

const validateAndFillResponse = (
    parsed: Record<string, unknown>,
): IClassPlanResponse => {
    const response: IClassPlanResponse = {
        contextualizacao: "",
        aprendizagem: [],
        saber: [],
        eixo: [],
        foco_avaliativo: [],
        materiais: "",
    };

    if (parsed.contextualizacao && typeof parsed.contextualizacao === "string") {
        response.contextualizacao = parsed.contextualizacao.trim();
    }

    if (parsed.materiais && typeof parsed.materiais === "string") {
        response.materiais = parsed.materiais.trim();
    }

    const arrayFields = ["aprendizagem", "saber", "eixo", "foco_avaliativo"] as const;
    for (const field of arrayFields) {
        if (parsed[field]) {
            if (Array.isArray(parsed[field])) {
                response[field] = parsed[field]
                    .filter((item): item is string => typeof item === "string")
                    .map((item) => item.trim());
            } else if (typeof parsed[field] === "string") {
                response[field] = [parsed[field].trim()];
            }
        }
    }

    return response;
};

const getDefaultResponse = (): IClassPlanResponse => {
    return {
        contextualizacao: "Erro ao gerar - resposta inválida",
        aprendizagem: ["Erro ao gerar"],
        saber: ["Erro ao gerar"],
        eixo: ["Erro ao gerar"],
        foco_avaliativo: ["Erro ao gerar"],
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
