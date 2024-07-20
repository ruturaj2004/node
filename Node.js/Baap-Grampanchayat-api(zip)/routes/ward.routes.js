const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/ward.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/wards/ward.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        console.log(req);
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

// router.get("/all/:gpid", async (req, res) => {
//     const serviceResponse = await service.getWardData(
//         req.params.gpid,
//         req.query
//     );

//     requestResponsehelper.sendResponse(res, serviceResponse);
// });
router.get("/all/:gpid", async (req, res) => {
    const gpid = req.params.gpid;
    const criteria = {
        wardNumbers: req.query.wardNumbers,
        wardNumber: req.query.wardNumber,
    };

    const serviceResponse = await service.getWardData(gpid, criteria);
    requestResponsehelper.sendResponse(res, serviceResponse);
});
module.exports = router;
