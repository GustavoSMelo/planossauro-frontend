export const getPrompt = (qsn: string, activity: string): string => {
    const prompt = `
        Contexto (JSON de referência): ${JSON.stringify(qsn)}
        Atividades: ${activity}

        Voce e um professor educador e esta realizando um planejamento de aula
        Tarefa: Com base nos dados acima, gere um JSON estrito.
        Regras:
        1. 'contextualizacao' deve descrever a integração das atividades e o benefício pedagógico, gere de forma resumida mas que aborde todo o conteúdo das atividades.
        2. 'eixo', 'saber', 'aprendizagem' e 'foco_avaliativo' devem ser Arrays, com um item correspondente para cada atividade fornecida.
        3. 'materiais' deve ser uma string única ou lista com os itens necessários, gere apenas os itens que consegue encontrar no dia a dia.

        (Estrutura) Resposta em JSON esperada:
        {
          "contextualizacao": "string",
          "eixo": ["string"],
          "saber": ["string"],
          "aprendizagem": ["string"],
          "foco_avaliativo": ["string"],
          "materiais": "string"
        }

        Respond ONLY with the JSON object`;
    return prompt;
};

export const getPromptEN = (qsn: string, activity: string): string => {
    const prompt = `
        Reference Context (JSON): ${JSON.stringify(qsn)}
        Activities: ${activity}

        Role: You are an expert educator creating a weekly lesson plan.
        Task: Based on the data above, generate a strict JSON object.

        Rules:
        1. 'contextualizacao': Summarize the integration of all activities and their pedagogical benefits. Ensure it covers all provided content concisely.
        2. 'eixo', 'saber', 'aprendizagem', and 'foco_avaliativo': Must be Arrays, with one corresponding item for each provided activity.
        3. 'materiais': A single string or list of required items. Include only everyday, easily accessible materials.

        Expected JSON Structure:
        {
          "contextualizacao": "string",
          "eixo": ["string"],
          "saber": ["string"],
          "aprendizagem": ["string"],
          "foco_avaliativo": ["string"],
          "materiais": "string"
        }

        Respond ONLY with the JSON object`;
    return prompt;
};
