const splitYearRange = (yearRange) => {
    const [startYear, endYear] = yearRange.split("-");
    const result = [];

    for (let year = parseInt(startYear); year < parseInt(endYear); year++) {
        const nextYear = year + 1;
        const range = {
            from: year,
            to: nextYear,
            displayName: `${year}-${nextYear}`,
        };
        result.push(range);
    }

    return result;
};

module.exports = splitYearRange;
