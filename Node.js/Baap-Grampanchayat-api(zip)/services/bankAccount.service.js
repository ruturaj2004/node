const BankAccountModel = require("../schema/bankAccount.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class BankAccountService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
}

module.exports = new BankAccountService(BankAccountModel, 'bankAccount');
