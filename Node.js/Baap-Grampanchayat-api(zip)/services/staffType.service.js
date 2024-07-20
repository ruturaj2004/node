const StaffTypeModel = require("../schema/staffType.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class StaffTypeService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
}

module.exports = new StaffTypeService(StaffTypeModel, 'staffType');
