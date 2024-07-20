const { default: mongoose } = require("mongoose");
const LightTaxModel = require("../../schema/propertyTax/lighttax.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const taxationPeriodService = require("./taxationPeriod.service");

class LightTaxService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    async getByMin(taxationPeriod, criteria) {
        const query = {
            taxationPeriod: new mongoose.Types.ObjectId(taxationPeriod),
        };

        if (criteria.min) {
            query["propertyArea.min"] = criteria.min;
        }

        if (criteria.max) {
            query["propertyArea.max"] = criteria.max;
        }

        return await this.preparePaginationAndReturnData(query, criteria);
    }
    async getByTaxationPeriod(taxationPeriod, pagination) {
        return await this.preparePaginationAndReturnData(
            {
                taxationPeriod: new mongoose.Types.ObjectId(taxationPeriod),
            },
            pagination
        );
    }
    async getByYear(from, to) {
        const period = await taxationPeriodService.getPeriodByFromAndToYear(
            from,
            to,
            "Light"
        );

        const resp = await this.execute(async () => {
            return await this.model.find({
                taxationPeriod: period._id,
            });
        });

        return resp;
    }
}

module.exports = new LightTaxService(LightTaxModel, "lighttax");
