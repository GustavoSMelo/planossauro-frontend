export const getPrompt = (qsn: string, activity: string): string => {
    const prompt = `
                    -- ${JSON.stringify(qsn)}
                    -- atividades: ${activity}
                    -- baseado no json e nas atividades que lhe enviei, gere uma resposta apenas em formato json as seguintes informacoes:
                    contexto: gere o contexto da aula com todas as atividades de forma corrida, descreva como a atividade vai auxiliar na educacao do educando
                    eixo: identifique qual o melhor eixo baseado no json fornecido, cada atividade devera ter seu proprio eixo
                    saber: identifique qual o melhor saber que se encaixa nessa aula com base no eixo, cada atividade devera ter seu proprio saber
                    aprendizagem: identifique qual a melhor aprendizagem que se encaixa nessa aula com base no saber, cada atividade devera ter sua propria aprendizagem
                    foco_avaliativo: faca uma pergunta de nota mental para o educador que se encaixa dentro do contexto dessa aula, cada atividade devera ter seu proprio foco
                    materiais: identifique os materiais que foram utilizados nessa aula

                    a resposta deve ser exatamente essa, nao gere texto a mais ou a menos: {
                        contextualizacao: resposta,
                        eixo: resposta(Array<string>)
                        saber: resposta (Array<string>),
                        aprendizagem: resposta (Array<string>),
                        foco_avaliativo: resposta(Array<string>),
                        materiais: resposta
                    }
                    `;
    return prompt;
};

export const getPromptEN = (qsn: string, activity: string): string => {
    const prompt = `
                    -- ${JSON.stringify(qsn)}
                    -- activities: ${activity}
                    -- based on the json and the activities I sent you, generate a response only in json format with the following information:
                    context: generate the lesson context with all the activities in a continuous way, describe how the activity will assist in the learner's education
                    axis: identify which is the best axis based on the provided json
                    knowledge: identify which is the best knowledge that fits into this lesson based on the axis
                    knowledge2: identify another best knowledge that fits into this lesson based on the axis
                    learning: identify which is the best learning that fits into this lesson based on the knowledge
                    learning2: identify which is the best learning that fits into this lesson based on the knowledge2
                    evaluative_focus: ask a mental note question for the educator that fits within the context of this lesson
                    materials: identify the materials that were used in this lesson

                    the response must be exactly like this, do not generate more or less text: {
                        contextualizacao: answer,
                        eixo: answer (string)
                        saber01: answer (string),
                        saber02: answer (string),
                        aprendizagem01: answer (string),
                        aprendizagem02: answer (string),
                        foco_avaliativo: answer (string),
                        materiais: answer (string)
                    }
                    `;
    return prompt;
};
