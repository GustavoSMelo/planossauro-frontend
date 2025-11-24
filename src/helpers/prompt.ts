const getPrompt = (qsn: string, activity: string): string => {
    const prompt = `
                    -- ${JSON.stringify(qsn)}
                    -- atividades: ${activity}
                    -- baseado no json e nas atividades que lhe enviei, gere uma resposta apenas em formato json as seguintes informacoes:
                    contexto: gere o contexto da aula com todas as atividades de forma corrida, descreva como a atividade vai auxiliar na educacao do educando
                    eixo: identifique qual o melhor eixo baseado no json fornecido
                    saber: identifique qual o melhor saber que se encaixa nessa aula com base no eixo
                    saber2: identifique outro saber qual o melhor saber que se encaixa nessa aula com base no eixo
                    aprendizagem: identifique qual a melhor aprendizagem que se encaixa nessa aula com base no saber
                    aprendizagem: identifique qual a melhor aprendizagem que se encaixa nessa aula com base no saber2
                    foco_avaliativo: faca uma pergunta de nota mental para o educador que se encaixa dentro do contexto dessa aula
                    materiais: identifique os materiais que foram utilizados nessa aula

                    a resposta deve ser exatamente essa, nao gere texto a mais ou a menos: {
                        contextualizacao: resposta,
                        eixo: resposta
                        saber01: resposta,
                        saber02: resposta,
                        aprendizagem01: resposta,
                        aprendizagem02: resposta,
                        foco_avaliativo: resposta,
                        materiais: resposta
                    }
                    `;
    return prompt;
};

export default getPrompt;
