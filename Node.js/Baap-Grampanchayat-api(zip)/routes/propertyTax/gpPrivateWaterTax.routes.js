const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../../services/propertyTax/gpPrivateWaterTax.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../../dto/propertyTax/gpPrivateWaterTax.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.saveGpPrivateWaterTax(req.body);
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/byYears/:gpId/:from/:to", async (req, res) => {
    const serviceResponse = await service.getByYearandGpId(
        req.params.gpId,
        req.params.from,
        req.params.to
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getTaxTypeGpPrivateValue/:gpId/:type", async (req, res) => {
    const serviceResponse = await service.getTaxTypeGpPrivateValue(
        req.params.gpId,
        // req.params.taxationPeriod,
        req.params.type
    );
    // console.log(serviceResponse)
    requestResponsehelper.sendResponse(res, {
        ...serviceResponse,
        data: serviceResponse,
    });
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
