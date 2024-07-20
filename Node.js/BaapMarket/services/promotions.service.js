const { default: mongoose } = require("mongoose");
const BannerModel = require("../schema/promotions.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class BannerService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        // if (criteria.phoneNo) query.phoneNo = criteria.phoneNo;

        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new BannerService(BannerModel, "promotions");
