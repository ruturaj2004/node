const express = require("express");
const router = express.Router();

const { checkSchema } = require("express-validator");

const service = require("../services/adminActions.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.get("/get-all-pending-approval-gps", async (req, res) => {
    // validates inputs ,
    // ignoring partas all params are optional in this api

    // make service call

    const serviceResponse = await service.getAllPendingApprovalGPs(req.query);

    // send response
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put(
    "/gp/approve/:id",
    checkSchema({
        id: {
            optional: false,
        },
    }),
    async (req, res) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const serviceResponse = await service.approveGp(req.params.id);

        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.get("/Status/", async (req, res) => {
    const serviceResponse = await service.preparePaginationAndReturnData(
        {
            status: req.query.status,
        },
        req.query
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.put(
    "/gp/reject/:id",
    checkSchema({
        id: {
            optional: false,
        },
    }),
    async (req, res) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const serviceResponse = await service.rejectGp(req.params.id);

        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.delete("/superAdmin/cleanupGPData", async (req, res) => {
    const serviceResponse = await service.cleanupGPData(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
