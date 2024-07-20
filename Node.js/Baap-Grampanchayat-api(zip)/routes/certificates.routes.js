const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/certificates.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");
const CertificatesModel = require("../schema/certificates.schema");
const Application = require("../schema/application.schema");

router.post(
    "/",
    checkSchema(require("../dto/certificates.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const receiptNo = await service.generateReceiptNumber();
        req.body.receiptNo = receiptNo;
        try {
            const certificateData = req.body;
            const populatedCertificateData = await CertificatesModel.populate(
                certificateData,
                { path: "applicationId", model: "application" }
            );
            if (!populatedCertificateData.applicationId) {
                return res
                    .status(404)
                    .json({ message: "Application not found." });
            }
            if (populatedCertificateData.applicationId.status === "rejected") {
                return res.status(400).json({
                    message:
                        "तुम्ही प्रमाणपत्र जारी करण्यास पात्र नाही ,तुमचा अर्ज नाकारला गेला आहे, कृपया तुमचा अर्ज नाकारण्यात आलेली समस्या तपासा",
                });
            }
            const serviceResponse = await service.create(
                populatedCertificateData
            );
            requestResponsehelper.sendResponse(res, serviceResponse);
        } catch (error) {
            console.error("Error in route handler:", error);
            res.status(500).json({ message: "Internal server error." });
        }
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
router.get("/getByCertificateId/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);
    if (!serviceResponse) {
        return res
            .status(404)
            .json({ error: "Data not found for the provided ID" });
    }
    const template = serviceResponse.data.templateId.template;
    const applicationtemplate =
        serviceResponse.data.templateId.applicationtemplate;

    if (!template && !applicationtemplate) {
        return res
            .status(400)
            .json({ error: "Missing template in the fetched data" });
    }
    const { count, names } = await service.findPlaceholders(template);
    const { count: applicationtemplateCount, names: applicationtemplateNames } =
        await service.findApplicationPlaceholders(applicationtemplate);
    let data = [];
    // for (let i = 0; i < names.length; i++) {
    //     let name = names[i];
    //     console.log(name);
    //     let value =
    //       serviceResponse.data.citizenId[name.split("_")[2]?.toLowerCase()];

    //     data.push({ name, value: value || null });
    //     console.log("value",value,name);
    //     console.log("aa",name.split("_")[2]?.toLowerCase())
    // }
    for (let i = 0; i < names.length; i++) {
        let name = names[i];

        let citizenKeys = Object.keys(serviceResponse.data.placeholderValues);
        let matchingKey = citizenKeys.find((key) => key === name);
        let value = matchingKey
            ? serviceResponse.data.placeholderValues[matchingKey]
            : null ||
              serviceResponse.data.gpId[name.split("_")[2]?.toLowerCase()];

        data.push({ name, value: value || null });
    }
    let data1 = [];

    for (let i = 0; i < applicationtemplateNames.length; i++) {
        let applicationtemplateName = applicationtemplateNames[i];
        let citizenKeys = Object.keys(serviceResponse.data.placeholderValues);

        let matchingKey = citizenKeys.find(
            (key) => key === applicationtemplateName
        );
        let value = matchingKey
            ? serviceResponse.data.placeholderValues[matchingKey]
            : null ||
              serviceResponse.data.gpId[
                  applicationtemplateName.split("_")[2]?.toLowerCase()
              ];
        data1.push({ applicationtemplateName, value: value || null });
    }
    res.send({
        ...serviceResponse,
        placeholderCount: count,
        placeholderNames: data,
        applicationtemplateCount: applicationtemplateCount,
        applicationtemplateNames: data1,
    });
});
router.get("/getByApplicationId/:applicationId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getByApplicationId(
        req.params.applicationId
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/getByGpId/:gpId", async (req, res) => {
    const gpId = req.params.gpId;
    const criteria = {
        citizenId: req.query.citizenId,
        type: req.query.type,
    };
    const serviceResponse = await service.getAllDataByGpId(gpId, criteria);
    const response = {
        data: serviceResponse.data.items,
    };
    requestResponsehelper.sendResponse(res, response);
});
router.get("/all/certificates", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
