import type { IDays } from "../interfaces/planning.interface";

const dayConverter = (day: IDays['days']) => {
    switch (day) {
        case "day1":
            return 'Segunda';
        case "day2":
            return "Terca";
        case "day3":
            return "Quarta";
        case "day4":
            return "Quinta";
        case "day5":
            return "Sexta";
        default:
            return 'Segunda';
    }
};

export default dayConverter;
