interface IPlan {
    day1: Array<string>;
    day2: Array<string>;
    day3: Array<string>;
    day4: Array<string>;
    day5: Array<string>;
}

interface IDays {
    days: 'day1' | 'day2' | 'day3' | 'day4' | 'day5'
}

export type { IPlan, IDays };
