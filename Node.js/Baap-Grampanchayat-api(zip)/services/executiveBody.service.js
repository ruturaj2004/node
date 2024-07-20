const { default: mongoose } = require("mongoose");
const ExecutiveBodyModel = require("../schema/executiveBody.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class ExecutiveBodyService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getExecutiveBodies(gpId, criteria) {
        return this.preparePaginationAndReturnData(
            {
                gpId: new mongoose.Types.ObjectId(gpId),
                memberName: new RegExp(criteria.memberName, "i"),
            },
            criteria
        );
    }
}

module.exports = new ExecutiveBodyService(ExecutiveBodyModel, "ExecutiveBody");
