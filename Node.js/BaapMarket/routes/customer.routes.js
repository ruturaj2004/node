const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/customer.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");
const axios = require("axios");
const { default: mongoose } = require("mongoose");

router.post(
    "/",
    checkSchema(require("../dto/category.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const custId = +Date.now();

        req.body.custId = custId;
        // Generate MongoDB ObjectId for each address
        if (!req.body.addresses || req.body.addresses.length === 0) {
            // If no addresses are provided, assign an empty array to req.body.addresses
            req.body.addresses = [];
        } else {
            // Generate MongoDB ObjectId for each address
            const addressesWithId = req.body.addresses.map((address) => ({
                _id: new mongoose.Types.ObjectId(),
                address,
            }));

            // Use the updated addresses in the request body
            req.body.addresses = addressesWithId;
        }

        const serviceResponse = await service.create(req.body);
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
// router.post(
//     "/",
//     checkSchema(require("../dto/customer.dto")),
//     async (req, res, next) => {
//         if (ValidationHelper.requestValidationErrors(req, res)) {
//             return;
//         }

//         const { userId } = req.body;

//         const custId = +Date.now();

//         req.body.custId = custId;

//         const userDataResponse = await axios.get(
//             `https://l6v4zdocu3.execute-api.us-east-2.amazonaws.com/auth/user/${userId}`
//         );

//         const userData = userDataResponse.data.data;

//         req.body.user = userData;

//         const serviceResponse = await service.create(req.body);

//         delete serviceResponse.data.user;

//         serviceResponse.data.userId = {};

//         requestResponsehelper.sendResponse(res, serviceResponse);
//     }
// );

router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.delete("/DeleteAddress/:custId/:addressId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.deleteAddressByCustId(
        req.params.custId,
        req.params.addressId
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/:id", async (req, res) => {
    const serviceResponse = await service.updateById(req.params.id, req.body);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.put("/updateByCustId/:custId", async (req, res) => {
    if (!req.body.addresses || req.body.addresses.length === 0) {
        // If no addresses are provided, assign an empty array to req.body.addresses
        req.body.addresses = [];
    } else {
        // Generate MongoDB ObjectId for each address if it doesn't have an _id already
        req.body.addresses = req.body.addresses.map((address) => {
            if (!address._id) {
                return {
                    _id: new mongoose.Types.ObjectId(),
                    address,
                };
            }
            return address;
        });
    }

    const serviceResponse = await service.updateCustomer(
        req.params.custId,
        req.body
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/group", async (req, res) => {
    const serviceResponse = await service.getAllRequestsByCriteria({
        groupId: req.query.groupId,

        phoneNumber: req.query.phoneNumber,
    });

    requestResponsehelper.sendResponse(res, serviceResponse);
});

// const authenticationAPI =
//     "https://853ro8c885.execute-api.us-east-2.amazonaws.com/auth/user";

// router.get("/customer/:userId", async (req, res) => {
//     try {
//         const userId = req.params.userId;

//         const response = await axios.get(`${authenticationAPI}/${userId}`);

//         const userData = response.data;

//         const customerData = {
//             ...req.customerData, // Assuming you have the initial customer data available
//             user: userData, // Populate the user data
//         };

//         res.json(customerData);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             error: "An error occurred while fetching user data",
//         });
//     }
// });
router.get("/getBycustId/:custId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getByCustId(req.params.custId);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/getByGroupId/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const criteria = {
        name: req.query.name,
        phoneNumber: req.query.phoneNumber,
        userId: req.query.userId,
    };

    const serviceResponse = await service.getAllDataByGroupId(
        groupId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
module.exports = router;
