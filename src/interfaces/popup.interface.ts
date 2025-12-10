interface IPopup {
    message: string;
    status: 'error' | 'success' | 'info' | 'warning';
    show: boolean;
    id: any;
}

export type { IPopup };
