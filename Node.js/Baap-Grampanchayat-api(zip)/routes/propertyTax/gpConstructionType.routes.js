const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../../services/propertyTax/gpConstructionType.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/:gpId/:taxationPeriod",
    checkSchema(require("../../dto/propertyTax/gpConstructionType.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.saveGPConstructionType(
            req.params.gpId,
            req.params.taxationPeriod,
            req.body
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.get("/byYears/:gpId/:from/:to", async (req, res) => {
    const serviceResponse = await service.getByYearandGpId(
        req.params.gpId,
        req.params.from,
        req.params.to
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/:gpId/:taxationPeriod", async (req, res) => {
    const serviceResponse = await service.getGPConstructionType(
        req.params.gpId,
        req.params.taxationPeriod
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
