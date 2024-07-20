const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../../services/propertyTax/gpTaxMasterData.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

// router.post(
//     "/",
//     // checkSchema(require("../../dto/propertytax/gpTaxMasterData.dto")),
//     async (req, res, next) => {
//         if (ValidationHelper.requestValidationErrors(req, res)) {
//             return;
//         }
//         const serviceResponse = await service.create(req.body);
//         requestResponsehelper.sendResponse(res, serviceResponse);
//     }
// );

router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
}); 

// router.put("/:id", async (req, res) => {
//     const serviceResponse = await service.updateById(req.params.id, req.body);

//     requestResponsehelper.sendResponse(res, serviceResponse);
// });

// router.get("/:id", async (req, res) => {
//     const serviceResponse = await service.getById(req.params.id);

//     requestResponsehelper.sendResponse(res, serviceResponse);
// });

router.get("/getBy-gpid/:gpId", async (req, res) => {
    const serviceResponse = await service.getGpMasterDataByGPID(
        req.params.gpId
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/byYears/:gpId/:from/:to", async (req, res) => {
    const serviceResponse = await service.getByYearandGpId(
        req.params.gpId,
        req.params.from,
        req.params.to
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/:gpId/:taxationPeriod", async (req, res) => {
    const serviceResponse = await service.getGpMasterDataByGPID(
        req.params.gpId,
        req.params.taxationPeriod
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.post("/:gpId/:taxationPeriod", async (req, res) => {
    const serviceResponse = await service.saveGPtaxMaster(
        req.params.gpId,
        req.params.taxationPeriod,
        req.body
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
// router.get("/all/gp-tax-master-data", async (req, res) => {
//     const serviceResponse = await service.preparePaginationAndReturnData(
//         {},
//         req.query
//     );

//     requestResponsehelper.sendResponse(res, serviceResponse);
// });

module.exports = router;
