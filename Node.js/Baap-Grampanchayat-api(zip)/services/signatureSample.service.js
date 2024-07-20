const SignatureSampleModel = require("../schema/signatureSample.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class SignatureSampleService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
}

module.exports = new SignatureSampleService(SignatureSampleModel, 'signatureSample');
