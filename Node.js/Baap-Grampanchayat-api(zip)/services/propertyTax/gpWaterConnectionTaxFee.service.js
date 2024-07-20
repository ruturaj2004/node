const { default: mongoose } = require("mongoose");
const gpWaterConnectionTaxFeeModel = require("../../schema/propertyTax/gpWaterConnectionTaxFee.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const taxationPeriodService = require("./taxationPeriod.service");

class gpWaterConnectionTaxFeeService extends BaseService {
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
    async saveGpWaterConnectionTax(details) {
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
    async getTaxTypeGpMasterValue(gpId, type) {
        return this.execute(async () => {
            const query = {
                gpId: gpId,
                "tax.type": new mongoose.Types.ObjectId(type),
            };

            // if (taxationPeriod && taxationPeriod !== "ALL") {
            //     query["taxationPeriod"] = new mongoose.Types.ObjectId(taxationPeriod);
            // }

            console.log("query: ", query);

            const serviceResponse = await this.getAllByCriteria(query);

            console.log("result", serviceResponse);

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
    getAllByGpId(gpId, criteria) {
        const query = {
            gpId: gpId,
        };

        // if (criteria.name) query.name = new RegExp(criteria.name, "i");

        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new gpWaterConnectionTaxFeeService(
    gpWaterConnectionTaxFeeModel,
    "gpWaterConnectionTaxFee"
);
