const ShopModel = require("../schema/shop.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class ShopService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        if (criteria.competitionId) query.competitionId = criteria.competitionId;

        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new ShopService(ShopModel, 'shop');
