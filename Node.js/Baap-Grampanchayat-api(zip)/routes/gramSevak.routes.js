const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/gramSevak.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/gramSevak.dto")),
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

router.get("/", async (req, res) => {
    const serviceResponse = await service.preparePaginationAndReturnData({}, req.query);


    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/gram-sevak/:gpid", async (req, res) => {
    const serviceResponse = await service.getGramSevaks(
    //   {  name: new RegExp(req.query.name, "i")},
        req.params.gpid,
        req.query,

    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put(
    "/:id",
    checkSchema(require("../dto/gramSevak.dto")),
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

module.exports = router;
