const lgdModel = require("../schema/gramPanchayathLGDCode.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class lgdService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
}

module.exports = new lgdService(lgdModel, 'GramPanchayathLGDCode');
