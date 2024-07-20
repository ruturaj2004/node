const express = require("express");
const router = express.Router();
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");
const { checkSchema, check } = require("express-validator");

const service = require("../services/singup.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");

router.get(
    "/get-village-details-by-lgd/:code",
    checkSchema({
        code: {
            isLength: { options: { min: 4 } },
        },
    }),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const serviceResponse = await service.getGpdetails(req.params.code);

        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.post(
    "/register",
    // checkSchema(),
    async (req, res) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.saveGramPanchayath(req.body);

        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.post(
    "/registerNew",
    checkSchema(require("../dto/signup/registerGP.dto")),
    async (req, res) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.registerUserGP(req.body);

        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.post("/registeruser", async (req, res) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.registerUser(req.body);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
