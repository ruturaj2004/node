const { default: mongoose } = require("mongoose");
const GpTaxMasterDataModel = require("../../schema/propertyTax/gpTaxMasterData.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const taxationPeriodService = require("./taxationPeriod.service");
class GpTaxMasterDataService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    async getByYearandGpId(gpId,from, to) {
        const period = await taxationPeriodService.getPeriodByFromAndToYear(
            from,
            to,
            "Property"
        );

        const resp = await this.execute(async () => {
            return await this.model.findOne({
                gpId:new mongoose.Types.ObjectId(gpId),
                taxationPeriod: period._id,   
            });
        });

        return resp;
    }
    async getGpMasterDataByGPID(gpId,taxationPeriod) {
        return this.execute(() => {
            return this.model.findOne({
                gpId:gpId,
                taxationPeriod: new mongoose.Types.ObjectId(taxationPeriod),
             
            });
            
        });
        
    }

    async saveGPtaxMaster(gpId, taxationPeriod, details) {
        return this.execute(async () => {
            return await this.model.updateOne(
                {
                    gpId: gpId,
                    taxationPeriod: new mongoose.Types.ObjectId(taxationPeriod),
                },
                details,
                { upsert: true, new: true }
            );
        });
    }
}

module.exports = new GpTaxMasterDataService(
    GpTaxMasterDataModel,
    "gpTaxMasterData"
);
