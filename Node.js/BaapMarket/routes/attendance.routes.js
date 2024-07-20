const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/attendance.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/attendance.dto")),
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
// router.get("/all/getByGroupId/:groupId", async (req, res) => {
//     const groupId = req.params.groupId;
//     const criteria = {
//         name: req.query.name,

//     };

//     const serviceResponse = await service.getAllDataByGroupId(
//         groupId,
//         criteria
//     );
//     requestResponsehelper.sendResponse(res, serviceResponse);
// });
router.get("/all/attendance", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});
// router.get("/all/getByGroupId/:groupId", async (req, res) => {
//     const groupId = req.params.groupId;
//     const page = parseInt(req.query.page) || 1; // Get the page number from query parameter, default to 1
//     const limit = parseInt(req.query.limit) || 10; // Get the items per page from query parameter, default to 10

//     const criteria = {
//         name: req.query.code,
//     };

//     const serviceResponse = await service.getAllDataByGroupIdWithPagination(
//         groupId,
//         criteria,
//         page,
//         limit
//     );

//     requestResponsehelper.sendResponse(res, serviceResponse);
// });
router.get('/group/:groupId', async (req, res) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const page = parseInt(req.query.page) || 1; 
    const size = parseInt(req.query.size) || 10;
    try {
        const serviceResponse = await service.getDataByGroupId(req.params.groupId, page, size);
        const data = await serviceResponse.data;
        res.status(200).json({
            message: "Data fetch successfully",
    data,
            totalItemsCount: serviceResponse.totalItemsCount,
            page,
            size
        });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
        });

module.exports = router;
