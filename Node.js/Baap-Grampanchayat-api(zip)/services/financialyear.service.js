const FinancialYearModel = require("../schema/financialyear.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class FinancialYearService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
}

module.exports = new FinancialYearService(FinancialYearModel, 'financialyear');
