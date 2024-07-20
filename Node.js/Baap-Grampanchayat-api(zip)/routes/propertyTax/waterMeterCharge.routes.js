const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../../services/propertyTax/waterMeterCharge.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../../dto/propertyTax/waterMeterCharge.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.create(req.body);
        requestResponsehelper.sendResponse(res, serviceResponse);
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
router.get("/byYears/:from/:to", async (req, res) => {
    const serviceResponse = await service.getByYear(
        req.params.from,
        req.params.to
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/byMin/:taxationPeriod", async (req, res) => {
    const taxationPeriod = req.params.taxationPeriod;
    const criteria = {
        min: req.query.min,
        max: req.query.max
    };

    const serviceResponse = await service.getByMin(taxationPeriod, criteria);
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/by-taxation-period/:taxationPeriod", async (req, res) => {
    const serviceResponse = await service.getByTaxationPeriod(
        req.params.taxationPeriod,
        req.query
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
