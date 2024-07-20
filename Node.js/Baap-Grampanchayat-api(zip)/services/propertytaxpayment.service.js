const { default: mongoose } = require("mongoose");
const PropertyTaxPaymentModel = require("../schema/propertytaxpayment.schema");
const FinancialYearModel = require("../schema/financialyear.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");
const citizenModel = require("../schema/propertyTax/citizen.schema");
const WaterTaxRegistrationModel = require("../schema/watertaxregistration.schema");
const PropertiesModel = require("../schema/propertyTax/properties.schema");

class PropertyTaxPaymentService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(gpId, propertyId, criteria) {
        const query = {
            gpId: new mongoose.Types.ObjectId(gpId),
            propertyId: new mongoose.Types.ObjectId(propertyId),
        };
        // if (criteria.propertyId) query.propertyId = criteria.propertyId;
        if (criteria.status) query.status = criteria.status;

        return this.preparePaginationAndReturnData(query, criteria);
    }
    async generateReceiptNumber(propertyId) {
        try {
            const lastReceipt = await PropertyTaxPaymentModel.findOne(
                {},
                {},
                { sort: { receiptNumber: -1 } }
            );
            let serialNumber;
            if (lastReceipt?.propertyId?._id == propertyId) {
                if (lastReceipt) {
                    const lastSerialNumber = Number(
                        lastReceipt.receiptNumber.split("-")[1]
                    );
                    serialNumber = lastSerialNumber;
                }
            } else {
                if (lastReceipt) {
                    const lastSerialNumber = Number(
                        lastReceipt.receiptNumber.split("-")[1]
                    );
                    serialNumber = lastSerialNumber + 1;
                } else {
                    serialNumber = 1;
                }
            }
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            const formattedSerialNumber = String(serialNumber).padStart(4, "0");
            const receiptNumber = `${year}${month}${day}-${formattedSerialNumber}`;

            return receiptNumber;
        } catch (error) {
            console.error("Error generating receipt number:", error);
            throw error;
        }
    }
    async getByGpId(gpId) {
        return this.execute(async () => {
            return await this.model.find({
                gpId: gpId,
            });
        });
    }
    async getByCitizenId(gpId, citizenId) {
        try {
            const data = await this.model.find({
                citizenId: citizenId,
                gpId: gpId,
                status: "unpaid",
            });

            let PendingAmount = 0;
            let a = data.forEach((element) => {
                if (element.TotalTax) {
                    PendingAmount += parseFloat(element.TotalTax);
                }
            });
            console.log(a);
            const serviceResponse = {
                data: data,
                PendingAmount: PendingAmount,
            };

            return serviceResponse;
        } catch (error) {
            throw error;
        }
    }
    //sample 9
    async getPropertySample9ByGpIdAndCitizenId(gpId) {
        try {
            const existingDocuments = await citizenModel.find({
                gpId: new mongoose.Types.ObjectId(gpId),
            });

            if (!existingDocuments || existingDocuments.length === 0) {
                throw new Error("Records not found");
            }
            const financialYear = await FinancialYearModel.findOne({
                isFinancialYear: true,
            });
            if (!financialYear) {
                throw new Error("Financial year not found");
            }
            const citizenRecords = [];
            for (const doc of existingDocuments) {
                if (doc.citizenId) {
                    const propertyTaxRecords =
                        await PropertyTaxPaymentModel.find({
                            citizenId: doc.citizenId,
                        });

                    const currentPropertyTaxData = [];
                    const previousYearPropertyTaxData = [];
                    let PreviousPaidAmountData = [];
                    let currentPropertyTaxData1 = [];
                    let CurrentRemainingAmountData = [];
                    let previousRemainingAmountData = [];
                    let currentPaidAmountData = [];
                    let totalCurrentLightTax = 0; // Initialize the total for current light tax.
                    let totalCurrentWaterTax = 0;
                    let totalCurrentHealthTax = 0;
                    let totalCurrentPropertyTax = 0;
                    let totalPreviousLightTax = 0; // Initialize the total for previous light tax
                    let totalPreviousWaterTax = 0;
                    let totalPreviousHealthTax = 0;
                    let totalPreviousPropertyTax = 0;
                    let totalPenaltyAmount = 0;
                    let totalDiscountAmount = 0;
                    let lastReceiptNumbers;
                    let previouslastReceiptNumbers;
                    for (const record of propertyTaxRecords) {
                        if (record.currentyear === financialYear.displayName) {
                            const currentData = {
                                record,
                            };

                            currentPropertyTaxData.push({
                                propertyTaxPayment: record,
                            });
                            lastReceiptNumbers =
                                currentPropertyTaxData[
                                    currentPropertyTaxData.length - 1
                                ].propertyTaxPayment.receiptNumber;
console.log(lastReceiptNumbers);
                            // Calculate the total for current light tax
                            if (record.lightTax) {
                                totalCurrentLightTax +=
                                    parseFloat(record.lightTax) || 0;
                            }
                            if (record.waterTax) {
                                totalCurrentWaterTax +=
                                    parseFloat(record.waterTax) || 0;
                            }
                            if (record.healthTax) {
                                totalCurrentHealthTax +=
                                    parseFloat(record.healthTax) || 0;
                            }
                            if (record.propertyTax) {
                                totalCurrentPropertyTax +=
                                    parseFloat(record.propertyTax) || 0;
                            }
                        } else {
                            previousYearPropertyTaxData.push({
                                propertyTaxPayment: record,
                            });

                            previouslastReceiptNumbers =
                                previousYearPropertyTaxData[
                                    previousYearPropertyTaxData.length - 1
                                ].propertyTaxPayment.receiptNumber;

                            // Calculate the total for previous light tax
                            if (record.lightTax) {
                                totalPreviousLightTax +=
                                    parseFloat(record.lightTax) || 0;
                            }
                            if (record.waterTax) {
                                totalPreviousWaterTax +=
                                    parseFloat(record.waterTax) || 0;
                            }
                            if (record.healthTax) {
                                totalPreviousHealthTax +=
                                    parseFloat(record.healthTax) || 0;
                            }
                            if (record.propertyTax) {
                                totalPreviousPropertyTax +=
                                    parseFloat(record.propertyTax) || 0;
                            }
                        }
                    }
                    let CurrentTotalAmount =
                        totalCurrentLightTax +
                        totalCurrentHealthTax +
                        totalCurrentPropertyTax +
                        totalCurrentWaterTax;
                    const currentTotal = {
                        totalCurrentLightTax: Math.round(totalCurrentLightTax),
                        totalCurrentWaterTax: Math.round(totalCurrentWaterTax),
                        totalCurrentHealthTax: Math.round(
                            totalCurrentHealthTax
                        ),
                        totalCurrentPropertyTax: Math.round(
                            totalCurrentPropertyTax
                        ),
                        TotalAmount: Math.round(CurrentTotalAmount),
                        lastReceiptNumber: lastReceiptNumbers,
                    };

                    currentPropertyTaxData1.push(currentTotal);
                    // Initialize variables
                    let currentTotalLightTax = 0;
                    let currentTotalWaterTax = 0;
                    let currentTotalPropertyTax = 0;
                    let currentTotalHealthTax = 0;
                    let currentTotalDiscount = 0;
                    let currentTotalPenalty = 0;
                    let currentTotalPaidAmount = 0;
                    currentPropertyTaxData.forEach((item) => {
                        // Check if item.propertyTaxPayment exists and has a paidAmount property
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;
                            const paidAmount = parseFloat(record.paidAmount);
                            currentTotalLightTax += Math.round(
                                (totalCurrentLightTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalWaterTax += Math.round(
                                (totalCurrentWaterTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalHealthTax += Math.round(
                                (totalCurrentHealthTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPropertyTax += Math.round(
                                (totalCurrentPropertyTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalDiscount += Math.round(
                                (record.discountAmount / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPenalty += Math.round(
                                (record.penaltyAmount / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPaidAmount += paidAmount;
                        }
                    });

                    const currentRemainingAmountObj = {
                        // lightTax: Math.round (totalCurrentLightTax - currentTotalLightTax),
                        // waterTax:  Math.round(totalCurrentWaterTax - currentTotalWaterTax),
                        // healthTax:
                        // Math.round ( totalCurrentHealthTax - currentTotalHealthTax),
                        // propertyTax:
                        // Math.round( totalCurrentPropertyTax -
                        //     parseFloat(currentTotalPropertyTax)),
                        // discountAmount:
                        // Math.round( totalDiscountAmount - currentTotalDiscount),
                        // totalPenalty: Math.round (totalPenaltyAmount - currentTotalPenalty),
                        // TotalTax: Math.round( CurrentTotalAmount - currentTotalPaidAmount),
                        lightTax: Math.max(
                            0,
                            Math.round(
                                totalCurrentLightTax - currentTotalLightTax
                            )
                        ),
                        waterTax: Math.max(
                            0,
                            Math.round(
                                totalCurrentWaterTax - currentTotalWaterTax
                            )
                        ),
                        healthTax: Math.max(
                            0,
                            Math.round(
                                totalCurrentHealthTax - currentTotalHealthTax
                            )
                        ),
                        propertyTax: Math.max(
                            0,
                            Math.round(
                                totalCurrentPropertyTax -
                                    parseFloat(currentTotalPropertyTax)
                            )
                        ),
                        discountAmount: Math.max(
                            0,
                            Math.round(
                                totalDiscountAmount - currentTotalDiscount
                            )
                        ),
                        totalPenalty: Math.max(
                            0,
                            Math.round(totalPenaltyAmount - currentTotalPenalty)
                        ),
                        TotalTax: Math.max(
                            0,
                            Math.round(
                                CurrentTotalAmount - currentTotalPaidAmount
                            )
                        ),
                    };
                    CurrentRemainingAmountData.push(currentRemainingAmountObj);
                    const totalCurrentPaidAmountRecord = {
                        lightTax: Math.round(currentTotalLightTax),
                        waterTax: Math.round(currentTotalWaterTax),
                        houseTax: Math.round(currentTotalPropertyTax),
                        healthTax: Math.round(currentTotalHealthTax),
                        discount: Math.round(currentTotalDiscount),
                        penalty: Math.round(currentTotalPenalty),
                        Total: currentTotalPaidAmount.toFixed(2), // Assuming you want two decimal places
                    };
                    currentPaidAmountData.push(totalCurrentPaidAmountRecord);
                    //previous
                    let totalAmount =
                        totalPreviousLightTax +
                        totalPreviousWaterTax +
                        totalPreviousHealthTax +
                        totalPreviousPropertyTax;
                    const totalofpreviousTax = {
                        totalPreviousLightTax: Math.round(
                            totalPreviousLightTax
                        ),
                        totalPreviousWaterTax: Math.round(
                            totalPreviousWaterTax
                        ),
                        totalPreviousHealthTax: Math.round(
                            totalPreviousHealthTax
                        ),
                        totalPreviousPropertyTax: Math.round(
                            totalPreviousPropertyTax
                        ),
                        totalAmount: Math.round(totalAmount),
                        previouslastReceiptNumber: 
                            previouslastReceiptNumbers
                        
                    };
                    previousYearPropertyTaxData.push(totalofpreviousTax);

                    // Initialize variables
                    let totalLightTax = 0;
                    let totalWaterTax = 0;
                    let totalPropertyTax = 0;
                    let totalHealthTax = 0;
                    let totalDiscount = 0;
                    let totalPenalty = 0;
                    let totalPaidAmount = 0;

                    previousYearPropertyTaxData.forEach((item) => {
                        // Check if item.propertyTaxPayment exists and has a paidAmount property
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;
                            const paidAmount = parseFloat(record.paidAmount);

                            // Update total tax amounts
                            totalLightTax += Math.round(
                                (totalPreviousLightTax / totalAmount) *
                                    paidAmount
                            );
                            totalWaterTax += Math.round(
                                (totalPreviousWaterTax / totalAmount) *
                                    paidAmount
                            );
                            totalHealthTax += Math.round(
                                (totalPreviousHealthTax / totalAmount) *
                                    paidAmount
                            );
                            totalPropertyTax += Math.round(
                                (totalPreviousPropertyTax / totalAmount) *
                                    paidAmount
                            );
                            totalDiscount += Math.round(
                                (record.discountAmount / totalAmount) *
                                    paidAmount
                            );
                            totalPenalty += Math.round(
                                (record.penaltyAmount / totalAmount) *
                                    paidAmount
                            );
                            totalPaidAmount += paidAmount;
                        }
                    });
                    const remainingAmountObj = {
                        lightTax: Math.round(
                            totalPreviousLightTax - totalLightTax
                        ),
                        waterTax: Math.round(
                            totalPreviousWaterTax - totalWaterTax
                        ),
                        healthTax: Math.round(
                            totalPreviousHealthTax - totalHealthTax
                        ),
                        propertyTax: Math.round(
                            totalPreviousPropertyTax -
                                parseFloat(totalPropertyTax)
                        ),
                        discountAmount: Math.round(
                            totalDiscount - totalDiscount
                        ),
                        totalPenalty: Math.round(totalPenalty - totalPenalty),
                        TotalTax: Math.round(totalAmount - totalPaidAmount),
                    };
                    previousRemainingAmountData.push(remainingAmountObj);
                    // Create a totalPaidAmountRecord object
                    const totalPaidAmountRecord = {
                        lightTax: Math.round(totalLightTax),
                        waterTax: Math.round(totalWaterTax),
                        houseTax: Math.round(totalPropertyTax),
                        healthTax: Math.round(totalHealthTax),
                        discount: Math.round(totalDiscount),
                        penalty: Math.round(totalPenalty),
                        Total: totalPaidAmount.toFixed(2), // Assuming you want two decimal places
                    };
                    PreviousPaidAmountData.push(totalPaidAmountRecord);
                    const citizenRecord = {
                        citizen: doc,
                        currentPropertyTaxData,
                        currentPropertyTaxData1,
                        currentPaidAmountData,
                        CurrentRemainingAmountData,
                        previousYearPropertyTaxData,
                        PreviousPaidAmountData,
                        previousRemainingAmountData,
                    };
                    citizenRecords.push(citizenRecord);
                }
            }
            const response = {
                status: "Success",
                citizenRecords,
            };
            return response;
        } catch (error) {
            throw error;
        }
    }
    //water sample 9
    async getWaterRegistrationByGpId(gpId) {
        try {
            const existingDocuments = await WaterTaxRegistrationModel.find({
                gpId: new mongoose.Types.ObjectId(gpId),
            });
            const citizenIds = existingDocuments.map((doc) => doc.citizenId);

            const citizenData = await citizenModel.find({
                citizenId: { $in: citizenIds },
            });

            if (!existingDocuments || existingDocuments.length === 0) {
                throw new Error("Records not found");
            }

            const financialYear = await FinancialYearModel.findOne({
                isFinancialYear: true,
            });
            if (!financialYear) {
                throw new Error("Financial year not found");
            }
            const citizenRecords = [];
            for (const doc of existingDocuments) {
                if (doc.citizenId) {
                    const propertyTaxRecords =
                        await PropertyTaxPaymentModel.find({
                            citizenId: doc.citizenId,
                        });
                    const currentPropertyTaxData = [];
                    const previousYearPropertyTaxData = [];
                    let PreviousPaidAmountData = [];
                    let currentPropertyTaxData1 = [];

                    let CurrentRemainingAmountData = [];
                    let previousRemainingAmountData = [];
                    let currentPaidAmountData = [];
                    let totalCurrentLightTax = 0; // Initialize the total for current light tax
                    let totalCurrentWaterTax = 0;
                    let totalCurrentHealthTax = 0;
                    let totalCurrentPropertyTax = 0;
                    let totalPreviousLightTax = 0; // Initialize the total for previous light tax

                    let totalPreviousWaterTax = 0;
                    let totalPreviousHealthTax = 0;
                    let totalPreviousPropertyTax = 0;
                    let totalPenaltyAmount = 0;
                    let totalDiscountAmount = 0;
                    for (const record of propertyTaxRecords) {
                        if (record.currentyear === financialYear.displayName) {
                            const currentData = {
                                record,
                            };

                            currentPropertyTaxData.push({
                                propertyTaxPayment: record,
                            });

                            if (record.waterTax) {
                                totalCurrentWaterTax +=
                                    parseFloat(record.waterTax) || 0;
                            }
                        } else {
                            previousYearPropertyTaxData.push({
                                propertyTaxPayment: record,
                            });

                            if (record.waterTax) {
                                totalPreviousWaterTax +=
                                    parseFloat(record.waterTax) || 0;
                            }
                        }
                    }
                    let CurrentTotalAmount = totalCurrentHealthTax;
                    const currentTotal = {
                        totalCurrentWaterTax: totalCurrentWaterTax,
                    };
                    currentPropertyTaxData1.push(currentTotal);

                    let currentTotalWaterTax = 0;
                    let currentTotalPaidAmount = 0;

                    currentPropertyTaxData.forEach((item) => {
                        // Check if item.propertyTaxPayment exists and has a paidAmount property
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;

                            const paidAmount = parseFloat(record.paidAmount);

                            currentTotalWaterTax += Math.round(
                                (totalCurrentWaterTax / CurrentTotalAmount) *
                                    paidAmount
                            );

                            currentTotalPaidAmount += paidAmount;
                        }
                    });
                    const currentRemainingAmountObj = {
                        waterTax: totalCurrentWaterTax - currentTotalWaterTax,
                        TotalTax: CurrentTotalAmount - currentTotalPaidAmount,
                    };

                    CurrentRemainingAmountData.push(currentRemainingAmountObj);
                    // Create a totalPaidAmountRecord object
                    const totalCurrentPaidAmountRecord = {
                        waterTax: currentTotalWaterTax,

                        Total: currentTotalPaidAmount.toFixed(2), // Assuming you want two decimal places
                    };
                    currentPaidAmountData.push(totalCurrentPaidAmountRecord);
                    //previous

                    let totalAmount = totalPreviousWaterTax;
                    const totalofpreviousTax = {
                        totalPreviousWaterTax: totalPreviousWaterTax,
                    };
                    previousYearPropertyTaxData.push(totalofpreviousTax);

                    // Initialize variables
                    // let totalLightTax = 0;
                    let totalWaterTax = 0;
                    let totalPaidAmount = 0;

                    previousYearPropertyTaxData.forEach((item) => {
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;
                            const paidAmount = parseFloat(record.paidAmount);
                            totalWaterTax += Math.round(
                                (totalPreviousWaterTax / totalAmount) *
                                    paidAmount
                            );

                            totalPaidAmount += paidAmount;
                        }
                    });
                    const remainingAmountObj = {
                        waterTax: totalPreviousWaterTax - totalWaterTax,
                        TotalTax: totalAmount - totalPaidAmount,
                    };

                    previousRemainingAmountData.push(remainingAmountObj);
                    // Create a totalPaidAmountRecord object
                    const totalPaidAmountRecord = {
                        waterTax: totalWaterTax,
                        Total: totalPaidAmount.toFixed(2),
                    };
                    PreviousPaidAmountData.push(totalPaidAmountRecord);
                    
                    const matchingCitizen = citizenData.filter(
                        (citizen) => citizen.citizenId === doc.citizenId
                    );
                    if (matchingCitizen) {
                        const docs = {
                            WaterRegisterDetails: doc,
                            citizen: matchingCitizen[0],
                        };
                        const citizenRecord = {
                            WatershedDetails: docs,
                            // citizen: matchingCitizen,
                            currentPropertyTaxData,
                            currentPropertyTaxData1,
                            currentPaidAmountData,
                            CurrentRemainingAmountData,
                            previousYearPropertyTaxData,
                            PreviousPaidAmountData,
                            previousRemainingAmountData,
                        };

                        citizenRecords.push(citizenRecord);
                        console.log(citizenRecord);
                    }
                }
            }
            const response = {
                status: "Success",
                citizenRecords,
            };

            return response;
        } catch (error) {
            throw error;
        }
    }
    //generate invoice
    async generateInvoiceByCitizenId(citizenId) {
        try {
            const existingDocuments = await citizenModel.find({
                citizenId: citizenId,
            });

            if (!existingDocuments || existingDocuments.length === 0) {
                throw new Error("Records not found");
            }

            const financialYear = await FinancialYearModel.findOne({
                isFinancialYear: true,
            });

            if (!financialYear) {
                throw new Error("Financial year not found");
            }

            const citizenRecords = [];

            for (const doc of existingDocuments) {
                if (doc.citizenId) {
                    const propertyTaxRecords =
                        await PropertyTaxPaymentModel.find({
                            citizenId: doc.citizenId,
                        });

                    const currentPropertyTaxData = [];
                    const previousYearPropertyTaxData = [];
                    let PreviousPaidAmountData = [];
                    let currentPropertyTaxData1 = [];
                    let CurrentRemainingAmountData = [];
                    let previousRemainingAmountData = [];
                    let currentPaidAmountData = [];
                    let totalCurrentLightTax = 0; // Initialize the total for current light tax
                    let totalCurrentWaterTax = 0;
                    let totalCurrentHealthTax = 0;
                    let totalCurrentPropertyTax = 0;
                    let totalPreviousLightTax = 0; // Initialize the total for previous light tax

                    let totalPreviousWaterTax = 0;
                    let totalPreviousHealthTax = 0;
                    let totalPreviousPropertyTax = 0;
                    let currenttotaldiscountedAmount = 0;
                    let previoustotaldiscountedAmount = 0;
                    let previoustotalupdatedPenaltyAmount = 0;
                    let currenttotalupdatedPenaltyAmount = 0;
                    let totalPenaltyAmount = 0;
                    let totalDiscountAmount = 0;
                    for (const record of propertyTaxRecords) {
                        if (record.currentyear === financialYear.displayName) {
                            const currentData = {
                                record,
                            };

                            currentPropertyTaxData.push({
                                propertyTaxPayment: record,
                            });

                            // Calculate the total for current light tax
                            if (record.lightTax) {
                                totalCurrentLightTax +=
                                    parseFloat(record.lightTax) || 0;
                            }
                            if (record.waterTax) {
                                totalCurrentWaterTax +=
                                    parseFloat(record.waterTax) || 0;
                            }
                            if (record.healthTax) {
                                totalCurrentHealthTax +=
                                    parseFloat(record.healthTax) || 0;
                            }
                            if (record.propertyTax) {
                                totalCurrentPropertyTax +=
                                    parseFloat(record.propertyTax) || 0;
                            }
                            if (record.discountedAmount) {
                                currenttotaldiscountedAmount +=
                                    parseFloat(record.discountedAmount) || 0;
                            }
                            if (record.updatedPenaltyAmount) {
                                currenttotalupdatedPenaltyAmount +=
                                    parseFloat(record.updatedPenaltyAmount) ||
                                    0;
                            }
                        } else {
                            previousYearPropertyTaxData.push({
                                propertyTaxPayment: record,
                            });

                            // Calculate the total for previous light tax
                            if (record.lightTax) {
                                totalPreviousLightTax +=
                                    parseFloat(record.lightTax) || 0;
                            }
                            if (record.waterTax) {
                                totalPreviousWaterTax +=
                                    parseFloat(record.waterTax) || 0;
                            }
                            if (record.healthTax) {
                                totalPreviousHealthTax +=
                                    parseFloat(record.healthTax) || 0;
                            }
                            if (record.propertyTax) {
                                totalPreviousPropertyTax +=
                                    parseFloat(record.propertyTax) || 0;
                            }
                            if (record.discountedAmount) {
                                previoustotaldiscountedAmount +=
                                    parseFloat(record.discountedAmount) || 0;
                            }
                            if (record.updatedPenaltyAmount) {
                                previoustotalupdatedPenaltyAmount +=
                                    parseFloat(record.updatedPenaltyAmount) ||
                                    0;
                            }
                        }
                    }

                    let CurrentTotalAmount =
                        totalCurrentLightTax +
                        totalCurrentHealthTax +
                        totalCurrentPropertyTax +
                        totalCurrentWaterTax;

                    // const currentTotal = {
                    //     totalCurrentLightTax: totalCurrentLightTax,
                    //     totalCurrentWaterTax: totalCurrentWaterTax,
                    //     totalCurrentHealthTax: totalCurrentHealthTax,
                    //     totalCurrentPropertyTax: totalCurrentPropertyTax,
                    //     TotalAmount: CurrentTotalAmount,
                    // };
                    // currentPropertyTaxData1.push(currentTotal);
                    // Initialize variables
                    let currentTotalLightTax = 0;
                    let currentTotalWaterTax = 0;
                    let currentTotalPropertyTax = 0;
                    let currentTotalHealthTax = 0;
                    let currentTotalDiscount = 0;
                    let currentTotalPenalty = 0;
                    let currentTotalPaidAmount = 0;

                    currentPropertyTaxData.forEach((item) => {
                        // Check if item.propertyTaxPayment exists and has a paidAmount property
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;
                            const paidAmount = parseFloat(record.paidAmount);
                            currentTotalLightTax += Math.round(
                                (totalCurrentLightTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalWaterTax += Math.round(
                                (totalCurrentWaterTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalHealthTax += Math.round(
                                (totalCurrentHealthTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPropertyTax += Math.round(
                                (totalCurrentPropertyTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalDiscount += Math.round(
                                (record.discountedAmount / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPenalty += Math.round(
                                (record.updatedPenaltyAmount /
                                    CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPaidAmount += paidAmount;
                        }
                    });
                    const currentRemainingAmountObj = {
                        lightTax: totalCurrentLightTax - currentTotalLightTax,
                        waterTax: totalCurrentWaterTax - currentTotalWaterTax,
                        healthTax:
                            totalCurrentHealthTax - currentTotalHealthTax,
                        propertyTax:
                            totalCurrentPropertyTax -
                            parseFloat(currentTotalPropertyTax),
                        discountAmount:
                            totalDiscountAmount - currentTotalDiscount,
                        totalPenalty: totalPenaltyAmount - currentTotalPenalty,
                        TotalTax: CurrentTotalAmount - currentTotalPaidAmount,
                    };

                    CurrentRemainingAmountData.push(currentRemainingAmountObj);
                    // Create a totalPaidAmountRecord object
                    const totalCurrentPaidAmountRecord = {
                        lightTax: currentTotalLightTax,
                        waterTax: currentTotalWaterTax,
                        houseTax: currentTotalPropertyTax,
                        healthTax: currentTotalHealthTax,
                        discount: currentTotalDiscount,
                        penalty: currentTotalPenalty,
                        Total: currentTotalPaidAmount.toFixed(2), // Assuming you want two decimal places
                    };
                    currentPaidAmountData.push(totalCurrentPaidAmountRecord);
                    //previous

                    let totalAmount =
                        totalPreviousLightTax +
                        totalPreviousWaterTax +
                        totalPreviousHealthTax +
                        totalPreviousPropertyTax;

                    const totalofpreviousTax = {
                        totalPreviousLightTax: Math.round(
                            totalPreviousLightTax
                        ),
                        totalPreviousWaterTax: totalPreviousWaterTax,
                        totalPreviousHealthTax: totalPreviousHealthTax,
                        totalPreviousPropertyTax: totalPreviousPropertyTax,
                        totalAmount: totalAmount,
                    };
                    previousYearPropertyTaxData.push(totalofpreviousTax);

                    // Initialize variables
                    let totalLightTax = 0;
                    let totalWaterTax = 0;
                    let totalPropertyTax = 0;
                    let totalHealthTax = 0;
                    let totalDiscount = 0;
                    let totalPenalty = 0;
                    let totalPaidAmount = 0;

                    previousYearPropertyTaxData.forEach((item) => {
                        // Check if item.propertyTaxPayment exists and has a paidAmount property
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;
                            const paidAmount = parseFloat(record.paidAmount);

                            // Update total tax amounts
                            totalLightTax += Math.round(
                                (totalPreviousLightTax / totalAmount) *
                                    paidAmount
                            );
                            totalWaterTax += Math.round(
                                (totalPreviousWaterTax / totalAmount) *
                                    paidAmount
                            );
                            totalHealthTax += Math.round(
                                (totalPreviousHealthTax / totalAmount) *
                                    paidAmount
                            );
                            totalPropertyTax += Math.round(
                                (totalPreviousPropertyTax / totalAmount) *
                                    paidAmount
                            );
                            totalDiscount += Math.round(
                                (record.discountedAmount / totalAmount) *
                                    paidAmount
                            );
                            totalPenalty += Math.round(
                                (record.updatedPenaltyAmount / totalAmount) *
                                    paidAmount
                            );
                            totalPaidAmount += paidAmount;
                        }
                    });
                    const remainingAmountObj = {
                        lightTax: totalPreviousLightTax - totalLightTax,
                        waterTax: totalPreviousWaterTax - totalWaterTax,
                        healthTax: totalPreviousHealthTax - totalHealthTax,
                        propertyTax:
                            totalPreviousPropertyTax -
                            parseFloat(totalPropertyTax),
                        discountAmount: totalDiscount - totalDiscount,
                        totalPenalty: totalPenalty - totalPenalty,
                        TotalTax: totalAmount - totalPaidAmount,
                    };

                    previousRemainingAmountData.push(remainingAmountObj);
                    // Create a totalPaidAmountRecord object
                    const totalPaidAmountRecord = {
                        lightTax: totalLightTax,
                        waterTax: totalWaterTax,
                        houseTax: totalPropertyTax,
                        healthTax: totalHealthTax,
                        discount: totalDiscount,
                        penalty: totalPenalty,
                        Total: totalPaidAmount.toFixed(2), // Assuming you want two decimal places
                    };
                    PreviousPaidAmountData.push(totalPaidAmountRecord);

                    const citizenRecord = {
                        citizen: doc,
                        currentPropertyTaxData,
                        // currentPropertyTaxData1,
                        totalCurrentLightTax: Math.round(totalCurrentLightTax),
                        totalCurrentWaterTax: Math.round(totalCurrentWaterTax),
                        totalCurrentHealthTax: Math.round(
                            totalCurrentHealthTax
                        ),
                        totalCurrentPropertyTax: Math.round(
                            totalCurrentPropertyTax
                        ),
                        CurrentTotalAmount: Math.round(CurrentTotalAmount),
                        // currentPaidAmountData,
                        // CurrentRemainingAmountData,
                        TotalOfcurrentAndPreviousLightTax: Math.round(
                            totalCurrentLightTax + totalPreviousLightTax
                        ),
                        TotalOfcurrentAndPreviousWaterTax: Math.round(
                            totalCurrentWaterTax + totalPreviousWaterTax
                        ),
                        TotalOfcurrentAndPreviousHealthTax: Math.round(
                            totalCurrentHealthTax + totalPreviousHealthTax
                        ),
                        TotalOfcurrentAndPreviousPropertyTax: Math.round(
                            totalCurrentPropertyTax + totalPreviousPropertyTax
                        ),
                        TotalOfcurrentAndPreviousTotalAmount: Math.round(
                            CurrentTotalAmount + totalAmount
                        ),
                        currenttotaldiscountedAmount: Math.round(
                            currenttotaldiscountedAmount
                        ),
                        currentupdatedPenaltyAmount: Math.round(
                            currenttotalupdatedPenaltyAmount
                        ),
                        previoustotaldiscountedAmount: Math.round(
                            previoustotaldiscountedAmount
                        ),
                        previoustotalupdatedPenaltyAmount: Math.round(
                            previoustotalupdatedPenaltyAmount
                        ),
                        previousYearPropertyTaxData,
                        totalPreviousLightTax: Math.round(
                            totalPreviousLightTax
                        ),
                        totalPreviousWaterTax: Math.round(
                            totalPreviousWaterTax
                        ),
                        totalPreviousHealthTax: Math.round(
                            totalPreviousHealthTax
                        ),
                        totalPreviousPropertyTax: Math.round(
                            totalPreviousPropertyTax
                        ),
                        previoustotalAmount: Math.round(totalAmount),

                        // PreviousPaidAmountData,
                        // previousRemainingAmountData,
                    };

                    // citizenRecords.push(citizenRecord);
                    const response = {
                        status: "Success",
                        citizenRecord,
                    };

                    return response;
                }
            }
            // const response = {
            //     status: "Success",
            //     citizenRecords,
            // };

            // return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    //generate TaxBill
    async generateTaxBillByCitizenId(citizenId, currentDate) {
        try {
            const existingDocument = await citizenModel.find({
                citizenId: citizenId,
            });

            if (!existingDocument || existingDocument.length === 0) {
                throw new Error("Records not found");
            }

            const financialYear = await FinancialYearModel.find({
                isFinancialYear: true,
            });

            if (!financialYear) {
                throw new Error("Financial year not found");
            }

            const citizenRecords = [];

            for (const doc of existingDocument) {
                if (doc.citizenId) {
                    const propertyTaxRecords = await PropertiesModel.find({
                        citizenId: doc._id,
                    });
                    const currentPropertyTaxData = [];
                    const previousYearPropertyTaxData = [];
                    let PreviousPaidAmountData = [];
                    let currentPropertyTaxData1 = [];
                    let CurrentRemainingAmountData = [];
                    let previousRemainingAmountData = [];
                    let currentPaidAmountData = [];
                    let totalCurrentLightTax = 0; // Initialize the total for current light tax
                    let totalCurrentWaterTax = 0;
                    let totalCurrentHealthTax = 0;
                    let totalCurrentPropertyTax = 0;
                    let totalPreviousLightTax = 0; // Initialize the total for previous light tax
                    let previouspenalty = 0;
                    let totalPreviousWaterTax = 0;
                    let totalPreviousHealthTax = 0;
                    let totalPreviousPropertyTax = 0;
                    let currenttotaldiscountedAmount = 0;
                    let previoustotaldiscountedAmount = 0;
                    let previoustotalupdatedPenaltyAmount = 0;
                    let currenttotalupdatedPenaltyAmount = 0;
                    let discountAmount = 0;
                    let penaltyAmount = 0;
                    for (const record of propertyTaxRecords) {
                        let isDiscount = false;
                        let isPenalty = false;
                        if (currentDate) {
                            const currentDateParts = currentDate.split("/");
                            const todayYear = parseInt(currentDateParts[0]);
                            const todayMonth = parseInt(currentDateParts[1]);

                            // Iterate through each financial year
                            let isInAnyFinancialYear = false; // Flag to check if current year is within any financial year

                            for (const year of financialYear) {
                                const yearFromParts = year.from.split("/");
                                const yearFromYear = parseInt(yearFromParts[0]);
                                const yearFromMonth = parseInt(
                                    yearFromParts[1]
                                );
                                const yearToParts = year.to.split("/");
                                const yearToYear = parseInt(yearToParts[0]);
                                const yearToMonth = parseInt(yearToParts[1]);

                                if (
                                    (todayYear === yearFromYear &&
                                        todayMonth >= yearFromMonth) ||
                                    (todayYear === yearToYear &&
                                        todayMonth <= yearToMonth)
                                ) {
                                    isInAnyFinancialYear = true; // Set the flag if the current year falls within a financial year

                                    if (todayMonth >= 4 && todayMonth <= 9) {
                                        isDiscount = true;
                                        break;
                                    }
                                }
                            }

                            if (!isInAnyFinancialYear) {
                                isPenalty = true;
                            }
                        } else {
                            isPenalty = true;
                        }

                        if (
                            record.currentyear === financialYear[0].displayName
                        ) {
                            const currentData = {
                                record,
                            };

                            currentPropertyTaxData.push({
                                propertyTaxPayment: record,
                                isPenalty,
                                isDiscount,
                            });

                            // Calculate the total for current light tax
                            if (record.totalTaxValues.totalLightTaxSum) {
                                totalCurrentLightTax +=
                                    parseFloat(
                                        record.totalTaxValues.totalLightTaxSum
                                    ) || 0;
                            }
                            if (record.totalTaxValues.totalWaterTaxSum) {
                                totalCurrentWaterTax +=
                                    parseFloat(
                                        record.totalTaxValues.totalWaterTaxSum
                                    ) || 0;
                            }
                            if (record.totalTaxValues.totalHealthTaxSum) {
                                totalCurrentHealthTax +=
                                    parseFloat(
                                        record.totalTaxValues.totalHealthTaxSum
                                    ) || 0;
                            }
                            if (record.totalTaxValues.totalHouseTaxSum) {
                                totalCurrentPropertyTax +=
                                    parseFloat(
                                        record.totalTaxValues.totalHouseTaxSum
                                    ) || 0;
                            }
                            if (record.discountedAmount) {
                                currenttotaldiscountedAmount +=
                                    parseFloat(record.discountedAmount) || 0;
                            }
                            if (record.updatedPenaltyAmount) {
                                currenttotalupdatedPenaltyAmount +=
                                    parseFloat(record.updatedPenaltyAmount) ||
                                    0;
                            }
                        } else {
                            previousYearPropertyTaxData.push({
                                propertyTaxPayment: record,
                                isPenalty: true,
                            });

                            // Calculate the total for previous light tax
                            if (record.totalTaxValues.totalLightTaxSum) {
                                totalPreviousLightTax +=
                                    parseFloat(
                                        record.totalTaxValues.totalLightTaxSum
                                    ) || 0;
                            }
                            if (record.totalTaxValues.totalWaterTaxSum) {
                                totalPreviousWaterTax +=
                                    parseFloat(
                                        record.totalTaxValues.totalWaterTaxSum
                                    ) || 0;
                            }
                            if (record.totalTaxValues.totalHealthTaxSum) {
                                totalPreviousHealthTax +=
                                    parseFloat(
                                        record.totalTaxValues.totalHealthTaxSum
                                    ) || 0;
                            }
                            if (record.totalTaxValues.totalHouseTaxSum) {
                                totalPreviousPropertyTax +=
                                    parseFloat(
                                        record.totalTaxValues.totalHouseTaxSum
                                    ) || 0;
                            }
                            if (record.discountedAmount) {
                                previoustotaldiscountedAmount +=
                                    parseFloat(record.discountedAmount) || 0;
                            }
                            if (record.updatedPenaltyAmount) {
                                previoustotalupdatedPenaltyAmount +=
                                    parseFloat(record.updatedPenaltyAmount) ||
                                    0;
                            }
                        }
                    }

                    let CurrentTotalAmount =
                        totalCurrentLightTax +
                        totalCurrentHealthTax +
                        totalCurrentPropertyTax +
                        totalCurrentWaterTax;

                    let applyDiscount = false;
                    let applyPenalty = false;

                    for (const record of currentPropertyTaxData) {
                        if (record.isDiscount) {
                            applyDiscount = true;
                        }
                        if (record.isPenalty) {
                            applyPenalty = true;
                        }
                    }

                    if (applyDiscount) {
                        // Apply a 5% discount to CurrentTotalAmount
                        discountAmount = CurrentTotalAmount * 0.05;
                        CurrentTotalAmount -= discountAmount; // Reduce by discount
                    }

                    if (applyPenalty) {
                        // Apply a 5% penalty to CurrentTotalAmount
                        penaltyAmount = CurrentTotalAmount * 0.05;
                        CurrentTotalAmount += penaltyAmount; // Increase by penalty
                    }

                    // Ensure that existingDocument.TotalTax is a valid numeric value
                    if (typeof existingDocument.TotalTax === "number") {
                        const updatedTotalTax = Math.max(
                            existingDocument.TotalTax -
                                (applyDiscount ? discountAmount : 0) +
                                (applyPenalty ? penaltyAmount : 0),
                            0 // Ensure the result is not negative
                        );
                    } else {
                        console.log(
                            "existingDocument.TotalTax is not a valid number."
                        );
                    }

                    // Initialize variables
                    let currentTotalLightTax = 0;
                    let currentTotalWaterTax = 0;
                    let currentTotalPropertyTax = 0;
                    let currentTotalHealthTax = 0;
                    let currentTotalDiscount = 0;
                    let currentTotalPenalty = 0;
                    let currentTotalPaidAmount = 0;

                    currentPropertyTaxData.forEach((item) => {
                        // Check if item.propertyTaxPayment exists and has a paidAmount property
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;
                            const paidAmount = parseFloat(record.paidAmount);
                            currentTotalLightTax += Math.round(
                                (totalCurrentLightTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalWaterTax += Math.round(
                                (totalCurrentWaterTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalHealthTax += Math.round(
                                (totalCurrentHealthTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPropertyTax += Math.round(
                                (totalCurrentPropertyTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalDiscount += Math.round(
                                (record.discountedAmount / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPenalty += Math.round(
                                (record.updatedPenaltyAmount /
                                    CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPaidAmount += paidAmount;
                        }
                    });

                    //previous
                    let totalAmount =
                        totalPreviousLightTax +
                        totalPreviousWaterTax +
                        totalPreviousHealthTax +
                        totalPreviousPropertyTax;

                    let previousapplyDiscount = false;
                    let previousapplyPenalty = false;

                    for (const record of previousYearPropertyTaxData) {
                        if (record.isPenalty) {
                            previousapplyPenalty = true;
                            break;
                        }
                    }

                    if (previousapplyPenalty) {
                        const penaltyAmount = totalAmount * 0.05;
                        console.log("penaltyAmountaaaa", penaltyAmount);
                        totalAmount += penaltyAmount; // Increase by penalty
                        previouspenalty = penaltyAmount;
                    }

                    console.log(previouspenalty);
                    if (typeof existingDocument.TotalTax === "number") {
                        const updatedTotalTax = Math.max(
                            existingDocument.TotalTax +
                                (previousapplyPenalty ? penaltyAmount : 0),
                            0 // Ensure the result is not negative
                        );
                    } else {
                        console.log(
                            "existingDocument.TotalTax is not a valid number."
                        );
                    }

                    const totalofpreviousTax = {
                        totalPreviousLightTax: Math.round(
                            totalPreviousLightTax
                        ),
                        totalPreviousWaterTax: Math.round(
                            totalPreviousWaterTax
                        ),
                        totalPreviousHealthTax: Math.round(
                            totalPreviousHealthTax
                        ),
                        totalPreviousPropertyTax: Math.round(
                            totalPreviousPropertyTax
                        ),
                        totalAmount: Math.round(totalAmount),
                    };
                    previousYearPropertyTaxData.push(totalofpreviousTax);

                    // Initialize variables
                    let totalLightTax = 0;
                    let totalWaterTax = 0;
                    let totalPropertyTax = 0;
                    let totalHealthTax = 0;
                    let totalDiscount = 0;
                    let totalPenalty = 0;
                    let totalPaidAmount = 0;

                    previousYearPropertyTaxData.forEach((item) => {
                        // Check if item.propertyTaxPayment exists and has a paidAmount property
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;
                            const paidAmount = parseFloat(record.paidAmount);

                            // Update total tax amounts
                            totalLightTax += Math.round(
                                (totalPreviousLightTax / totalAmount) *
                                    paidAmount
                            );
                            totalWaterTax += Math.round(
                                (totalPreviousWaterTax / totalAmount) *
                                    paidAmount
                            );
                            totalHealthTax += Math.round(
                                (totalPreviousHealthTax / totalAmount) *
                                    paidAmount
                            );
                            totalPropertyTax += Math.round(
                                (totalPreviousPropertyTax / totalAmount) *
                                    paidAmount
                            );
                            totalDiscount += Math.round(
                                (record.discountedAmount / totalAmount) *
                                    paidAmount
                            );
                            totalPenalty += Math.round(
                                (record.updatedPenaltyAmount / totalAmount) *
                                    paidAmount
                            );
                            totalPaidAmount += paidAmount;
                        }
                    });

                    const citizenRecord = {
                        citizen: doc,
                        currentPropertyTaxData,
                        // currentPropertyTaxData1,
                        totalCurrentLightTax: Math.round(totalCurrentLightTax),
                        totalCurrentWaterTax: Math.round(totalCurrentWaterTax),
                        totalCurrentHealthTax: Math.round(
                            totalCurrentHealthTax
                        ),
                        totalCurrentPropertyTax: Math.round(
                            totalCurrentPropertyTax
                        ),

                        currentDiscountAmount: Math.round(discountAmount),
                        penaltyAmount: Math.round(penaltyAmount),
                        CurrentTotalDiscountedAndPenaltyAmount:
                            Math.round(CurrentTotalAmount),
                        // currentPaidAmountData,
                        // CurrentRemainingAmountData,
                        TotalOfcurrentAndPreviousLightTax: Math.round(
                            totalCurrentLightTax + totalPreviousLightTax
                        ),
                        TotalOfcurrentAndPreviousWaterTax: Math.round(
                            totalCurrentWaterTax + totalPreviousWaterTax
                        ),
                        TotalOfcurrentAndPreviousHealthTax: Math.round(
                            totalCurrentHealthTax + totalPreviousHealthTax
                        ),
                        TotalOfcurrentAndPreviousPropertyTax: Math.round(
                            totalCurrentPropertyTax + totalPreviousPropertyTax
                        ),
                        TotalOfcurrentAndPreviousTotalAmount: Math.round(
                            CurrentTotalAmount + totalAmount
                        ),
                        // currenttotaldiscountedAmount: Math.round(
                        //     currenttotaldiscountedAmount
                        // ),
                        // currentupdatedPenaltyAmount: Math.round(
                        //     currenttotalupdatedPenaltyAmount
                        // ),

                        previoustotaldiscountedAmount: Math.round(
                            previoustotaldiscountedAmount
                        ),
                        previoustotalupdatedPenaltyAmount: Math.round(
                            previoustotalupdatedPenaltyAmount
                        ),
                        previousYearPropertyTaxData,
                        totalPreviousLightTax: Math.round(
                            totalPreviousLightTax
                        ),
                        totalPreviousWaterTax: Math.round(
                            totalPreviousWaterTax
                        ),
                        totalPreviousHealthTax: Math.round(
                            totalPreviousHealthTax
                        ),
                        totalPreviousPropertyTax: Math.round(
                            totalPreviousPropertyTax
                        ),
                        previoustotalAmount: Math.round(totalAmount),
                        previouspenaltyAmount: Math.round(previouspenalty),
                        // isDiscount,
                        // isPenalty,
                    };

                    // citizenRecords.push(citizenRecord);
                    const response = {
                        status: "Success",
                        citizenRecord,
                    };

                    return response;
                }
            }
            // const response = {
            //     status: "Success",
            //     citizenRecords,
            // };

            // return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    //remaining balalnce Annoucement tax sample 9
    async getTaxSample9ByGpId(gpId) {
        try {
            const existingDocuments = await PropertyTaxPaymentModel.find({
                gpId: new mongoose.Types.ObjectId(gpId),
            });

            if (!existingDocuments || existingDocuments.length === 0) {
                throw new Error("Records not found");
            }
            const financialYear = await FinancialYearModel.findOne({
                isFinancialYear: true,
            });
            if (!financialYear) {
                throw new Error("Financial year not found");
            }
            const citizenRecords = [];
            for (const doc of existingDocuments) {
                console.log(doc);
                if (doc.gpId) {
                    const propertyTaxRecords =
                        await PropertyTaxPaymentModel.find({
                            gpId: doc.gpId,
                        });

                    const currentPropertyTaxData = [];
                    const previousYearPropertyTaxData = [];
                    let PreviousPaidAmountData = [];
                    let currentPropertyTaxData1 = [];
                    let CurrentRemainingAmountData = [];
                    let previousRemainingAmountData = [];
                    let currentPaidAmountData = [];
                    let totalCurrentLightTax = 0; 
                    let totalCurrentDiscountAmount=0
                    let totalCurrentPenaltyAmount=0
                    let totalPreviousDiscountAmount=0
                    let totalPreviousPenaltyAmount=0
                    let totalCurrentWaterTax = 0;
                    let totalCurrentHealthTax = 0;
                    let totalCurrentPropertyTax = 0;
                    let totalPreviousLightTax = 0;
                    let totalPreviousWaterTax = 0;
                    let totalPreviousHealthTax = 0;
                    let totalPreviousPropertyTax = 0;
                    let totalPenaltyAmount = 0;
                    let totalDiscountAmount = 0;
                    let lastReceiptNumbers;
                    let previouslastReceiptNumbers;
                    for (const record of propertyTaxRecords) {
                        if (record.currentyear === financialYear.displayName) {
                            const currentData = {
                                record,
                            };

                            currentPropertyTaxData.push({
                                propertyTaxPayment: record,
                            });
                            lastReceiptNumbers =
                                currentPropertyTaxData[
                                    currentPropertyTaxData.length - 1
                                ].propertyTaxPayment.receiptNumber;

                            // Calculate the total for current light tax
                            if (record.lightTax) {
                                totalCurrentLightTax +=
                                    parseFloat(record.lightTax) || 0;
                            }
                            if (record.waterTax) {
                                totalCurrentWaterTax +=
                                    parseFloat(record.waterTax) || 0;
                            }
                            if (record.healthTax) {
                                totalCurrentHealthTax +=
                                    parseFloat(record.healthTax) || 0;
                            }
                            if (record.propertyTax) {
                                totalCurrentPropertyTax +=
                                    parseFloat(record.propertyTax) || 0;
                            }
                            if (record.discountedAmount) {
                                totalCurrentDiscountAmount +=
                                    parseFloat(record.discountedAmount) || 0;
                            }
                            if (record.updatedPenaltyAmount) {
                                totalCurrentPenaltyAmount +=
                                    parseFloat(record.updatedPenaltyAmount) || 0;
                            }
                        } else {
                            previousYearPropertyTaxData.push({
                                propertyTaxPayment: record,
                            });

                            previouslastReceiptNumbers =
                                previousYearPropertyTaxData[
                                    previousYearPropertyTaxData.length - 1
                                ].propertyTaxPayment.receiptNumber;

                            // Calculate the total for previous light tax
                            if (record.lightTax) {
                                totalPreviousLightTax +=
                                    parseFloat(record.lightTax) || 0;
                            }
                            if (record.waterTax) {
                                totalPreviousWaterTax +=
                                    parseFloat(record.waterTax) || 0;
                            }
                            if (record.healthTax) {
                                totalPreviousHealthTax +=
                                    parseFloat(record.healthTax) || 0;
                            }
                            if (record.propertyTax) {
                                totalPreviousPropertyTax +=
                                    parseFloat(record.propertyTax) || 0;
                            }
                            if (record.discountedAmount) {
                                totalPreviousDiscountAmount +=
                                    parseFloat(record.discountedAmount) || 0;
                            }
                            if (record.updatedPenaltyAmount) {
                                totalPreviousPenaltyAmount +=
                                    parseFloat(record.updatedPenaltyAmount) || 0;
                            }
                        }
                    }
                    let CurrentTotalAmount =
                        totalCurrentLightTax +
                        totalCurrentHealthTax +
                        totalCurrentPropertyTax +
                        totalCurrentWaterTax;
                    const currentTotal = {
                        // totalCurrentLightTax: totalCurrentLightTax,
                        // totalCurrentWaterTax: totalCurrentWaterTax,
                        // totalCurrentHealthTax: totalCurrentHealthTax,
                        // totalCurrentPropertyTax: totalCurrentPropertyTax,
                        // TotalAmount: CurrentTotalAmount,
                        // lastReceiptNumber: lastReceiptNumbers,
                    };

                    // currentPropertyTaxData1.push(currentTotal);
                    // Initialize variables
                    let currentTotalLightTax = 0;
                    let currentTotalWaterTax = 0;
                    let currentTotalPropertyTax = 0;
                    let currentTotalHealthTax = 0;
                    let currentTotalDiscount = 0;
                    let currentTotalPenalty = 0;
                    let currentTotalPaidAmount = 0;
                    currentPropertyTaxData.forEach((item) => {
                        // Check if item.propertyTaxPayment exists and has a paidAmount property
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount &&
                            item.propertyTaxPayment.status == "Paid"
                        ) {
                            const record = item.propertyTaxPayment;
                            const paidAmount = parseFloat(record.paidAmount);
                            currentTotalLightTax += Math.round(
                                (totalCurrentLightTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalWaterTax += Math.round(
                                (totalCurrentWaterTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalHealthTax += Math.round(
                                (totalCurrentHealthTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPropertyTax += Math.round(
                                (totalCurrentPropertyTax / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalDiscount += Math.round(
                                (record.discountAmount / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPenalty += Math.round(
                                (record.penaltyAmount / CurrentTotalAmount) *
                                    paidAmount
                            );
                            currentTotalPaidAmount += paidAmount;
                        }
                    });

                    const currentRemainingAmountObj = {
                        // lightTax: totalCurrentLightTax - currentTotalLightTax,
                        // waterTax: totalCurrentWaterTax - currentTotalWaterTax,
                        // healthTax:
                        //     totalCurrentHealthTax - currentTotalHealthTax,
                        // propertyTax:
                        //     totalCurrentPropertyTax -
                        //     parseFloat(currentTotalPropertyTax),
                        // discountAmount:
                        //     totalDiscountAmount - currentTotalDiscount,
                        // totalPenalty: totalPenaltyAmount - currentTotalPenalty,
                        // TotalTax: CurrentTotalAmount - currentTotalPaidAmount,
                    };
                    // CurrentRemainingAmountData.push(currentRemainingAmountObj);
                    const totalCurrentPaidAmountRecord = {
                        // lightTax: currentTotalLightTax,
                        // waterTax: currentTotalWaterTax,
                        // houseTax: currentTotalPropertyTax,
                        // healthTax: currentTotalHealthTax,
                        // discount: currentTotalDiscount,
                        // penalty: currentTotalPenalty,
                        // Total: currentTotalPaidAmount.toFixed(2), // Assuming you want two decimal places
                    };
                    // currentPaidAmountData.push(totalCurrentPaidAmountRecord);
                    //previous
                    let totalAmount =
                        totalPreviousLightTax +
                        totalPreviousWaterTax +
                        totalPreviousHealthTax +
                        totalPreviousPropertyTax;
                    const totalofpreviousTax = {
                        // totalPreviousLightTax: Math.round(
                        //     totalPreviousLightTax
                        // ),
                        // totalPreviousWaterTax: totalPreviousWaterTax,
                        // totalPreviousHealthTax: totalPreviousHealthTax,
                        // totalPreviousPropertyTax: totalPreviousPropertyTax,
                        // totalAmount: totalAmount,
                        // previouslastReceiptNumber: previouslastReceiptNumbers,
                    };
                    // previousYearPropertyTaxData.push(totalofpreviousTax);

                    // Initialize variables
                    let totalLightTax = 0;
                    let totalWaterTax = 0;
                    let totalPropertyTax = 0;
                    let totalHealthTax = 0;
                    let totalDiscount = 0;
                    let totalPenalty = 0;
                    let totalPaidAmount = 0;

                    previousYearPropertyTaxData.forEach((item) => {
                        // Check if item.propertyTaxPayment exists and has a paidAmount property
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;
                            const paidAmount = parseFloat(record.paidAmount);

                            // Update total tax amounts
                            totalLightTax += Math.round(
                                (totalPreviousLightTax / totalAmount) *
                                    paidAmount
                            );
                            totalWaterTax += Math.round(
                                (totalPreviousWaterTax / totalAmount) *
                                    paidAmount
                            );
                            totalHealthTax += Math.round(
                                (totalPreviousHealthTax / totalAmount) *
                                    paidAmount
                            );
                            totalPropertyTax += Math.round(
                                (totalPreviousPropertyTax / totalAmount) *
                                    paidAmount
                            );
                            totalDiscount += Math.round(
                                (record.discountAmount / totalAmount) *
                                    paidAmount
                            );
                            totalPenalty += Math.round(
                                (record.penaltyAmount / totalAmount) *
                                    paidAmount
                            );
                            totalPaidAmount += paidAmount;
                        }
                    });
                    const remainingAmountObj = {
                        // lightTax: totalPreviousLightTax - totalLightTax,
                        // waterTax: totalPreviousWaterTax - totalWaterTax,
                        // healthTax: totalPreviousHealthTax - totalHealthTax,
                        // propertyTax:
                        //     totalPreviousPropertyTax -
                        //     parseFloat(totalPropertyTax),
                        // discountAmount: totalDiscount - totalDiscount,
                        // totalPenalty: totalPenalty - totalPenalty,
                        // TotalTax: totalAmount - totalPaidAmount,
                    };
                    // previousRemainingAmountData.push(remainingAmountObj);
                    // Create a totalPaidAmountRecord object
                    const totalPaidAmountRecord = {
                        // lightTax: totalLightTax,
                        // waterTax: totalWaterTax,
                        // houseTax: totalPropertyTax,
                        // healthTax: totalHealthTax,
                        // discount: totalDiscount,
                        // penalty: totalPenalty,
                        // Total: totalPaidAmount.toFixed(2), // Assuming you want two decimal places
                    };
                    // PreviousPaidAmountData.push(totalPaidAmountRecord);
                    const citizenRecord = {
                        // citizen: doc,
                        currentPropertyTaxData,
                        // currentPropertyTaxData1,
                        // currentPaidAmountData,
                        // CurrentRemainingAmountData,
                        previousYearPropertyTaxData,
                        // PreviousPaidAmountData,
                        // previousRemainingAmountData,
                        totalCurrentLightTax: Math.round(totalCurrentLightTax),
                        totalCurrentWaterTax: Math.round(totalCurrentWaterTax),
                        totalCurrentHealthTax: Math.round(
                            totalCurrentHealthTax
                        ),
                        totalCurrentPropertyTax: Math.round(
                            totalCurrentPropertyTax
                        ),
                        totalCurrentDiscountAmount:Math.round(totalCurrentDiscountAmount),
                        totalCurrentPenaltyAmount:Math.round(totalCurrentPenaltyAmount),
                        TotalCurrentAmount: Math.round(CurrentTotalAmount),
                        currentlastReceiptNumber: lastReceiptNumbers,
                        //currentpaid
                        currentPaidLightTax: Math.round(currentTotalLightTax),
                        currentPaidwaterTax: Math.round(currentTotalWaterTax),
                        currentPaidhouseTax: Math.round(
                            currentTotalPropertyTax
                        ),
                        currentPaidhealthTax: Math.round(currentTotalHealthTax),
                        currentPaiddiscount: Math.round(currentTotalDiscount),
                        currentPaidpenalty: Math.round(currentTotalPenalty),
                        currentPaidTotal: currentTotalPaidAmount.toFixed(2),
                        //currentRemaining
                        currentRemaininglightTax: Math.round(
                            totalCurrentLightTax - currentTotalLightTax
                        ),
                        currentRemainingwaterTax: Math.round(
                            totalCurrentWaterTax - currentTotalWaterTax
                        ),
                        currentRemaininghealthTax: Math.round(
                            totalCurrentHealthTax - currentTotalHealthTax
                        ),
                        currentRemainingpropertyTax:
                            totalCurrentPropertyTax -
                            parseFloat(currentTotalPropertyTax),
                        currentRemainingdiscountAmount: Math.round(
                            totalDiscountAmount - currentTotalDiscount
                        ),
                        currentRemainingtotalPenalty: Math.round(
                            totalPenaltyAmount - currentTotalPenalty
                        ),
                        currentRemainingTotalTax: Math.round(
                            CurrentTotalAmount - currentTotalPaidAmount
                        ),
                        totalPreviousLightTax: Math.round(
                            totalPreviousLightTax
                        ),
                        //previous total
                        totalPreviousLightTax: Math.round(
                            totalPreviousLightTax
                        ),
                        totalPreviousWaterTax: Math.round(
                            totalPreviousWaterTax
                        ),
                        totalPreviousHealthTax: Math.round(
                            totalPreviousHealthTax
                        ),
                        totalPreviousPropertyTax: Math.round(
                            totalPreviousPropertyTax
                        ),
                        totalPreviousDiscountAmount:Math.round(totalPreviousDiscountAmount),
                        totalPreviousPenaltyAmount:Math.round(totalPreviousPenaltyAmount),
                        totalAmount: Math.round(totalAmount),
                        previouslastReceiptNumber: previouslastReceiptNumbers,
                        //previousRemaining
                        previousRemaininglightTax: Math.round(
                            totalPreviousLightTax - totalLightTax
                        ),
                        previousRemainingwaterTax: Math.round(
                            totalPreviousWaterTax - totalWaterTax
                        ),
                        previousRemaininghealthTax: Math.round(
                            totalPreviousHealthTax - totalHealthTax
                        ),
                        previousRemainingpropertyTax:
                            totalPreviousPropertyTax -
                            parseFloat(totalPropertyTax),
                        previousRemainingdiscountAmount: Math.round(
                            totalDiscount - totalDiscount
                        ),
                        previousRemainingtotalPenalty: Math.round(
                            totalPenalty - totalPenalty
                        ),
                        previousRemainingTotalTax: Math.round(
                            totalAmount - totalPaidAmount
                        ),
                        //previousPaid
                        previousPaidlightTax: Math.round(totalLightTax),
                        previousPaidwaterTax: Math.round(totalWaterTax),
                        previousPaidhouseTax: Math.round(totalPropertyTax),
                        previousPaidhealthTax: Math.round(totalHealthTax),
                        previousPaiddiscount: Math.round(totalDiscount),
                        previousPaidpenalty: Math.round(totalPenalty),
                        previousPaidTotal: totalPaidAmount.toFixed(2),

                        //totalofcurrentandpreviousTax
                        totalOfCurrentAndPreviousLightTax: Math.round(
                            totalCurrentLightTax + totalPreviousLightTax
                        ),
                        totalOfCurrentAndPreviousWaterTax: Math.round(
                            totalCurrentWaterTax + totalPreviousWaterTax
                        ),
                        totalOfCurrentAndPreviousHealthTax: Math.round(
                            totalCurrentHealthTax + totalPreviousHealthTax
                        ),
                        totalOfCurrentAndPreviousPropertyTax: Math.round(
                            totalCurrentPropertyTax + totalPreviousPropertyTax
                        ),
                        totalOfCurrentAndPreviousDiscount: Math.round(
                            totalCurrentDiscountAmount + totalPreviousDiscountAmount
                        ),
                        totalOfCurrentAndPreviousPenalty: Math.round(
                            totalCurrentPenaltyAmount + totalPreviousPenaltyAmount
                        ),
                        totalOfCurrentAndPreviousTotalAmountTax: Math.round(
                            CurrentTotalAmount + totalAmount
                        ),
                        //total of paid current and previous
                        totalOfPaidCurrentAndPreviousLightTax: Math.round(
                            currentTotalLightTax + totalLightTax
                        ),
                        totalOfPaidCurrentAndPreviousWaterTax: Math.round(
                            currentTotalWaterTax + totalWaterTax
                        ),
                        totalOfPaidCurrentAndPreviousHealthTax: Math.round(
                            currentTotalHealthTax + totalHealthTax
                        ),
                        totalOfPaidCurrentAndPreviousPropertyTax: Math.round(
                            currentTotalPropertyTax + totalPropertyTax
                        ),
                        totalOfPaidCurrentAndPreviousDiscount: Math.round(
                            currentTotalDiscount + totalDiscount
                        ),
                        totalOfPaidCurrentAndPreviousPenalty: Math.round(
                            currentTotalPenalty + totalPenalty
                        ),
                        totalOfPaidCurrentAndPreviousTotalAmountTax: Math.round(
                            currentTotalPaidAmount + totalPaidAmount
                        ),
                      
                
                    };
                    // citizenRecords.push(citizenRecord);
                    const response = {
                        status: "Success",
                        citizenRecord,
                    };
                    return response;
                }
            }
            // const response = {
            //     status: "Success",
            //     citizenRecords,
            // };
            // return response;
        } catch (error) {
            throw error;
        }
    }
    // waterTax sample 9 annoucememnt
    async getWaterTaxAnnoucementByGpId(gpId) {
        try {
            const existingDocuments = await WaterTaxRegistrationModel.find({
                gpId: new mongoose.Types.ObjectId(gpId),
            });

            // const citizenIds = existingDocuments.map((doc) => doc.citizenId);

            // const citizenData = await citizenModel.find({
            //     citizenId: { $in: citizenIds },
            // });
            if (!existingDocuments || existingDocuments.length === 0) {
                throw new Error("Records not found");
            }

            const financialYear = await FinancialYearModel.findOne({
                isFinancialYear: true,
            });
            if (!financialYear) {
                throw new Error("Financial year not found");
            }
            const citizenRecords = [];
            for (const doc of existingDocuments) {
                if (doc.gpId) {
                    const propertyTaxRecords =
                        await PropertyTaxPaymentModel.find({
                            gpId: doc.gpId,
                        });
                    const currentPropertyTaxData = [];
                    const previousYearPropertyTaxData = [];
                    let PreviousPaidAmountData = [];
                    let currentPropertyTaxData1 = [];
                    let CurrentRemainingAmountData = [];
                    let previousRemainingAmountData = [];
                    let currentPaidAmountData = [];
                    let totalCurrentLightTax = 0; 
                    let totalCurrentWaterTax = 0;
                    let totalCurrentHealthTax = 0;
                    let totalCurrentPropertyTax = 0;
                    let totalPreviousLightTax = 0; 

                    let totalPreviousWaterTax = 0;
                    let totalPreviousHealthTax = 0;
                    let totalPreviousPropertyTax = 0;
                    let totalPenaltyAmount = 0;
                    let totalDiscountAmount = 0;
                    for (const record of propertyTaxRecords) {
                        if (record.currentyear === financialYear.displayName) {
                            const currentData = {
                                record,
                            };

                            currentPropertyTaxData.push({
                                propertyTaxPayment: record,
                            });
console.log(propertyTaxRecords);
                            if (record.waterTax) {
                                totalCurrentWaterTax +=
                                    parseFloat(record.waterTax) || 0;
                            }
                        } else {
                            previousYearPropertyTaxData.push({
                                propertyTaxPayment: record,
                            });

                            if (record.waterTax) {
                                totalPreviousWaterTax +=
                                    parseFloat(record.waterTax) || 0;
                            }
                        }
                    }

                    let CurrentTotalAmount = totalCurrentHealthTax;

                    const currentTotal = {
                        // totalCurrentWaterTax: totalCurrentWaterTax,
                    };
                    // currentPropertyTaxData1.push(currentTotal);

                    let currentTotalWaterTax = 0;

                    let currentTotalPaidAmount = 0;

                    currentPropertyTaxData.forEach((item) => {
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;

                            const paidAmount = parseFloat(record.paidAmount);

                            currentTotalWaterTax += Math.round(
                                (totalCurrentWaterTax / CurrentTotalAmount) *
                                    paidAmount
                            );

                            currentTotalPaidAmount += paidAmount;
                        }
                    });
                    const currentRemainingAmountObj = {
                        // waterTax: totalCurrentWaterTax - currentTotalWaterTax,
                        // TotalTax: CurrentTotalAmount - currentTotalPaidAmount,
                    };
                    // CurrentRemainingAmountData.push(currentRemainingAmountObj);
                    const totalCurrentPaidAmountRecord = {
                        // waterTax: currentTotalWaterTax,
                        // Total: currentTotalPaidAmount.toFixed(2), // Assuming you want two decimal places
                    };
                    // currentPaidAmountData.push(totalCurrentPaidAmountRecord);
                    //previous
                    let totalAmount = totalPreviousWaterTax;
                    const totalofpreviousTax = {
                        // totalPreviousWaterTax: totalPreviousWaterTax,
                    };
                    // previousYearPropertyTaxData.push(totalofpreviousTax);
                    // Initialize variables
                    let totalWaterTax = 0;
                    let totalPaidAmount = 0;
                    previousYearPropertyTaxData.forEach((item) => {
                        if (
                            item.propertyTaxPayment &&
                            item.propertyTaxPayment.paidAmount
                        ) {
                            const record = item.propertyTaxPayment;
                            const paidAmount = parseFloat(record.paidAmount);

                            totalWaterTax += Math.round(
                                (totalPreviousWaterTax / totalAmount) *
                                    paidAmount
                            );
                            totalPaidAmount += paidAmount;
                        }
                    });
                    const remainingAmountObj = {
                        // waterTax: totalPreviousWaterTax - totalWaterTax,
                        // TotalTax: totalAmount - totalPaidAmount,
                    };

                    // previousRemainingAmountData.push(remainingAmountObj);
                    // // Create a totalPaidAmountRecord object
                    const totalPaidAmountRecord = {
                        // waterTax: totalWaterTax,
                        // Total: totalPaidAmount.toFixed(2), // Assuming you want two decimal places
                    };
                    // PreviousPaidAmountData.push(totalPaidAmountRecord);
                    const docs = {
                        // WaterRegisterDetails: doc,
                        // citizen: citizenData[0],
                    };
                    const citizenRecord = {
                        // WatershedDetails: docs,

                        currentPropertyTaxData,
                        // currentPropertyTaxData1,
                        // currentPaidAmountData,
                        // CurrentRemainingAmountData,
                        previousYearPropertyTaxData,
                        // PreviousPaidAmountData,
                        // previousRemainingAmountData,
                        totalCurrentWaterTax: totalCurrentWaterTax,
                        currentpaidwaterTax: currentTotalWaterTax,
                        currentpaidTotal: currentTotalPaidAmount.toFixed(2),
                        currentRemainingwaterTax:
                            totalCurrentWaterTax - currentTotalWaterTax,
                        currentRemainingTotalTax:
                            CurrentTotalAmount - currentTotalPaidAmount,
                        totalPreviousWaterTax: totalPreviousWaterTax,
                        previouspaidwaterTax: totalWaterTax,
                        previouspaidTotal: totalPaidAmount.toFixed(2),
                        previousRemainingwaterTax:
                            totalPreviousWaterTax - totalWaterTax,
                        previousRemainingTotalTax:
                            totalAmount - totalPaidAmount,
                    };
                    // citizenRecords.push(citizenRecord);
                    const response = {
                        status: "Success",
                        citizenRecord,
                    };
                    return response;
                }
            }
            // const response = {
            //     status: "Success",
            //     citizenRecords,
            // };

            // return response;
        } catch (error) {
            throw error;
        }
    }
    //with all calculation and senarios
    async saveGenerateTax(gpId, propertyId, details) {
        return this.execute(async () => {
            const existingDocument = await this.model.findOne({
                gpId: new mongoose.Types.ObjectId(gpId),
                propertyId: new mongoose.Types.ObjectId(propertyId),
            });
            const financialYears = await FinancialYearModel.find({
                isFinancialYear: true,
            });
            let isDiscount = false;
            let isPenalty = false;
            if (details.currentDate) {
                const currentDateParts = details.currentDate.split("/");
                const todayYear = parseInt(currentDateParts[0]);
                const todayMonth = parseInt(currentDateParts[1]);
                for (const year of financialYears) {
                    const yearFromParts = year.from.split("/");
                    const yearToParts = year.to.split("/");
                    const yearFromYear = parseInt(yearFromParts[0]);
                    const yearFromMonth = parseInt(yearFromParts[1]);
                    const yearToYear = parseInt(yearToParts[0]);
                    if (details.currentDate) {
                        const currentDateParts = details.currentDate.split("/");
                        const savedYear = parseInt(currentDateParts[0]);
                        const todayYear = parseInt(currentDateParts[0]);
                        const todayMonth = parseInt(currentDateParts[1]);
                        const matchingFinancialYear = financialYears.find(
                            (year) => year.displayName === details.currentyear
                        );

                        // Check if currentyear doesn't match displayName or financial year is not found
                        if (matchingFinancialYear && savedYear !== todayYear) {
                            isPenalty = true;
                        }
                        let isInFinancialYear = false; // Flag to check if current year is within any financial year

                        for (const year of financialYears) {
                            const yearFromParts = year.from.split("/");
                            const yearFromYear = parseInt(yearFromParts[0]);
                            const yearFromMonth = parseInt(yearFromParts[1]);
                            const yearToParts = year.to.split("/");
                            const yearToYear = parseInt(yearToParts[0]);
                            const yearToMonth = parseInt(yearToParts[1]);

                            if (
                                (todayYear === yearFromYear &&
                                    todayMonth >= yearFromMonth) ||
                                (todayYear === yearToYear &&
                                    todayMonth <= yearToMonth)
                            ) {
                                isInFinancialYear = true; // Set the flag if the current year falls within a financial year

                                if (todayMonth >= 4 && todayMonth <= 9) {
                                    isDiscount = true;
                                    break;
                                }
                            }
                        }
                        if (!isInFinancialYear) {
                            isPenalty = true;
                        }
                    } else {
                        isPenalty = true;
                    }
                }
            }
            // console.log('existingDocument',existingDocument);

            if (existingDocument) {
                let discountAmount = 0;
                let penaltyAmount = 0;
                const updatedPaidAmount = details.paidAmount;

                if (!updatedPaidAmount) {
                    //isDiscount && !existingDocument.isDiscountApplied
                    if (isDiscount && !existingDocument.isDiscountApplied) {
                        discountAmount = existingDocument.TotalTax * 0.05; // 5% discount
                        existingDocument.isDiscountApplied = true;
                    } else {
                        if (existingDocument.isDiscountApplied == true) {
                            discountAmount = existingDocument.discountAmount;
                        }
                        return existingDocument;
                    }

                    if (isPenalty && !existingDocument.isPenaltyApplied) {
                        penaltyAmount = existingDocument.TotalTax * 0.05; // 5% penalty
                        existingDocument.isPenaltyApplied = true;
                    } else {
                        if (existingDocument.isPenaltyApplied == true) {
                            return existingDocument.penaltyAmount;
                        }
                    }
                } else {
                    existingDocument.TotalTax =
                        existingDocument.TotalTax - (updatedPaidAmount || 0);
                    console.log(existingDocument.TotalTax);
                }

                const updatedTotalTax = Math.max(
                    existingDocument.TotalTax - discountAmount + penaltyAmount
                );

                if (updatedTotalTax < 0) {
                    throw new Error("your not able paid extra amount");
                }

                let updatedStatus = existingDocument.status;
                if (updatedTotalTax === 0) {
                    updatedStatus = "Paid";
                }

                await this.model.updateOne(
                    {
                        gpId: new mongoose.Types.ObjectId(gpId),
                        propertyId: new mongoose.Types.ObjectId(propertyId),
                    },
                    {
                        isDiscountApplied: existingDocument.isDiscountApplied,
                        isPenaltyApplied: existingDocument.isPenaltyApplied,
                        status: updatedStatus,
                        receiptNumber: details.receiptNumber,
                        totalArea: details.totalArea,
                        totalAreaMeter: details.totalAreaMeter,
                        propertyTax: details.propertyTax,
                        citizenId: details.citizenId,
                        waterTax: details.waterTax,
                        lightTax: details.lightTax,
                        healthTax: details.healthTax,
                        description: details.description,
                        currentyear: details.currentyear,
                        mode: details.mode,
                        currentDate: details.currentDate,
                        paidAmount: Math.round(updatedPaidAmount),
                        discountAmount: Math.round(discountAmount),
                        discountedAmount: Math.round(details.discountedAmount),
                        updatedPenaltyAmount: Math.round(
                            details.updatedPenaltyAmount
                        ),
                        penaltyAmount: Math.round(penaltyAmount),
                        TotalTax: Math.round(updatedTotalTax),
                        isDiscount: isDiscount,
                        isPenalty: isPenalty,
                    }
                );
                const updatedDocument = await this.model.findOne({
                    gpId: new mongoose.Types.ObjectId(gpId),
                    propertyId: new mongoose.Types.ObjectId(propertyId),
                });

                return updatedDocument;
            } else {
                let a = await this.model.create({
                    gpId: new mongoose.Types.ObjectId(gpId),
                    propertyId: new mongoose.Types.ObjectId(propertyId),
                    status: details.status,
                    totalArea: details.totalArea,
                    totalAreaMeter: details.totalAreaMeter,
                    citizenId: details.citizenId,
                    propertyTax: details.propertyTax,
                    waterTax: details.waterTax,
                    lightTax: details.lightTax,
                    healthTax: details.healthTax,
                    mode: details.mode,
                    receiptNumber: details.receiptNumber,
                    description: details.description,
                    currentDate: details.currentDate,
                    currentyear: details.currentyear,
                    paidAmount: details.paidAmount,
                    propertyId: details.propertyId,
                    id: details.id,
                    TotalTax: details.TotalTax,
                    isDiscount: isDiscount, // Set the flags
                    isPenalty: isPenalty,
                });
                return a;
            }
        });
    }
}

module.exports = new PropertyTaxPaymentService(
    PropertyTaxPaymentModel,
    "propertytaxpayment"
);
