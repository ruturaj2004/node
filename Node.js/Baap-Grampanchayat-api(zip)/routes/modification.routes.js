const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/modification.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/ModificationOfOwner/:gpId/:propertyId/:ownerId",
    checkSchema(require("../dto/modification.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const modificationNumber = +Date.now();
        // Set the generated ID in the request body
        req.body.modificationNumber = modificationNumber;
        const serviceResponse = await service.saveGPByModificationOwner(
            req.params.gpId,
            req.params.propertyId,
            // req.params.ownerId,
            req.body
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.post(
    "/",
    checkSchema(require("../dto/modification.dto")),
    async (req, res) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const modificationNumber = +Date.now();
        // Set the generated ID in the request body
        req.body.modificationNumber = modificationNumber;
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
router.get("/getModification/:gpId/:propertyId", async (req, res) => {
    const serviceResponse = await service.getModificationData(
        req.params.gpId,
        req.params.propertyId
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/getByGpId/:gpId", async (req, res) => {
    const gpId = req.params.gpId;
    const criteria = {
        propertyId: req.query.propertyId,
     
    };
    const serviceResponse = await service.getAllDataByGpId(gpId, criteria);
    const response = {
        data: serviceResponse.data.items,
    };
    requestResponsehelper.sendResponse(res, response);
});
router.get("/all/modification", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
