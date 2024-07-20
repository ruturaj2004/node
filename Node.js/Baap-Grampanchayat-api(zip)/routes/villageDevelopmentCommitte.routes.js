const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/villageDevelopmentCommitte.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(
        require("../dto/villageDevelopmentCommitte/village-development-committe.dto")
    ),
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

router.get("/all/village-Development-committies", async (req, res) => {
    const serviceResponse = await service.preparePaginationAndReturnData(
        {
            name: new RegExp(req.query.name, "i"),
        },
        req.query
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.post(
    "/member/:committeId",
    // checkSchema(require("../dto/villageDevelopmentCommitte/village-development-committe.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.addCommitteeMember(
            req.params.committeId,
            req.body
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.put(
    "/member/:memberId",
    // checkSchema(require("../dto/villageDevelopmentCommitte/village-development-committe.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.updateCommitteeMember(
            req.params.memberId,
            req.body
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.get(
    "/member/:memberId",
    // checkSchema(require("../dto/villageDevelopmentCommitte/village-development-committe.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.getMemberById(
            req.params.memberId,
            req.query
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.delete(
    "/member/:committeeId/:memberId",
    // checkSchema(require("../dto/villageDevelopmentCommitte/village-development-committe.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.delteCommitteeMember(
            req.params.committeeId,
            req.params.memberId
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.get("/get-all-members/:committeeId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }

    const committeeId = req.params.committeeId;
    const name = req.query.name; // Get the name from the query parameter

    const serviceResponse = await service.getAllCommitteeMembersByCommitteeId(
        committeeId,
        name
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
