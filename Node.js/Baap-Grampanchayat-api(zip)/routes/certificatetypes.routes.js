const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/certificatetypes.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/certificatetypes.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        // Generate the auto ID
        const dispatchedId = +Date.now();
        // Set the generated ID in the request body
        req.body.dispatchedId = dispatchedId;
        const serviceResponse = await service.create(req.body);
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.post("/saveplaceholder", async (req, res) => {
    // Save data
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

// router.get("/:id", async (req, res) => {
//     const serviceResponse = await service.getById(req.params.id);
//     if (!serviceResponse) {
//         return res
//             .status(404)
//             .json({ error: "Data not found for the provided ID" });
//     }

//     const template = serviceResponse.data.template;
//     if (!template) {
//         return res
//             .status(400)
//             .json({ error: "Missing template in the fetched data" });
//     }

//     const { count, names } = await service.findPlaceholders(template);

//     let data = {};

//     for (let i = 0; i < names.length; i++) {
//         let name = names[i];
//         let value =
//             serviceResponse.data.gpId[name.split("_")[2]?.toLowerCase()];
//         data[name] = value || null;
//     }
//     // names.forEach(name => {
//     //     if(serviceResponse.data.gpId[name]){
//     //         data[name] = serviceResponse.data.gpId[name]
//     //     }
//     // });

//     res.send({
//         ...serviceResponse,
//         placeholderCount: count,
//         placeholderNames: [data],
//     });
// });

router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);
    if (!serviceResponse) {
        return res
            .status(404)
            .json({ error: "Data not found for the provided ID" });
    }

    const template = serviceResponse.data.template;
    const applicationtemplate = serviceResponse.data.applicationtemplate;
    if (!template && !applicationtemplate) {
        return res
            .status(400)
            .json({ error: "Missing template in the fetched data" });
    }
    // console.log("template",template, "applicationtemplate",applicationtemplate)
    const { count, names } = await service.findPlaceholders(template);
    const { count: applicationtemplateCount, names: applicationtemplateNames } =
        await service.findApplicationPlaceholders(applicationtemplate);

    let data = [];

    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        let value =
            serviceResponse.data.gpId[name.split("_")[0]?.toLowerCase()];
            console.log(name,value);
        data.push({ name, value: value || null });
    }
    let data1 = [];

    for (let i = 0; i < applicationtemplateNames.length; i++) {
        let applicationtemplateName = applicationtemplateNames[i];
        let value =
            serviceResponse.data.gpId[
                applicationtemplateName.split("_")[0]?.toLowerCase()
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
// router.get("/getByCategoryId/:categoryId", async (req, res) => {
//     try {
//         const serviceResponse = await service.getByCategoryId(
//             req.params.categoryId
//         );
//         const applicationtemplate = serviceResponse.data.applicationtemplate;

//         if (!applicationtemplate) {
//             return res.status(400).json({
//                 error: "Missing applicationtemplate in the fetched data",
//             });
//         }
//         const { count, names } = await service.findApplicationPlaceholders(
//             applicationtemplate
//         );
//         let data = [];
//         for (let i = 0; i < names.length; i++) {
//             let name = names[i];
//             let value =
//                 serviceResponse.data.gpId[name.split("_")[2]?.toLowerCase()];
//             data.push({ name, value: value || null });
//         }
//         res.send({
//             ...serviceResponse,
//             placeholderCount: count,
//             placeholderNames: data,
//         });
//     } catch (error) {
//         res.status(404).json({ error: " Data not found" }); // Send user-friendly error response
//     }
// });

router.get("/all/getByGroupId/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const criteria = {
        categoryId: req.query.categoryId,
    };
    const serviceResponse = await service.getAllDataByGroupId(
        groupId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
// router.get("/all/certificateTypes", async (req, res) => {
//     const serviceResponse = await service.getAllByCriteria({});

//     requestResponsehelper.sendResponse(res, serviceResponse);
// });
router.get("/all/certificateTypes", async (req, res) => {
    const serviceResponse = await service.getAllRequestsByCriteria({
        categoryId: req.query.categoryId,
    });

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
