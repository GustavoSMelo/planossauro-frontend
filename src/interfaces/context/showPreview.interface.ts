interface IShowPreview {
    show: boolean;
    showChooseTemplate: 'true' | 'false';
    isCustomDocs: 'true' | 'false';
    customURLDoc: string;
};

interface IShowPreviewContext  {
    showPreview: IShowPreview;
    handleChangeShowPreview: (newShowPreview: IShowPreview) => void;
}

export type { IShowPreview, IShowPreviewContext };
