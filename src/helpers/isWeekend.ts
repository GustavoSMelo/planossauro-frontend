const isWeekend = (dateToCheck: string) => {
    const date = new Date(dateToCheck).getDay();

    return date === 5 || date === 6 ? true : false;
};

export { isWeekend };
