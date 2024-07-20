const { default: mongoose } = require("mongoose");
const GpSurvayNumberDetailsModel = require("../schema/gpSurvayNumberDetails.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const { number } = require("../dto/gpSurvayNumberDetails.dto");

class GpSurvayNumberDetailsService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllSurvayNumberDetailsByGpId(gpId, criteria) {
        return this.preparePaginationAndReturnData(
            {
                gpId: new mongoose.Types.ObjectId(gpId),
                number: new RegExp(criteria.number),
            },
            criteria
        );
    }
    async getByTaxationPeriod(taxationPeriod, pagination) {
        return await this.preparePaginationAndReturnData(
            {
                taxationPeriod: new mongoose.Types.ObjectId(taxationPeriod),
            },
            pagination
        );
    }
}

module.exports = new GpSurvayNumberDetailsService(
    GpSurvayNumberDetailsModel,
    "gpSurvayNumberDetails"
);
