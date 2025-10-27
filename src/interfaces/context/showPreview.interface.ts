interface IShowPreview {
    show: boolean;
    showChooseTemplate: 'true' | 'false';
    isCustomDocs: 'true' | 'false';
    customURLDoc: string;
};

export type { IShowPreview };
