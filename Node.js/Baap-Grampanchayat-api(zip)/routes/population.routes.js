const express = require("express");
const router = express.Router();

const { checkSchema } = require("express-validator");

const service = require("../services/population.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/population/save-population.dto")),
    async (req, res) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const serviceResponse = await service.create(req.body);

        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.get("/:gpid", async (req, res) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }

    const serviceResponse = await service.getAllPopulationEntries(
        req.params.gpid
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/getPopulationByYear/:gpid/:year", async (req, res) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getPopulationByYear(
        req.params.year,
        req.params.gpid,
        req.query
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put(
    "/updatePopulation/:id",
    checkSchema(require("../dto/population/save-population.dto")),
    async (req, res) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const serviceResponse = await service.updateById(
            req.params.id,
            req.body
        );

        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.delete("/:id", async (req, res) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
