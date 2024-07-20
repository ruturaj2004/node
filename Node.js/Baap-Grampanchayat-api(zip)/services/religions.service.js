const ReligionsModel = require("../schema/religions.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class ReligionsService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new ReligionsService(ReligionsModel, 'religions');
