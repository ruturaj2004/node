const { default: mongoose } = require("mongoose");
const ConstructionTypeModel = require("../../schema/propertyTax/constructionType.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const taxationPeriodService = require("./taxationPeriod.service");

class ConstructionTypeService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
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
            "Property"
        );

        const resp = await this.execute(async () => {
            return await this.model.find({
                taxationPeriod: period._id,
            });
        });

        return resp;
    }
}

module.exports = new ConstructionTypeService(
    ConstructionTypeModel,
    "constructionType"
);
