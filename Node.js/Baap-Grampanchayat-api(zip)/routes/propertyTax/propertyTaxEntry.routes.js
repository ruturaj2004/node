const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../../services/propertyTax/propertyTaxEntry.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post("/addOwnerDetails", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.addOwnerDetails(req.body);
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.post("/updateOwnerDetails/:id", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.updateOwnerDetails(
        req.body,
        req.params.id
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.post("/addProperty/:id", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.addProperty(req.body, req.params.id);
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.post("/updateProperty/:entryid/:propId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.updateProperty(
        req.body,
        req.params.entryid,
        req.params.propId
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.delete(
    "/deleteProperty/:id/:propertyDetailsId",
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.deleteProperty(
            req.params.propertyDetailsId,
            req.params.id
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.get("/:id", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getById(req.params.id);
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/byCriteria", async (req, res) => {
    const serviceResponse = await service.preparePaginationAndReturnData(
        {},
        req.query
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
