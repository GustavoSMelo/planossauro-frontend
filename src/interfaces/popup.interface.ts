interface IPopup {
    message: string;
    status: 'error' | 'success' | 'info' | 'warning';
    show: boolean;
    id: number | string;
}

export type { IPopup };
