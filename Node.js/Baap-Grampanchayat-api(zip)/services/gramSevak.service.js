const { default: mongoose } = require("mongoose");
const GramSevakModel = require("../schema/gramSevak.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class GramSevakService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    getGramSevaks(gpId, criteria) {
        return this.preparePaginationAndReturnData(
            {
                gpId: new mongoose.Types.ObjectId(gpId),
                name: new RegExp(criteria.name, "i"),
            },
            criteria
        );
    }
}

module.exports = new GramSevakService(GramSevakModel, "gramSevak");
