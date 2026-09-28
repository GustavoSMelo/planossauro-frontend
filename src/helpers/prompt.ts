export const getContextWeeklyPrompt = (
    qsn: string,
    context: string,
    countPerDay: number,
): string => {
    const prompt = `
        Contexto (JSON de referência - QSN): ${JSON.stringify(qsn)}
        Contexto da aula semanal: "${context}"
        Quantidade de aulas por dia: ${countPerDay}

        Você é um professor educador especialista em educação infantil de criancas de 4 a 5 anos (BNCC/QSN).
        Tarefa: Com base no contexto da turma e no QSN, gere exatamente ${countPerDay} atividades para CADA um dos 5 dias (day1 a day5).

        Regras:
        1. Cada atividade deve ser string única de 10 a 25 palavras, clara, prática e adequada para educação infantil de criancas de 4 a 5 anos.
        2. Atividades diversificadas, lúdicas e coerentes com o contexto; progrida levemente de day1 a day5.
        3. Alinhe implicitamente a eixos/saberes do QSN sem citar QSN.
        4. Não use vírgulas nas atividades.
        5. Não inclua numeração.

        Resposta esperada em JSON estrito:
        {
          "day1": ["atividade 1", ...],
          "day2": ["atividade 1", ...],
          "day3": ["atividade 1", ...],
          "day4": ["atividade 1", ...],
          "day5": ["atividade 1", ...]
        }

        atividades fixas:
        - todo dia fixo (qualquer horario): roda de conversa
        - todo dia fixo (qualquer horario): roda de musica (sobre o tema da semana)
        - todo dia fixo (13:00 as 14:00): acolhimento, higiene, cafe e combinados
        - toda segunda feira (day1): parque as 14horas
        - toda sexta feira (day5): parque as 14horas
        - toda quarta feira (day3): quadra
        - todo dia fixo as 16:45 ate 17:00: jantar

        atividades possiveis:
        - solario
        - brincadeira livre
        - brincadeira de peteca
        - brincadeira de mimica
        - brincadeira de roda
        - brincadeira de caca ao tesouro
        - brincadeira de exploracao da natureza
        - desenho guiado sobre o tema da semana
        - brincadeira guiadas sobre o tema da semana
        - brincadeira de advinha
        - momento da historia (historias infantis de acordo com o tema proposto)
        - momento de video
        - brincadeira com slime
        - brincadeira com brinquedos pedagogicos
        - brincadeira de casinha
        - recorte e colagem
        - desenho livre
        - chamada viva
        - contagem de numeros de zero a 10

        Nao saia dessas atividades que citei anteriormente, ao menos que esteja injetado dentro do prompt, pode repitir atividades durante os dias da semana
        Nao gere textos com jargoes em ingles nem nada do genero, nao utilize interacoes nem nada relacionado a libras, todos os materiais devem ser possiveis de encontrar em sala de aula ou em uma escola de baixa renda
        Gere exatamente ${countPerDay} itens em cada array day1..day5.
        Responda SOMENTE com JSON válido.`;
    return prompt;
};

export const getContextWeeklyPromptEN = (
    qsn: string,
    context: string,
    countPerDay: number,
): string => {
    const prompt = `
        Reference Context (QSN JSON): ${JSON.stringify(qsn)}
        Class/Teacher Context: "${context}"
        Number of lessons per day: ${countPerDay}

        You are an expert early childhood educator (aligned with BNCC/QSN).
        Task: Based on class context and QSN, generate exactly ${countPerDay} activities for EACH of 5 days (day1 to day5).

        Rules:
        1. Each activity must be single string 10-25 words, clear, practical for early childhood.
        2. Activities diverse, playful, coherent with context; progress slightly from day1 to day5.
        3. Implicitly align to QSN axes without mentioning QSN.
        4. Do not use commas.
        5. No numbering.

        Expected strict JSON response:
        {
          "day1": ["activity 1", ...],
          "day2": ["activity 1", ...],
          "day3": ["activity 1", ...],
          "day4": ["activity 1", ...],
          "day5": ["activity 1", ...]
        }

        Generate exactly ${countPerDay} items in each array day1..day5.
        Respond ONLY with valid JSON.`;
    return prompt;
};

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
