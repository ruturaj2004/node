const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../../services/propertyTax/properties.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");
const PropertiesModel = require("../../schema/propertyTax/properties.schema");
const { default: mongoose } = require("mongoose");

router.post(
    "/",
    checkSchema(require("../../dto/propertyTax/properties.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.create(req.body);
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.get("/find/:citizenId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getByCitizenId(req.params.citizenId);
    // Pass the search query to the service function
    requestResponsehelper.sendResponse(res, serviceResponse);
});
// router.get("/getPropertyByGpId/:gpId", async (req, res, next) => {
//     if (ValidationHelper.requestValidationErrors(req, res)) {
//         return;
//     }
//     const serviceResponse = await service.getByGpId(req.params.gpId);
//     // Pass the search query to the service function
//     requestResponsehelper.sendResponse(res, serviceResponse);
// });
router.get("/getPropertyByGpId/:gpId", async (req, res) => {
    try {
        const serviceResponse = await service.getByGpId(
            req.params.gpId,
            req.query
        );
        const combinedData = [];
        serviceResponse.data.items.forEach((item) => {
            const propertyData = item;
            const floorTaxDetails = [];
            // propertyData.floors.forEach((element) => {
            //     if (element.houseTaxRemainingAmount) {
            //         const houseTaxAfterDiscount =
            //             element.houseTaxRemainingAmount -
            //             (element.houseTaxdiscount *
            //                 element.houseTaxRemainingAmount) /
            //                 100;

            //         floorTaxDetails.push({
            //             floorNumber: element.floorNo,
            //             remainingTax: houseTaxAfterDiscount,
            //         });
            //     }
            // });
            propertyData.floors.forEach((element) => {
                if (element.propertyTax) {
                    const floorTaxAfterDiscount =
                        element.propertyTax -
                        (element.houseTaxdiscount * element.propertyTax) / 100;
                    floorTaxDetails.push({
                        floorNumber: element.floorNo,
                        houseTax: floorTaxAfterDiscount,
                    });
                }
            });
            floorTaxDetails.forEach((floor) => {
                // console.log(
                //     "floorNO",
                //     floor.floorNumber,
                //     "houseTax",
                //     floor.houseTax
                // );
            });
            const lightTaxRemainingAmount = [];
            // propertyData.floors.forEach((element) => {
            //     if (element.lightTaxRemainingAmount) {
            //         const lightTaxAfterDiscount =
            //             element.lightTaxRemainingAmount -
            //             (element.lightTaxdiscount *
            //                 element.lightTaxRemainingAmount) /
            //                 100;
            //         lightTaxRemainingAmount.push({
            //             floorNumber: element.floorNo,
            //             remainingTax: lightTaxAfterDiscount,
            //         });
            //     }
            // });
            propertyData.floors.forEach((element) => {
                if (element.lightTax) {
                    const floorTaxAfterDiscount =
                        element.lightTax -
                        (element.lightTaxdiscount * element.lightTax) / 100;
                    lightTaxRemainingAmount.push({
                        floorNumber: element.floorNo,
                        lightTax: floorTaxAfterDiscount,
                    });
                }
            });
            lightTaxRemainingAmount.forEach((floor) => {
                // console.log(
                //     `Floor ${floor.floorNumber}: Remaining Tax: ${floor.lightTax}`
                // );
            });
            const healthTaxRemainingAmount = [];
            // propertyData.floors.forEach((element) => {
            //     if (element.healthTaxRemainingAmount) {
            //         const healthTaxAfterDiscount =
            //             element.healthTaxRemainingAmount -
            //             (element.healthTaxdiscount *
            //                 element.healthTaxRemainingAmount) /
            //                 100;

            //         healthTaxRemainingAmount.push({
            //             floorNumber: element.floorNo,
            //             remainingTax: healthTaxAfterDiscount,
            //         });
            //     }
            // });
            propertyData.floors.forEach((element) => {
                if (element.healthTax) {
                    const floorTaxAfterDiscount =
                        element.healthTax -
                        (element.healthTaxdiscount * element.healthTax) / 100;
                    healthTaxRemainingAmount.push({
                        floorNumber: element.floorNo,
                        healthTax: floorTaxAfterDiscount,
                    });
                }
            });
            healthTaxRemainingAmount.forEach((floor) => {
                // console.log(
                //     `Floor ${floor.floorNumber}: Remaining Tax: ${floor.healthTax}`
                // );
            });
            const waterTaxRemainingAmount = [];
            // propertyData.floors.forEach((element) => {
            //     if (element.waterTaxRemainingAmount) {
            //         const waterTaxAfterDiscount =
            //             element.waterTaxRemainingAmount -
            //             (element.waterTaxdiscount *
            //                 element.waterTaxRemainingAmount) /
            //                 100;

            //         waterTaxRemainingAmount.push({
            //             floorNumber: element.floorNo,
            //             remainingTax: waterTaxAfterDiscount,
            //         });
            //     }
            // });
            propertyData.floors.forEach((element) => {
                if (element.waterTax) {
                    const floorTaxAfterDiscount =
                        element.waterTax -
                        (element.waterTaxdiscount * element.waterTax) / 100;
                    waterTaxRemainingAmount.push({
                        floorNumber: element.floorNo,
                        waterTax: floorTaxAfterDiscount,
                    });
                }
            });
            waterTaxRemainingAmount.forEach((floor) => {
                // console.log(
                //     `Floor ${floor.floorNumber}: Remaining Tax: ${floor.waterTax}`
                // );
            });

            const totalCalculatedFloorTax = propertyData.floors.map((floor) => {
                const floorNumber = floor.floorNo;
                const houseTax =
                    floorTaxDetails.find(
                        (item) => item.floorNumber === floorNumber
                    )?.houseTax || 0;
                const lightTax =
                    lightTaxRemainingAmount.find(
                        (item) => item.floorNumber === floorNumber
                    )?.lightTax || 0;
                const healthTax =
                    healthTaxRemainingAmount.find(
                        (item) => item.floorNumber === floorNumber
                    )?.healthTax || 0;
                const waterTax =
                    waterTaxRemainingAmount.find(
                        (item) => item.floorNumber === floorNumber
                    )?.waterTax || 0;

                const floorTotalTax =
                    houseTax + lightTax + healthTax + waterTax;

                return {
                    floorNumber: floorNumber,
                    totalTax: floorTotalTax,
                };
            });
            combinedData.push({
                propertyData: propertyData,
                floorTaxDetails: floorTaxDetails,
                lightTaxRemainingAmount: lightTaxRemainingAmount,
                healthTaxRemainingAmount: healthTaxRemainingAmount,
                waterTaxRemainingAmount: waterTaxRemainingAmount,
                totalCalculatedFloorTax: totalCalculatedFloorTax,
                totalItemsCount :serviceResponse.data.totalItemsCount
            });
        });
// console.log("data",serviceResponse.data.totalItemsCount)
        res.json({
            data: combinedData,
            // data: serviceResponse.data,
            message: "Property data with tax details fetched successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.put("/:id", async (req, res) => {
    const serviceResponse = await service.updateById(req.params.id, req.body);
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put(
    "/updateOwnerData/property/:propertyId/owner/:ownerId",
    async (req, res) => {
        try {
            const propertyId = req.params.propertyId;
            const ownerId = req.params.ownerId;
            const updateObject = {
                "owner.$[owner].firstName": req.body.firstName,
                "owner.$[owner].lastName": req.body.lastName,
                "owner.$[owner].middleName": req.body.middleName,
                "owner.$[owner].spouseName": req.body.spouseName,
                "owner.$[owner].primaryUser": req.body.primaryUser,
                "owner.$[owner].isActive": req.body.isActive,
                "owner.$[owner].tenant": req.body.tenant,
            };
            if (req.body.isActive === false) {
                updateObject["owner.$[owner].isDisable"] = true;
            }
            const arrayFilters = [
                { "owner._id": new mongoose.Types.ObjectId(ownerId) },
            ];
            const updatedProperty = await PropertiesModel.findByIdAndUpdate(
                propertyId,
                { $set: updateObject },
                { new: true, arrayFilters }
            );

            if (!updatedProperty) {
                return res.status(404).json({ error: "Property not found" });
            }

            res.json(updatedProperty);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

router.put("/updateOccupantData/:propertyId/:occupantId", async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const occupantId = req.params.occupantId;
        const updateObject = {
            "occupant.$[occupant].occupantfname": req.body.occupantfname,
            "occupant.$[occupant].occupantlname": req.body.occupantlname,
            "occupant.$[occupant].occupantmname": req.body.occupantmname,
            "occupant.$[occupant].toilet": req.body.toilet,
            "occupant.$[occupant].hasFaucetConnection":
                req.body.hasFaucetConnection,
            "occupant.$[occupant].waterConnection": req.body.waterConnection,
            "occupant.$[occupant].waterConnectionType":
                req.body.waterConnectionType,
            "occupant.$[occupant].primaryUser": req.body.primaryUser,
            "occupant.$[occupant].isActive": req.body.isActive,
            "occupant.$[occupant].tenant": req.body.tenant,
        };
        if (req.body.isActive === false) {
            updateObject["occupant.$[occupant].isDisable"] = true;
        }
        const arrayFilters = [
            { "occupant._id": mongoose.Types.ObjectId(occupantId) },
        ];
        const updatedProperty = await PropertiesModel.findByIdAndUpdate(
            propertyId,
            { $set: updateObject },
            { new: true, arrayFilters }
        );

        if (!updatedProperty) {
            return res.status(404).json({ error: "Property not found" });
        }

        res.json(updatedProperty);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/updateFloorData/:propertyId/:floorId", async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const floorId = req.params.floorId;

        // Construct the update object with fields to be updated
        const updateObject = {
            "floors.$[floor].floorNo": req.body.floorNo,
            "floors.$[floor].constructionType": req.body.constructionType,
            "floors.$[floor].length": req.body.length,
            "floors.$[floor].width": req.body.width,
            "floors.$[floor].areapersqrt": req.body.areapersqrt,
        };
        if (req.body.isActive === false) {
            updateObject["floors.$[floor].isDisable"] = true;
        }
        const arrayFilters = [
            { "floor._id": mongoose.Types.ObjectId(floorId) },
        ];
        const updatedProperty = await PropertiesModel.findByIdAndUpdate(
            propertyId,
            { $set: updateObject },
            { new: true, arrayFilters }
        );

        if (!updatedProperty) {
            return res.status(404).json({ error: "Property not found" });
        }

        res.json(updatedProperty);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getPropertyData/:gpId/:propertyId", async (req, res, next) => {
    try {
        const gpId = req.params.gpId;
        const propertyId = req.params.propertyId;

        const propertyData = await PropertiesModel.findOne({
            gpId: new mongoose.Types.ObjectId(gpId),
            _id: new mongoose.Types.ObjectId(propertyId),
        });
        console.log("propertyData", propertyData);
        if (!propertyData) {
            return res.status(404).json({ error: "Property data not found" });
        }
        // Calculate areaOfFeet Total
        let propertyTax = 0;
        propertyData.floors.forEach((element) => {
            if (element.propertyTax) {
                const floorTaxAfterDiscount =
                    element.propertyTax -
                    (element.houseTaxdiscount * element.propertyTax) / 100;
                propertyTax += floorTaxAfterDiscount;
            }
        });

        let lightTax = 0;
        propertyData.floors.forEach((element) => {
            if (element.lightTax) {  
                const floorTaxAfterDiscount =
                    element.lightTax -
                    (element.lightTaxdiscount * element.lightTax) / 100;
                lightTax += floorTaxAfterDiscount;
            }
        });

        let healthTax = 0;
        propertyData.floors.forEach((element) => {
            if (element.healthTax) {
                const floorTaxAfterDiscount =
                    element.healthTax -
                    (element.healthTaxdiscount * element.healthTax) / 100;
                healthTax += floorTaxAfterDiscount;
            }
        });

        let waterTax = 0;
        propertyData.floors.forEach((element) => {
            if (element.waterTax) {
                const floorTaxAfterDiscount =
                    element.waterTax -
                    (element.waterTaxdiscount * element.waterTax) / 100;
                waterTax += floorTaxAfterDiscount;
            }
        });
        let AllTaxTotalCalculations =
            propertyTax + lightTax + healthTax + waterTax;
        res.json({
            data: propertyData,
            propertyTax: propertyTax,
            lightTax: lightTax,
            healthTax: healthTax,
            waterTax: waterTax,
            AllTaxTotalCalculations: Math.ceil(AllTaxTotalCalculations),
            message: "Property fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// router.get("/getFloorData/:gpId/:propertyId", async (req, res, next) => {
//     z;
//     try {
//         const gpId = req.params.gpId;
//         const propertyId = req.params.propertyId;

//         const propertyData = await PropertiesModel.findOne({
//             gpId: new mongoose.Types.ObjectId(gpId),
//             _id: new mongoose.Types.ObjectId(propertyId),
//         });
//         console.log("propertyData", propertyData);
//         if (!propertyData) {
//             return res
//                 .status(404)
//                 .json({ error: "previousData data not found" });
//         }
//         // Calculate areaOfFeet Total
//         // let houseTaxRemainingAmount = 0;
//         // propertyData.floors.forEach((element) => {
//         //     if (element.houseTaxRemainingAmount) {
//         //         const floorTaxAfterDiscount =
//         //             element.houseTaxRemainingAmount -
//         //             (element.houseTaxdiscount * element.houseTaxRemainingAmount) / 100;
//         //         houseTaxRemainingAmount += floorTaxAfterDiscount;
//         //     }

//         // });
//         const floorTaxDetails = [];
//         propertyData.floors.forEach((element) => {
//             if (element.houseTaxRemainingAmount) {
//                 const houseTaxAfterDiscount =
//                     element.houseTaxRemainingAmount -
//                     (element.houseTaxdiscount *
//                         element.houseTaxRemainingAmount) /
//                         100;

//                 floorTaxDetails.push({
//                     floorNumber: element.floorNo,
//                     remainingTax: houseTaxAfterDiscount,
//                 });
//             }
//         });
//         propertyData.floors.forEach((element) => {
//             if (element.propertyTax) {
//                 const floorTaxAfterDiscount =
//                     element.propertyTax -
//                     (element.houseTaxdiscount * element.propertyTax) / 100;
//                 floorTaxDetails.push({
//                     floorNumber: element.floorNo,
//                     houseTax: floorTaxAfterDiscount,
//                 });
//             }
//         });
//         console.log("Individual house floor tax details:");
//         floorTaxDetails.forEach((floor) => {
//             // console.log(
//             //    "floorNO",floor.floorNumber,
//             //    "houseTax",floor.houseTax,
//             //    "remainingTax",floor.remainingTax,
//             // );
//         });
//         const lightTaxRemainingAmount = [];
//         propertyData.floors.forEach((element) => {
//             if (element.lightTaxRemainingAmount) {
//                 const lightTaxAfterDiscount =
//                     element.lightTaxRemainingAmount -
//                     (element.lightTaxdiscount *
//                         element.lightTaxRemainingAmount) /
//                         100;
//                 lightTaxRemainingAmount.push({
//                     floorNumber: element.floorNo,
//                     remainingTax: lightTaxAfterDiscount,
//                 });
//             }
//         });
//         propertyData.floors.forEach((element) => {
//             if (element.lightTax) {
//                 const floorTaxAfterDiscount =
//                     element.lightTax -
//                     (element.lightTaxdiscount * element.lightTax) / 100;
//                 lightTaxRemainingAmount.push({
//                     floorNumber: element.floorNo,
//                     lightTax: floorTaxAfterDiscount,
//                 });
//             }
//         });
//         console.log("Individual lightfloor tax details:");
//         lightTaxRemainingAmount.forEach((floor) => {
//             console.log(
//                 `Floor ${floor.floorNumber}: Remaining Tax: ${floor.lightTax}`
//             );
//         });
//         const healthTaxRemainingAmount = [];
//         propertyData.floors.forEach((element) => {
//             if (element.healthTaxRemainingAmount) {
//                 const healthTaxAfterDiscount =
//                     element.healthTaxRemainingAmount -
//                     (element.healthTaxdiscount *
//                         element.healthTaxRemainingAmount) /
//                         100;

//                 healthTaxRemainingAmount.push({
//                     floorNumber: element.floorNo,
//                     remainingTax: healthTaxAfterDiscount,
//                 });
//             }
//         });
//         propertyData.floors.forEach((element) => {
//             if (element.healthTax) {
//                 const floorTaxAfterDiscount =
//                     element.healthTax -
//                     (element.healthTaxdiscount * element.healthTax) / 100;
//                 healthTaxRemainingAmount.push({
//                     floorNumber: element.floorNo,
//                     healthTax: floorTaxAfterDiscount,
//                 });
//             }
//         });

//         console.log("Individualhealth floor tax details:");
//         healthTaxRemainingAmount.forEach((floor) => {
//             console.log(
//                 `Floor ${floor.floorNumber}: Remaining Tax: ${floor.healthTax}`
//             );
//         });
//         const waterTaxTaxRemainingAmount = [];
//         propertyData.floors.forEach((element) => {
//             if (element.waterTaxTaxRemainingAmount) {
//                 const waterTaxAfterDiscount =
//                     element.waterTaxTaxRemainingAmount -
//                     (element.waterTaxdiscount *
//                         element.waterTaxTaxRemainingAmount) /
//                         100;

//                 waterTaxTaxRemainingAmount.push({
//                     floorNumber: element.floorNo,
//                     remainingTax: waterTaxAfterDiscount,
//                 });
//             }
//         });
//         propertyData.floors.forEach((element) => {
//             if (element.waterTax) {
//                 const floorTaxAfterDiscount =
//                     element.waterTax -
//                     (element.waterTaxdiscount * element.waterTax) / 100;
//                 waterTaxTaxRemainingAmount.push({
//                     floorNumber: element.floorNo,
//                     waterTax: floorTaxAfterDiscount,
//                 });
//             }
//         });

//         console.log("Individual waterfloor tax details:");
//         waterTaxTaxRemainingAmount.forEach((floor) => {
//             console.log(
//                 `Floor ${floor.floorNumber}: Remaining Tax: ${floor.waterTax}`
//             );
//         });
//         // let AllPreviousTaxCalculations =
//         // floorTaxDetails + lightTaxRemainingAmount + healthTaxRemainingAmount + waterTaxTaxRemainingAmount;
//         res.json({
//             data: propertyData,
//             floorTaxDetails: floorTaxDetails,
//             lightTaxRemainingAmount: lightTaxRemainingAmount,
//             healthTaxRemainingAmount: healthTaxRemainingAmount,
//             waterTaxTaxRemainingAmount: waterTaxTaxRemainingAmount,
//             // AllPreviousTaxCalculations:Math.ceil(AllPreviousTaxCalculations),
//             message: "previous data  fetched successfully",
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

router.get("/all/Properties", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
