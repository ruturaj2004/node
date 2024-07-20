const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/usergroup.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/usergroup.dto")),
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
router.put("/updateByCustId/:custId", async (req, res) => {
    const serviceResponse = await service.updateMembership(
        req.params.custId,
        req.body
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/find/get-membership-details", async (req, res) => {
    const groupId = parseInt(req.query.groupId);
    const userId = req.query.userId;

    if (!groupId) {
        res.status(400).send({
            status: 400,
            success: false,
            data: undefined,
            message: "Group ID is required",
        });
        return;
    }

    const serviceResponse = await service.findMembershipByGroupIdAndUserId(
        groupId,
        userId
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/getByGroupId/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const criteria = {
        phoneNo: req.query.phoneNo,
        name: req.query.name,
    };

    const serviceResponse = await service.getAllDataByGroupId(
        groupId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/userGroup", async (req, res) => {
    const serviceResponse = await service.getAllRequestsByCriteria({
        groupId: req.query.groupId,
        phoneNo:req.query.phoneNo,
    });

    requestResponsehelper.sendResponse(res, serviceResponse);
});

  

module.exports = router;
