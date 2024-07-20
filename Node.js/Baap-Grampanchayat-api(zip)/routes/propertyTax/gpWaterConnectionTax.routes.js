const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../../services/propertyTax/gpWaterConnectionTax.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../../dto/propertyTax/gpWaterConnectionTax.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.saveGpWaterConnectionTax(
            req.body
        );
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
router.get("/all/getByGpId/:gpId", async (req, res) => {
    const gpId = req.params.gpId;
    const criteria = {
        // name: req.query.name,
    };

    const serviceResponse = await service.getAllByGpId(
        gpId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getTaxTypeGpMasterValue/:gpId/:type", async (req, res) => {
    const serviceResponse = await service.getTaxTypeGpMasterValue(
        req.params.gpId,
        
        req.params.type
    );
    requestResponsehelper.sendResponse(res, {
        ...serviceResponse,
        data: serviceResponse,
    });
});

module.exports = router;
