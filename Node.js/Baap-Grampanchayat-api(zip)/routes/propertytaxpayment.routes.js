const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/propertytaxpayment.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/:gpId/:propertyId",
    checkSchema(require("../dto/propertytaxpayment.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const receiptNumber =await service.generateReceiptNumber(req.body.propertyId);
        req.body.receiptNumber = receiptNumber;
        const serviceResponse = await service.saveGenerateTax(
            req.params.gpId,
            req.params.propertyId,
            req.body
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
// router.post(
//     "/",
//     checkSchema(require("../dto/propertytaxpayment.dto")),
//     async (req, res, next) => {
//         if (ValidationHelper.requestValidationErrors(req, res)) {
//             return;
//         }
//         const serviceResponse = await service.create(req.body);
//         requestResponsehelper.sendResponse(res, serviceResponse);
//     }
// );
// router.post(
//     "/payment/",
//     checkSchema(require("../dto/propertytaxpayment.dto")),
//     async (req, res, next) => {
//         if (ValidationHelper.requestValidationErrors(req, res)) {
//             return;
//         }
//         const paymentDate = new Date(req.body.paymentDate);
//         const currentYear = paymentDate.getFullYear();
//         const financialYearStart = new Date(currentYear, 3, 1);
//         const financialYearEnd = new Date(currentYear + 1, 2, 31);
//         const serviceResponse = await service.create(req.body);
//         if (
//             paymentDate >= financialYearStart &&
//             paymentDate <= financialYearEnd
//         ) {
//             serviceResponse.discount = serviceResponse.amount * 0.05;
//         } else if (paymentDate > financialYearEnd) {
//             // Payment is after the financial year, apply 5% penalty
//             serviceResponse.penalty = serviceResponse.amount * 0.05;
//         }
//         requestResponsehelper.sendResponse(res, serviceResponse);
//     }
// );

router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/:id", async (req, res) => {
    const serviceResponse = await service.updateById(req.params.id, req.body);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getbygpid/:gpId", async (req, res) => {
    const serviceResponse = await service.getByGpId(req.params.gpId);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getbygpid/:gpId", async (req, res) => {
    const serviceResponse = await service.getByGpId(req.params.gpId);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/getByGroupId/:gpId/:propertyId", async (req, res) => {
    const gpId = req.params.gpId;
    const propertyId = req.params.propertyId;
    const criteria = {
        // propertyId: req.query.propertyId,
        status: req.query.status,
    };
    const serviceResponse = await service.getAllDataByGroupId(
        gpId,
        propertyId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/propertysample9/gpId/:gpId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getPropertySample9ByGpIdAndCitizenId(
        req.params.gpId
        // req.params.citizenId
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getTaxSample9/gpId/:gpId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getTaxSample9ByGpId(
        req.params.gpId
        // req.params.citizenId
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/generateInvoiceByCitizenId/citizen/:citizenId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.generateInvoiceByCitizenId(
        req.params.citizenId
        // req.params.citizenId
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/generateTaxBillByCitizenId/citizen/:citizenId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const citizenId = req.params.citizenId;
    const currentDate = req.query.currentDate;
    if (!currentDate) {
        const errorResponse = {
            status: "Error",
            message: "Current date is required as a query parameter."
        };
        return res.status(400).json(errorResponse); // Return a 400 Bad Request status
    }

    const serviceResponse = await service.generateTaxBillByCitizenId(
        citizenId,
        currentDate
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/getWaterRegistrationByGpId/gpId/:gpId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getWaterRegistrationByGpId(
        req.params.gpId
        // req.params.citizenId
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getWaterTaxAnnoucementByGpId/gpId/:gpId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getWaterTaxAnnoucementByGpId(
        req.params.gpId
        // req.params.citizenId
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getByCitizenId/gpId/:gpId/citizen/:citizenId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getByCitizenId(
        req.params.gpId,
        req.params.citizenId
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/propertyTaxPayment", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
