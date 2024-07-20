const { default: mongoose } = require("mongoose");
const GpTaxMasterDataModel = require("../../schema/propertyTax/gpTaxMasterData.schema");
const PropertyTaxesModel = require("../../schema/propertyTax/propertytaxes.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const TaxationPeriodModel = require("../../schema/propertyTax/taxationPeriod.schema");

class PropertyTaxesService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    async getByGpId(gpId) {
        return this.execute(() => {
            return this.model.findOne({ gpId: gpId });
        });
    }

    // async getLandRateForSurveyNumber(gpId, taxationPeriod, SurveyNumbers) {
    //     try {
    //         let query = { displayName: taxationPeriod };
    //         // Fetch the GpTaxMaster data based on the provided gpId and taxationPeriod
    //         const gpTaxMasterData = await TaxationPeriodModel.findOne(query);
    //         let query1 = {
    //             gpId: new mongoose.Types.ObjectId(gpId),
    //             taxationPeriod: new mongoose.Types.ObjectId(
    //                 gpTaxMasterData._id
    //             ),
    //         };
    //         const gpTaxMasterData1 = await GpTaxMasterDataModel.findOne(query1);
    //         if (gpTaxMasterData1) {
    //             // Find the matching SurveyNumber data in the SurveyNumbers array
    //             const matchingSurvey = gpTaxMasterData1.SurveyNumbers.find(
    //                 (item) => item.SurveyNumbers === SurveyNumbers
    //             );
    //             if (matchingSurvey) {
    //                 return matchingSurvey.landRate;
    //             }
    //             //  else {
    //             //     // if (!matchingSurvey) {
    //             //     //     return gpTaxMasterData1.landRate;
    //             //     // }

    //             // }
    //         } else {
    //             console.log(
    //                 "No GpTaxMaster data found with the given gpId and taxationPeriod."
    //             );
    //         }
    //         // Return default values if no match is found
    //         return (
    //             gpTaxMasterData1?.SurveyNumbers?.landRate ||
    //             gpTaxMasterData1?.landRate
    //         );
    //     } catch (err) {
    //         // Handle any error that may occur while fetching the data
    //         console.error("Error while fetching LandRate data:", err);
    //         throw new Error("An error occurred while fetching LandRate data.");
    //     }
    // }
    // async getLandRateForSurveyNumber(
    //     gpId,
    //     taxationPeriod,
    //     SurveyNumbers,
    //     surveyNumberInTextBox
    // ) {
    //     try {
    //         let query = { displayName: taxationPeriod}
    //         console.log("query", query);
    //         // Fetch the GpTaxMaster data based on the provided gpId and taxationPeriod
    //         const gpTaxMasterData = await TaxationPeriodModel.findOne(query)
    //   console.log("GpTaxMasterData", gpTaxMasterData)

    //         let query1 = {
    //             gpId: new mongoose.Types.ObjectId(gpId),
    //             taxationPeriod: new mongoose.Types.ObjectId(
    //                 gpTaxMasterData._id
    //             ),
    //         };
    //         console.log("query1", query1);

    //         const gpTaxMasterData1 = await GpTaxMasterDataModel.findOne(query1);

    //         console.log("query2", gpTaxMasterData)
    //         if (gpTaxMasterData1) {
    //             // Find the matching SurveyNumber data in the SurveyNumbers array
    //             const matchingSurvey = gpTaxMasterData1.SurveyNumbers.find(
    //                 (item) => item.SurveyNumbers === SurveyNumbers
    //             );
    //             let landRateValue = matchingSurvey?.landRate;
    //             if (!landRateValue && SurveyNumbers) {
    //                 // If no exact match is found, try to find the survey number within comma-separated list
    //                 const addedSurveryNumber = SurveyNumbers.split("/")[0];
    //                 gpTaxMasterData1.SurveyNumbers.forEach((s) => {
    //                     let allSurveryNumbers = s.SurveyNumbers.split(",");
    //                     allSurveryNumbers = allSurveryNumbers.map((s) =>
    //                         s.trim()
    //                     );
    //                     console.log(addedSurveryNumber);
    //                     if (
    //                         allSurveryNumbers.indexOf(addedSurveryNumber) > -1
    //                     ) {
    //                         landRateValue = s.landRate;
    //                     }
    //                 });
    //             }

    //             return (

    //                 landRateValue||gpTaxMasterData1.landRate
    //             );
    //         } else {
    //             console.log(
    //                 "No GpTaxMaster data found with the given gpId and taxationPeriod."
    //             );
    //         }

    //         // Return default values if no match is found
    //     } catch (err) {
    //         // Handle any error that may occur while fetching the data
    //         console.error("Error while fetching LandRate data:", err);
    //         throw new Error("An error occurred while fetching LandRate data.");
    //     }
    // }
    async getLandRateForSurveyNumber(
        gpId,
        taxationPeriod,
        SurveyNumbers,
        surveyNumberInTextBox
    ) {
        try {
            let query = { displayName: taxationPeriod };

            // Fetch the GpTaxMaster data based on the provided gpId and taxationPeriod
            const gpTaxMasterData = await TaxationPeriodModel.findOne({
                $or: [
                    { displayName: taxationPeriod },
                    { "splitYears.displayName": taxationPeriod },
                ],
            });
            if (!gpTaxMasterData) {
                console.log(
                    "No GpTaxMaster data found with the given taxationPeriod. Trying to match with splitYears."
                );

                // If GpTaxMaster data not found, try to find matching splitYears object by displayName
                const matchingYear = await TaxationPeriodModel.findOne({
                    "splitYears.displayName": taxationPeriod,
                });

                if (matchingYear) {
                    // If matching splitYears object found, return the landRate from that object
                    const splitYearsMatch = matchingYear.splitYears.find(
                        (year) => year.displayName === taxationPeriod
                    );
                    return splitYearsMatch?.landRate || matchingYear.landRate;
                } else {
                    return "No TaxationPeriodModel data found with the given taxationPeriod.";
                }
            } else {
                let query1 = {
                    gpId: new mongoose.Types.ObjectId(gpId),
                    taxationPeriod: new mongoose.Types.ObjectId(
                        gpTaxMasterData._id
                    ),
                };

                const gpTaxMasterData1 = await GpTaxMasterDataModel.findOne(
                    query1
                );

                if (gpTaxMasterData1) {
                    // Find the matching SurveyNumber data in the SurveyNumbers array
                    const matchingSurvey = gpTaxMasterData1.SurveyNumbers.find(
                        (item) => item.SurveyNumbers === SurveyNumbers
                    );
                    let landRateValue = matchingSurvey?.landRate;

                    if (!landRateValue && SurveyNumbers) {
                        // If no exact match is found, try to find the survey number within comma-separated list
                        const addedSurveryNumber = SurveyNumbers.split("/")[0];
                        gpTaxMasterData1.SurveyNumbers.forEach((s) => {
                            let allSurveryNumbers = s.SurveyNumbers.split(",");
                            allSurveryNumbers = allSurveryNumbers.map((s) =>
                                s.trim()
                            );

                            if (
                                allSurveryNumbers.indexOf(addedSurveryNumber) >
                                -1
                            ) {
                                landRateValue = s.landRate;
                            }
                        });
                    }

                    return landRateValue || gpTaxMasterData1.landRate;
                } else {
                    return "No GpTaxMaster data found with the given gpId and taxationPeriod.";
                }
            }

            // Return default values if no match is found
        } catch (err) {
            // Handle any error that may occur while fetching the data
            console.error("Error while fetching LandRate data:", err);
            throw new Error("An error occurred while fetching LandRate data.");
        }
    }
}

module.exports = new PropertyTaxesService(PropertyTaxesModel, "propertytaxes");
