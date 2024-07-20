const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../../services/propertyTax/gpWaterMeterCharge.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../../dto/propertyTax/gpWaterConnectionTax.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.saveGpWaterMeterCharge(req.body);
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/:gpId/:taxationPeriod", async (req, res) => {
    const serviceResponse = await service.getByGpId(
        req.params.gpId,
        req.params.taxationPeriod
    );

    requestResponsehelper.sendResponse(res, {
        ...serviceResponse,
        data: serviceResponse.data.data,
    });
});

module.exports = router;
