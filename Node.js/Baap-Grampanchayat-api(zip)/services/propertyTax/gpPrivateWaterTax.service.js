const { default: mongoose } = require("mongoose");
const gpPrivateWaterTaxModel = require("../../schema/propertyTax/gpPrivateWaterTax.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const taxationPeriodService = require("./taxationPeriod.service");

class gpPrivateWaterTaxService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    async getByYearandGpId(gpId, from, to) {
        const period = await taxationPeriodService.getPeriodByFromAndToYear(
            from,
            to,
            "Water"
        );

        const resp = await this.execute(async () => {
            return await this.model.find({
                gpId: new mongoose.Types.ObjectId(gpId),
                taxationPeriod: period._id,
            });
        });

        return resp;
    }
    async getTaxTypeGpPrivateValue(gpId, type) {
        return this.execute(async () => {
            const query = {
                gpId: gpId,
                "tax.type": new mongoose.Types.ObjectId(type),
            };

            // if (taxationPeriod && taxationPeriod !== "ALL") {
            //     query["taxationPeriod"] = new mongoose.Types.ObjectId(
            //         taxationPeriod
            //     );
            // }
            const serviceResponse = await this.getAllByCriteria(query);
            const result = serviceResponse.data.items;

            // Extract the desired tax value based on the provided type
            const taxType = result.map((item) => {
                const taxEntry = item.tax.find((tax) =>
                    tax.type.equals(new mongoose.Types.ObjectId(type))
                );
                return {
                    gpId: item.gpId,
                    // taxationPeriod: item.taxationPeriod,
                    taxType: taxEntry ? taxEntry.type : null,
                    taxValue: taxEntry ? taxEntry.value : null,
                };
            });

            return taxType;
        });
    }

    async saveGpPrivateWaterTax(details) {
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
                    taxationPeriod: details.ttaxationPeriod,
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

module.exports = new gpPrivateWaterTaxService(
    gpPrivateWaterTaxModel,
    "gpPrivateWaterTax"
);
