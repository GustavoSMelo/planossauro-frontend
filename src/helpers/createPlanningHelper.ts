import type { AxiosResponse } from "axios";
import type {
    IClassPlanResponse,
    IOllamaGemmaResponse,
} from "../interfaces/ollama.res";

const parseLLMResponse = (rawResponse: string, fallbackMessage?: string): IClassPlanResponse => {
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
        return validateAndFillResponse(parsed, fallbackMessage);
    } catch {
        cleaned = cleaned
            .replace(/(\w+):/g, '"$1":')
            .replace(/'([^']*)'/g, '"$1"')
            .replace(/"\s*:/g, '":')
            .replace(/:\s*"([^"]*?)\s*"/g, ': "$1"');

        try {
            const parsed = JSON.parse(cleaned);
            return validateAndFillResponse(parsed, fallbackMessage);
        } catch {
            return getDefaultResponse(fallbackMessage);
        }
    }
};

const validateAndFillResponse = (
    parsed: Record<string, unknown>,
    fallbackMessage?: string,
): IClassPlanResponse => {
    const msg = fallbackMessage ?? "Not possible to return this value";
    const response: IClassPlanResponse = {
        contextualizacao: msg,
        aprendizagem: [msg],
        saber: [msg],
        eixo: [msg],
        foco_avaliativo: [msg],
        materiais: msg,
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

const getDefaultResponse = (fallbackMessage = "Not possible to return this value"): IClassPlanResponse => {
    return {
        contextualizacao: fallbackMessage,
        aprendizagem: [fallbackMessage],
        saber: [fallbackMessage],
        eixo: [fallbackMessage],
        foco_avaliativo: [fallbackMessage],
        materiais: fallbackMessage,
    };
};

const extractResponseData = (
    response: AxiosResponse,
    isLocal: boolean,
    fallbackMessage?: string,
): IClassPlanResponse => {
    if (isLocal) {
        const localData = (response.data as IOllamaGemmaResponse).response;
        return parseLLMResponse(localData, fallbackMessage);
    } else {
        return parseLLMResponse(response.data.message, fallbackMessage);
    }
};

export { parseLLMResponse, getDefaultResponse, extractResponseData };
