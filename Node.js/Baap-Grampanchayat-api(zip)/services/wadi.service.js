const { default: mongoose } = require("mongoose");
const WadiModel = require("../schema/wadi.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class WadiService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getDataByGpId(gpId, criteria) {
        const query = {
            gpId: new mongoose.Types.ObjectId(gpId),
        };
        if (criteria.wadiName) query.wadiName = criteria.wadiName;
        // if (criteria.wardNumbers) query.wardNumbers = criteria.wardNumbers;
        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new WadiService(WadiModel, 'wadi');
