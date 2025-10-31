interface ITemplateChoose {
    choosed: boolean;
    templateStyle: 1 | 2 | 3 | 4 | 5 | 6;
    templateType: 'Semanal' | 'Diario';
};

interface ITemplateChooseContext {
    handleChangeTemplateChoose: (newTemplateChoose: ITemplateChoose) => void;
    templateChoose: ITemplateChoose;
}

export type { ITemplateChooseContext, ITemplateChoose };
