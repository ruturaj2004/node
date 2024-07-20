const StaffModel = require("../schema/staff.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class StaffService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
}

module.exports = new StaffService(StaffModel, 'staff');
