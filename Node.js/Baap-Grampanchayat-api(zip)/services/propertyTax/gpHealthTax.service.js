const { default: mongoose } = require("mongoose");
const GpHealthTaxModel = require("../../schema/propertyTax/gpHealthTax.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const taxationPeriodService = require("./taxationPeriod.service");

class GPHealthTaxService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async saveGpHealthTax(details) {
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
    async getByYearandGpId(gpId, from, to) {
        const period = await taxationPeriodService.getPeriodByFromAndToYear(
            from, 
            to,
            "Health"
        );

        const resp = await this.execute(async () => {
            return await this.model.find({
                gpId: new mongoose.Types.ObjectId(gpId),
                taxationPeriod: period._id,
            });
        });

        return resp;
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

module.exports = new GPHealthTaxService(GpHealthTaxModel, "GpHealthTax");
