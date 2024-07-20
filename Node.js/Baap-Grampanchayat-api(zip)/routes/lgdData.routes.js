const express = require("express");
const router = express.Router();
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");
const { checkSchema, check } = require("express-validator");
const lgdservice = require("../services/lgd.service");
const service = require("../services/singup.service");
const adminActionsService = require("../services/adminActions.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");

router.post(
    "/save",
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const serviceResponse = await service.savLGDdetails(req.body);

        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.post(
    "/bulkUpload",
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const serviceResponse = await adminActionsService.bulkupload(req.body);

        requestResponsehelper.sendResponse(res, serviceResponse);
    }

);

router.get("/all/LGD", async (req, res) => {
    const serviceResponse = await lgdservice.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});


module.exports = router;
