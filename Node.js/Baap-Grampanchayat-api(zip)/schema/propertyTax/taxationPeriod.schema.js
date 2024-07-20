const mongoose = require("mongoose");

const TaxationPeriodSchema = new mongoose.Schema(
    {
        from: {
            type: Number,
            required: true,
        },
        to: {
            type: Number,
            required: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        splitYears: [
            {
                from: {
                    type: Number,
                    required: true,
                },
                to: {
                    type: Number,
                    required: true,
                },
                displayName: {
                    type: String,
                    required: false,
                },
            },
        ],
        taxType: {
            type: String,
            enum: ["Property", "Water", "Retail", "Health", "Light"],
            required: true,
        },
    },
    { timestamps: true }
);

const TaxationPeriodModel = mongoose.model(
    "taxationPeriod",
    TaxationPeriodSchema
);
module.exports = TaxationPeriodModel;

// function splitYearRange(yearRange) {
//     const [startYear, endYear] = yearRange.split('-');
//     const result = [];

//     for (let year = parseInt(startYear); year < parseInt(endYear); year++) {
//       const nextYear = year + 1;
//       const range = {from: year, to: nextYear, displayname : `${year}-${nextYear}`};
//       result.push(range);
//     }

//     return result;
//   }

//   // Example usage:
//   const yearRange = '2022-2026';
//   const yearRanges = splitYearRange(yearRange);
//   console.log(yearRanges);

// let data = {
//     from: "2022",
//     to: "2026",
//     displayName: "2022-2026", // Calculate in API
//     taxType: "Property", //
//     splitYears: [], // calluicate in API
//     __v: 0,
// };

// let ui = {
//     from: "2022",
//     to: "2026",
// };

// ui.displayName = `${ui.from}-${ui.to}`;

// ui.splitYears = splitYearRange(ui.displayName);
