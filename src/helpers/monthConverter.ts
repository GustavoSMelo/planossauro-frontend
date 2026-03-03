import i18n from "../i18n";

const monthConverter = (monthInNumber: number | string): string => {
    const { t } = i18n.global;

    switch (monthInNumber.toString()) {
        case "01":
            return t("months.january");
        case "02":
            return t("months.february");
        case "03":
            return t("months.march");
        case "04":
            return t("months.april");
        case "05":
            return t("months.may");
        case "06":
            return t("months.june");
        case "07":
            return t("months.july");
        case "08":
            return t("months.august");
        case "09":
            return t("months.september");
        case "10":
            return t("months.october");
        case "11":
            return t("months.november");
        case "12":
            return t("months.dezember");
        default:
            return monthInNumber.toString();
    }
};

export default monthConverter;
