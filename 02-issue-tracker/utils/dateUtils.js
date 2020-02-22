const addDays = (source, days) => {
    const date = new Date(Number(source));

    date.setDate(source.getDate() + days);

    return date;
}

const getTomorrowDate = (source) => addDays(source, 1);

exports.getTomorrowDate = getTomorrowDate;