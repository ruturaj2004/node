const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/grampanchayath.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.get("/get-gp-details-by-user/:userId", async (req, res) => {
    const serviceResponse = await service.getGpDetailsByUserId(
        req.params.userId
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/allGps", async (req, res) => {
    const serviceResponse = await service.getAllGPs();

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/getbyid/:gpId", async (req, res) => {
    const serviceResponse = await service.getById(req.params.gpId);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/updateGpDetails/:gpid", async (req, res) => {
    const serviceResponse = await service.updateGPDetails(
        req.params.gpid,
        req.body
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
