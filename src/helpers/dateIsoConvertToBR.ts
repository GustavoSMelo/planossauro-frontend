const convertIsoDateToBR = (isoDate: string) => {
    const separeteDate = isoDate.split('T')[0];
    const [year, month, day] = separeteDate.split('-');

    return `${day}/${month}/${year}`;
};

export default convertIsoDateToBR;
