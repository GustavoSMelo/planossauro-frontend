interface ILoadingContext {
    isLoading: {
        value: boolean
    };
    handleChangeIsLoading: (newValue: boolean) => void
}

export type { ILoadingContext };
