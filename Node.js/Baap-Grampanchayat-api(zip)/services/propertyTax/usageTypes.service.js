const UsageTypesModel = require("../../schema/propertyTax/usageTypes.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class UsageTypesService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
}

module.exports = new UsageTypesService(UsageTypesModel, 'usageTypes');
