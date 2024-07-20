const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/wadi.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/wadi.dto")),
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
router.get("/all/gpId/:gpId", async (req, res) => {
    const gpId = req.params.gpId;
    const criteria = {
        wadiName: req.query.wadiName,
        // wardNumber: req.query.wardNumber,
    };

    const serviceResponse = await service.getDataByGpId(gpId, criteria);
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/wadi", async (req, res) => {
    const serviceResponse = await service.preparePaginationAndReturnData(
        {wadiName: new RegExp(req.query.wadiName, "i")},
        req.query
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
