const { default: mongoose } = require("mongoose");
const gpWaterMeterChargeModel = require("../../schema/propertyTax/gpWaterMeterCharge.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class gpWaterMeterChargeService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async saveGpWaterMeterCharge(details) {
        return this.execute(async () => {
            return await this.model.updateOne(
                {
                    gpId: details.gpId,
                    taxationPeriod: new mongoose.Types.ObjectId(
                        details.taxationPeriod
                    ),
                },
                {
                    gpId: details.gpId,
                    taxationPeriod: details.taxationPeriod,
                    tax: details.tax,
                },
                { upsert: true, new: true }
            );
        });
    }

    async getByGpId(gpId, taxationPeriod) {
        return this.execute(async () => {
            const query = {
                gpId: gpId,
            };
            if (taxationPeriod && taxationPeriod !== "ALL") {
                query["taxationPeriod"] = new mongoose.Types.ObjectId(
                    taxationPeriod
                );
            }
            return await this.getAllByCriteria(query);
        });
    }
}

module.exports = new gpWaterMeterChargeService(
    gpWaterMeterChargeModel,
    "gpWaterMeterCharge"
);
