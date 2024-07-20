const { default: mongoose } = require("mongoose");
const GpConstructionTypeModel = require("../../schema/propertyTax/gpConstructionType.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const taxationPeriodService = require("./taxationPeriod.service");
class GpConstructionTypeService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async saveGPConstructionType(gpId, taxationPeriod, details) {
        return this.execute(async () => {
            return await this.model.updateOne(
                {
                    gpId: gpId,
                    taxationPeriod: new mongoose.Types.ObjectId(taxationPeriod),
                },
                {
                    gpId: gpId,
                    tax: details.tax,   
                    taxationPeriod: taxationPeriod,
                },
                { upsert: true, new: true }
            );
        });
    }
   
    async getByYearandGpId(gpId,from, to) {
        const period = await taxationPeriodService.getPeriodByFromAndToYear(
            from,
            to,
            "Property"
        );

        const resp = await this.execute(async () => {
            return await this.model.find({
                gpId:new mongoose.Types.ObjectId(gpId),
                taxationPeriod: period._id,
            });
        });

        return resp;
    }
    async getGPConstructionType(gpId, taxationPeriod) {
        return this.execute(async () => {
            return await this.model.findOne({
                gpId: gpId,
                taxationPeriod: new mongoose.Types.ObjectId(taxationPeriod),
            });
        });
    }
}

module.exports = new GpConstructionTypeService(
    GpConstructionTypeModel,
    "gpConstructionType"
);
