interface IPopup {
    message: string;
    status: 'error' | 'success' | 'info' | 'warning';
    show: boolean;
}

export type { IPopup };
