interface IShowPreview {
    show: boolean;
    showChooseTemplate: 'true' | 'false';
    isCustomDocs: 'true' | 'false';
    customURLDoc: string;
};

interface IShowPreviewContext {
    _value: IShowPreview;
};

export type { IShowPreview, IShowPreviewContext };
