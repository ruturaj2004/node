const { default: mongoose } = require("mongoose");
const SelfDeclarationModel = require("../schema/selfdeclaration.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class SelfDeclarationService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGpId(gpId, criteria) {
        const query = {
            gpId: new mongoose.Types.ObjectId(gpId),
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new SelfDeclarationService(
    SelfDeclarationModel,
    "selfdeclaration"
);
