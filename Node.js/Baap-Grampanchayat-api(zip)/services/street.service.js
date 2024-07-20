const StreetModel = require("../schema/street.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class StreetService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
}

module.exports = new StreetService(StreetModel, 'Street');
