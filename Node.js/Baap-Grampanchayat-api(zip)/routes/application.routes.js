const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/application.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/application.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const paymentReceiptNo = await service.generateReceiptNumber();
        req.body.paymentReceiptNo = paymentReceiptNo;
        const serviceResponse = await service.create(req.body);
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.post("/saveplaceholder", async (req, res) => {
    // Save datapdb
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.create(req.body);
    // Find placeholders
    const template = req.body.template;
    if (!template) {
        return res
            .status(400)
            .json({ error: "Missing template in the request body" });
    }
    const { count, names } = await service.findPlaceholders(template);

    // Respond with both the saved data and the placeholder information
    res.send({
        serviceResponse,
        placeholderCount: count,
        placeholderNames: names,
    });
    // console.log({ serviceResponse, placeholderCount: count, placeholderNames: names });
});

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
router.get("/getByCitizenId/:citizenId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getByCitizenId(req.params.citizenId);
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/getByGpId/:gpId", async (req, res) => {
    const gpId = req.params.gpId;
    const criteria = {
        citizenId: req.query.citizenId,
        // type: req.query.type,
    };
    const serviceResponse = await service.getAllDataByGpId(gpId, criteria);
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/Application", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
