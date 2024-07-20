const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../../services/propertyTax/propertytaxes.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");
const moment = require("moment");
const ConstructionTypeModel = require("../../schema/propertyTax/constructionType.schema");
const GpConstructionTypeModel = require("../../schema/propertyTax/gpConstructionType.schema");
const { default: mongoose } = require("mongoose");
const GpWaterGeneralTaxModel = require("../../schema/propertyTax/gpWaterGeneralTax.schema");
const GpPrivateWaterTaxModel = require("../../schema/propertyTax/gpPrivateWaterTax.schema");
// const PrivateWaterTaxModel = require("../../schema/propertyTax/gpPrivateWaterTax.schema");
const GpHealthTaxModel = require("../../schema/propertyTax/gpHealthTax.schema");
const GpLightTaxModel = require("../../schema/propertyTax/gpLightTax.schema");
const PropertiesModel = require("../../schema/propertyTax/properties.schema");
const TaxationPeriodModel = require("../../schema/propertyTax/taxationPeriod.schema");

router.post(
    "/",
    checkSchema(require("../../dto/propertyTax/propertytaxes.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const {
            gpId,
            buildingYear,
            constructionId,
            taxationPeriod,
            length,
            width,
            SurveyNumbers,
            readyReckonerRate,
            weightages,
            houseTaxdiscount,
            lightTaxdiscount,
            healthTaxdiscount,
            waterTaxdiscount,
            gpPrivateWaterTax,
            gpWaterTaxValue,
            isWaterConnection,
            houseTaxRemainingAmount,
            lightTaxRemainingAmount,
            healthTaxRemainingAmount,
            waterTaxRemainingAmount,
        } = req.body;

        try {
            // Save the data from the POST request
            const serviceResponse = await service.create(req.body);

            // Fetch the construction data based on the provided constructionId
            const constructionData = await ConstructionTypeModel.findById(
                constructionId
            ).exec();
            if (!constructionData) {
                throw new Error(
                    "Construction data not found for the provided constructionId."
                );
            }
            // Find the matched depreciation based on the provided buildingYear
            const remainingYears = new Date().getFullYear() - buildingYear;
            const matchedDepreciation = constructionData.depreciation.find(
                (depreciationRange) => {
                    return (
                        remainingYears >= depreciationRange.yearsFrom &&
                        remainingYears <= depreciationRange.yearsTo
                    );
                }
            );
            if (!matchedDepreciation) {
                throw new Error(
                    "Depreciation data not found for the provided buildingYear."
                );
            }
            // Perform area calculations
            const areaInMeterValue = 10.764;
            const areaOfFeet = length * width;
            const areaOfMeter = areaOfFeet / areaInMeterValue;
            // Fetch LandRate for the provided SurveyNumbers and GpId
            const landRate = await service.getLandRateForSurveyNumber(
                gpId,
                req.body.taxationPeriod,
                SurveyNumbers
            );
            // If landRate is not found, set it to 0
            const landRateValue = landRate || 0;
            const landCapitalValue = areaOfMeter * landRateValue;
            const buildingCapitalRate =
                areaOfMeter *
                readyReckonerRate *
                matchedDepreciation.value *
                weightages;

            const TotalCapital = landCapitalValue + buildingCapitalRate;

            // Fetch tax value for the provided constructionId from gpconstruction table
            let taxValue = 0;
            const gpConstructionData = await GpConstructionTypeModel.findOne({  
                "tax.type": constructionId,
            }).exec();

            if (gpConstructionData) {
                const matchingTax = gpConstructionData.tax.find((taxItem) =>
                    taxItem.type.equals(constructionId)
                );

                if (matchingTax) {
                    taxValue = matchingTax.value;
                }
            }
            // Calculate propertyTax
            const PropertyTax = (TotalCapital * taxValue) / 1000;

            // Find matching GPWaterGeneralTax based on gpId and taxationPeriod
            // let gpWaterGeneralTaxValue = 0;
            // if (
            //     (req.body.subTaxType =
            //         "private" || req.body.gpPrivateWaterTax !== undefined)
            // ) {
            //     let gpPrivateWaterTax = 0;
            //     const matchingGpPrivateWaterTax =
            //         await TaxationPeriodModel.findOne({
            //             $or: [
            //                 { displayName: taxationPeriod, taxType: "Water" },
            //                 {
            //                     "splitYears.displayName": taxationPeriod,
            //                     taxType: "Water",
            //                 },
            //             ],
            //         });
            //     console.log(
            //         "matchingGpPrivateWaterTax",
            //         matchingGpPrivateWaterTax,
            //         gpPrivateWaterTax
            //     );

            //     if (matchingGpPrivateWaterTax) {
            //         const query1 = {
            //             gpId: new mongoose.Types.ObjectId(gpId),
            //             taxationPeriod: new mongoose.Types.ObjectId(
            //                 matchingGpPrivateWaterTax._id
            //             ),
            //         };
            //         console.log("query1", query1);
            //         const matchingGpPrivateWaterTax1 =
            //             await gpPrivateWaterTaxModel.findOne(query1);

            //         if (matchingGpPrivateWaterTax1) {
            //             // Check if areaOfFeet falls within the specified range
            //             const matchedTax = matchingGpPrivateWaterTax1.tax.find(
            //                 (taxItem) =>
            //                     areaOfFeet >= taxItem.type.propertyArea.min &&
            //                     areaOfFeet <= taxItem.type.propertyArea.max
            //             );
            //             console.log(
            //                 "matchingGpPrivateWaterTax1",
            //                 matchingGpPrivateWaterTax1
            //             );
            //             if (matchedTax) {
            //                 gpPrivateWaterTax = matchedTax.value;
            //             }
            //             console.log("matchedTax", matchedTax);
            //         }
            //         console.log(
            //             "gpWaterGeneralTaxValue = " + gpWaterGeneralTaxValue
            //         );
            //         console.log(matchingGpWaterGeneralTax1);
            //     }
            // } else {
            //     let gpWaterGeneralTaxValue = 0;
            //     const matchingGpWaterGeneralTax =
            //         await TaxationPeriodModel.findOne({
            //             $or: [
            //                 { displayName: taxationPeriod, taxType: "Water" },
            //                 {
            //                     "splitYears.displayName": taxationPeriod,
            //                     taxType: "Water",
            //                 },
            //             ],
            //         });

            //     if (matchingGpWaterGeneralTax) {
            //         const query1 = {
            //             gpId: new mongoose.Types.ObjectId(gpId),
            //             taxationPeriod: new mongoose.Types.ObjectId(
            //                 matchingGpWaterGeneralTax._id
            //             ),
            //         };
            //         const matchingGpWaterGeneralTax1 =
            //             await GpWaterGeneralTaxModel.findOne(query1);
            //         if (matchingGpWaterGeneralTax1) {
            //             // Check if areaOfFeet falls within the specified range
            //             const matchedTax = matchingGpWaterGeneralTax1.tax.find(
            //                 (taxItem) =>
            //                     areaOfFeet >= taxItem.type.propertyArea.min &&
            //                     areaOfFeet <= taxItem.type.propertyArea.max
            //             );

            //             if (matchedTax) {
            //                 gpWaterGeneralTaxValue = matchedTax.value;
            //             }
            //         }
            //         console.log(
            //             "gpWaterGeneralTaxValue = " + gpWaterGeneralTaxValue
            //         );
            //         console.log(matchingGpWaterGeneralTax1);
            //     }
            // }
            // Initialize gpWaterGeneralTaxValue outside of the condition
            // let gpWaterTaxValue = 0;

            // if (
            //     req.body.subTaxType === "Private" ||
            //     req.body.gpPrivateWaterTax !== undefined
            // ) {
            //     const matchingGpPrivateWaterTax =
            //         await TaxationPeriodModel.findOne({
            //             $or: [
            //                 { displayName: taxationPeriod, taxType: "Water" },
            //                 {
            //                     "splitYears.displayName": taxationPeriod,
            //                     taxType: "Water",
            //                 },
            //             ],
            //         });

            //     if (matchingGpPrivateWaterTax) {
            //         const query1 = {
            //             gpId: new mongoose.Types.ObjectId(gpId),
            //             taxationPeriod: new mongoose.Types.ObjectId(
            //                 matchingGpPrivateWaterTax._id
            //             ),
            //         };

            //         const matchingGpPrivateWaterTax1 =
            //             await GpPrivateWaterTaxModel.findOne(query1);
            //         if (matchingGpPrivateWaterTax1) {
            //             const matchedTax = matchingGpPrivateWaterTax1.tax.find(
            //                 (taxItem) => {
            //                     const taxItemId = taxItem.type?._id;

            //                     if (
            //                         req.body.gpPrivateWaterTax ==
            //                         new mongoose.Types.ObjectId(taxItemId)
            //                     ) {
            //                         return true;
            //                     }

            //                     return false;
            //                 }
            //             );

            //             if (matchedTax) {
            //                 gpWaterTaxValue = matchedTax.value;
            //             }
            //         }
            //     }
            // } else {
            //     const matchingGpWaterGeneralTax =
            //         await TaxationPeriodModel.findOne({
            //             $or: [
            //                 { displayName: taxationPeriod, taxType: "Water" },
            //                 {
            //                     "splitYears.displayName": taxationPeriod,
            //                     taxType: "Water",
            //                 },
            //             ],
            //         });

            //     if (matchingGpWaterGeneralTax) {
            //         const query1 = {
            //             gpId: new mongoose.Types.ObjectId(gpId),
            //             taxationPeriod: new mongoose.Types.ObjectId(
            //                 matchingGpWaterGeneralTax._id
            //             ),
            //         };
            //         const matchingGpWaterGeneralTax1 =
            //             await GpWaterGeneralTaxModel.findOne(query1);
            //         if (matchingGpWaterGeneralTax1) {
            //             // Check if areaOfFeet falls within the specified range
            //             const matchedTax = matchingGpWaterGeneralTax1.tax.find(
            //                 (taxItem) =>
            //                     areaOfFeet >= taxItem.type.propertyArea.min &&
            //                     areaOfFeet <= taxItem.type.propertyArea.max
            //             );

            //             if (matchedTax) {
            //                 gpWaterTaxValue = matchedTax.value;
            //             }
            //         }
            //     }

            //     // console.log("gpWaterGeneralTaxValue = " + gpWaterGeneralTaxValue);
            // }

            // ...

            // Find matching GPHealthTax based on gpId and taxationPeriod
            let gpHealthTaxValue = 0;
            const matchingGpHealthTax = await TaxationPeriodModel.findOne({
                $or: [
                    { displayName: taxationPeriod, taxType: "Health" },
                    {
                        "splitYears.displayName": taxationPeriod,
                        taxType: "Health",
                    },
                ],
            });

            if (matchingGpHealthTax) {
                const healthQuery1 = {
                    gpId: new mongoose.Types.ObjectId(gpId),
                    taxationPeriod: new mongoose.Types.ObjectId(
                        matchingGpHealthTax._id
                    ),
                };

                const matchingGpHealthTax1 = await GpHealthTaxModel.findOne(
                    healthQuery1
                );
                if (matchingGpHealthTax1) {
                    // Check if areaOfFeet falls within the specified range
                    const matchedTax = matchingGpHealthTax1.tax.find(
                        (taxItem) =>
                            areaOfFeet >= taxItem.type.propertyArea.min &&
                            areaOfFeet <= taxItem.type.propertyArea.max
                    );

                    if (matchedTax) {
                        gpHealthTaxValue = matchedTax.value;
                    }
                }
            }
            let gpLightTaxValue = 0;
            const matchingGpLightTax = await TaxationPeriodModel.findOne({
                $or: [
                    { displayName: taxationPeriod, taxType: "Light" },
                    {
                        "splitYears.displayName": taxationPeriod,
                        taxType: "Light",
                    },
                ],
            });

            if (matchingGpLightTax) {
                const lightQuery1 = {
                    gpId: new mongoose.Types.ObjectId(gpId),
                    taxationPeriod: new mongoose.Types.ObjectId(
                        matchingGpLightTax._id
                    ),
                };

                const matchingGpLightTax1 = await GpLightTaxModel.findOne(
                    lightQuery1
                );
                if (matchingGpLightTax1) {
                    // Check if areaOfFeet falls within the specified range
                    const matchedTax = matchingGpLightTax1.tax.find(
                        (taxItem) =>
                            areaOfFeet >= taxItem.type.propertyArea.min &&
                            areaOfFeet <= taxItem.type.propertyArea.max
                    );

                    if (matchedTax) {
                        gpLightTaxValue = matchedTax.value;
                    }
                }
            }

            FloorTotalTax =
                parseInt(PropertyTax) +
                parseInt(gpHealthTaxValue) +
                parseInt(gpLightTaxValue) +
                (isWaterConnection == true ? parseInt(gpWaterTaxValue) : 0);

            //tax summary
            const houseTaxTotal = PropertyTax + houseTaxRemainingAmount;
            const lightTaxTotal = gpLightTaxValue + lightTaxRemainingAmount;
            const healthTaxTotal = gpHealthTaxValue + healthTaxRemainingAmount;
            const waterTaxTotal =
                (isWaterConnection == true ? parseInt(gpWaterTaxValue) : 0) +
                (isWaterConnection == true
                    ? parseInt(waterTaxRemainingAmount)
                    : 0);

            const houseTaxDiscount = (houseTaxTotal * houseTaxdiscount) / 100;
            const lightTaxDiscount = (lightTaxTotal * lightTaxdiscount) / 100;
            const healthTaxDiscount =
                (healthTaxTotal * healthTaxdiscount) / 100;
            const waterTaxDiscount = (waterTaxTotal * waterTaxdiscount) / 100;

            //total Tax Summary Calculation

            const totalHouseTaxSummary = houseTaxTotal - houseTaxDiscount;

            const totalLightTaxSummary = lightTaxTotal - lightTaxDiscount;

            const totalHealthTaxSummary = healthTaxTotal - healthTaxDiscount;

            const totalWaterTaxSummary = waterTaxTotal - waterTaxDiscount;
            //original calculation with out round of
            // const response = {
            //     status: "Success",
            //     gpId: gpId,
            //     ...serviceResponse,
            //     remainingYears: new Date().getFullYear() - buildingYear,
            //     tax: constructionData.tax,
            //     type: constructionData.type,
            //     constructionRatePerSqMeter:
            //         constructionData.constructionRatePerSqMeter,
            //     depreciation: matchedDepreciation,
            //     taxationPeriod: constructionData.taxationPeriod,
            //     areaOfFeet: areaOfFeet,
            //     areaOfMeter: areaOfMeter,
            //     landRateValue: landRateValue, // Updated to use landRateValue
            //     landCapitalValue: landCapitalValue,
            //     buildingCapitalRate: buildingCapitalRate,
            //     TotalCapital: TotalCapital,
            //     TotalTax: taxValue,
            //     PropertyTax: PropertyTax,
            //     // WaterTax
            //     WaterTax: gpWaterGeneralTaxValue,
            //     // HealthTax
            //     HealthTax: gpHealthTaxValue,
            //     // LightTax
            //     LightTax: gpLightTaxValue,
            //     //totalTax
            //     FloorTotalTax: FloorTotalTax,
            //     //tax summary
            //     totalHouseTaxSummary: totalHouseTaxSummary,
            //     totalLightTaxSummary: totalLightTaxSummary,
            //     totalHealthTaxSummary: totalHealthTaxSummary,
            //     totalWaterTaxSummary: totalWaterTaxSummary,
            // };
            const response = {
                status: "Success",
                gpId: gpId,
                ...serviceResponse,
                remainingYears: new Date().getFullYear() - buildingYear,
                tax: constructionData.tax,
                type: constructionData.type,
                constructionRatePerSqMeter:
                    constructionData.constructionRatePerSqMeter,
                depreciation: matchedDepreciation,
                taxationPeriod: constructionData.taxationPeriod,
                areaOfFeet: Math.ceil(parseFloat(areaOfFeet)),
                areaOfMeter: Math.ceil(parseFloat(areaOfMeter)),
                landRateValue: Math.round(landRateValue),
                landCapitalValue: Math.ceil(parseFloat(landCapitalValue)),
                buildingCapitalRate: parseFloat(buildingCapitalRate).toFixed(2),
                TotalCapital: parseFloat(TotalCapital).toFixed(2),
                TotalTax: parseFloat(taxValue).toFixed(2),
                PropertyTax: parseFloat(PropertyTax).toFixed(2),
                WaterTax: Math.ceil(
                    isWaterConnection == true ? parseInt(gpWaterTaxValue) : 0
                ),
                // a:gpPrivateWaterTaxValue,
                HealthTax: Math.ceil(gpHealthTaxValue),
                LightTax: Math.ceil(gpLightTaxValue),
                FloorTotalTax: Math.ceil(FloorTotalTax),
                totalHouseTaxSummary:
                    parseFloat(totalHouseTaxSummary).toFixed(2),
                totalLightTaxSummary:
                    parseFloat(totalLightTaxSummary).toFixed(2),
                totalHealthTaxSummary: parseFloat(
                    totalHealthTaxSummary
                ).toFixed(2),
                totalWaterTaxSummary: Math.round(totalWaterTaxSummary),
            };

            requestResponsehelper.sendResponse(res, response);
        } catch (err) {
            console.error("Error while fetching data:", err);
            requestResponsehelper.sendResponse(
                res,
                {
                    error:
                        err.message || "An error occurred while fetching data.",
                },
                500
            );
        }
    }
);
router.post(
    "/getPropertyData",
    checkSchema(require("../../dto/propertyTax/propertytaxes.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const { gpId, propertyId } = req.body;
        const propertyData = await PropertiesModel.findOne({
            gpId: new mongoose.Types.ObjectId(gpId),
            _id: new mongoose.Types.ObjectId(propertyId),
        });
        if (!propertyData) {
            // Return error response if data not found
            return res.status(404).json({ error: "Property data not found" });
        }
        //areaOfFeet Total
        let areaOfFeet = 0;
        propertyData.floors.forEach((element) => {
            if (element.areaOfFeet) {
                areaOfFeet = areaOfFeet + element.areaOfFeet;
            }
            return areaOfFeet;
        });
        //areaOfMeter total
        let areaOfMeter = 0;
        propertyData.floors.forEach((element) => {
            if (element.areaOfMeter) {
                areaOfMeter = areaOfMeter + element.areaOfMeter;
            }
            return areaOfMeter;
        });

        //healthTax
        // let healthTaxTotal = 0;
        // propertyData.floors.forEach((element) => {
        //     if (element.healthTax) {
        //         healthTaxTotal = healthTaxTotal + element.healthTax;
        //     }
        //     return healthTaxTotal;
        // });

        // //lightTax
        // let lightTaxTotal = 0;
        // propertyData.floors.forEach((element) => {
        //     if (element.lightTax) {
        //         lightTaxTotal = lightTaxTotal + element.lightTax;
        //     }
        //     return lightTaxTotal;
        // });
        // Send response with updated data
        res.json({
            data: propertyData,
            propertyTaxTotal: areaOfFeet,
            waterTaxTotal: areaOfMeter,

            message: "Propert fetched successfully",
        });
    }
);

router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/:id", async (req, res) => {
    const serviceResponse = await service.updateById(req.params.id, req.body);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/find/:gpId/", async (req, res) => {
    try {
        const areaInMeterValue = 10.764;
        // Fetch the data for the specified gpId and constructionType
        const data = await service.getByGpId(req.params.gpId);
        // Calculate the area using the formula
        const length = data.data.length;
        const width = data.data.width;
        const areaOfFeet = length * width;
        const areaOfMeter = areaOfFeet / areaInMeterValue;
        const landRateValue = areaOfMeter * data.data.landRate;

        res.status(200).json({
            status: "success",
            gpId: data.data.gpId,
            areaOfFeet: areaOfFeet,
            areaOfMeter: areaOfMeter,
            landRateValue: landRateValue,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
});

router.get("/all/PropertyTaxes", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
