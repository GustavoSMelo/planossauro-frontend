import type { IPopup } from "../popup.interface";

interface IPopupContext {
    popup: IPopup
    handleChangePopupInfo: (message: string, status: IPopup['status'], show: boolean) => void,
    handleChangePopupShow: () => void
};

export type { IPopupContext };
