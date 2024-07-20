const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../../services/propertyTax/citizen.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../../dto/propertyTax/citizen.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const citizenId = +Date.now();
  
      req.body.citizenId = citizenId;
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
// router.get("/getByGpId/:gpId", async (req, res, next) => {
//     if (ValidationHelper.requestValidationErrors(req, res)) {
//         return;
//     }
//     const serviceResponse = await service.getBygpId(req.params.gpId);
//     requestResponsehelper.sendResponse(res, serviceResponse);
// });
router.get("/getByGpId/:gpId", async (req, res) => {
    const gpId = req.params.gpId;
    const criteria = {
        name: req.query.name,
    };
    const serviceResponse = await service.getBygpId(gpId, criteria);
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/searchquery/:gpId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const searchQuery = req.query.searchQuery; // Retrieve the search query parameter
    const serviceResponse = await service.getByGpIds(
        req.params.gpId,
        searchQuery
    );
    // Pass the search query to the service function
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getByCitizenId/:citizenId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
   
    const serviceResponse = await service.getByCitizenId(
        req.params.citizenId,
     
    );
    console.log(serviceResponse);
    // Pass the search query to the service function
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/citizen", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
