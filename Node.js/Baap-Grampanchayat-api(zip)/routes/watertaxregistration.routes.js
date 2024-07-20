const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/watertaxregistration.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/watertaxregistration.dto")),
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
router.get("/searchQuery/byGpId/:gpId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const searchQuery = req.query.searchQuery;

    try {
        const serviceResponse = await service.getByGpIds(
            req.params.gpId,
            searchQuery
        );
    
        if (serviceResponse.length === 0) {
            // Return "not found" error
            const notFoundError = new Error("Need to add Property");
            notFoundError.status = 404;
            throw notFoundError;
        }

        // Pass the response to the client
        requestResponsehelper.sendResponse(res, serviceResponse);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

router.get("/all/getByGpId/:gpId", async (req, res) => {
    const gpId = req.params.gpId;
    const criteria = {
        citizenId: req.query.citizenId,   

    };
    const serviceResponse = await service.getAllDataByGpId(
        gpId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/waterTaxRegistration", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
