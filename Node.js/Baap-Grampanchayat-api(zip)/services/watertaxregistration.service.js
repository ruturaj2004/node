const { default: mongoose } = require("mongoose");
const PropertiesModel = require("../schema/propertyTax/properties.schema");
const WaterTaxRegistrationModel = require("../schema/watertaxregistration.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const CitizenModel = require("../schema/propertyTax/citizen.schema");
const {
    sendResponse,
} = require("@baapcompany/core-api/helpers/requestResponse.helper");

class WaterTaxRegistrationService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    getAllDataByGpId(gpId, criteria) {
        const query = {
            gpId: new mongoose.Types.ObjectId(gpId),
        };
        if (criteria.citizenId) query.citizenId = criteria.citizenId;
        return this.preparePaginationAndReturnData(query, criteria);
    }
    async getByGpIds(gpId, searchQuery) {
        const searchData = await this.execute(async () => {
            const query = {
                gpId: new mongoose.Types.ObjectId(gpId),
                $or: [
                    { phoneNumber: !isNaN(searchQuery) ? searchQuery : null },
                    { panNumber: searchQuery.toString() },
                    { aadharNumber: !isNaN(searchQuery) ? searchQuery : null },
                ],
            };
            const citizens = await CitizenModel.find(query);
            const result = [];
            for (const citizen of citizens) {
                const associatedProperty = await PropertiesModel.findOne({
                    citizenId: citizen._id,
                });
                if (associatedProperty) {
                    result.push({ citizen, associatedProperty });
                }
            }

            return result;
        });

        return searchData;
    }
}

module.exports = new WaterTaxRegistrationService(
    WaterTaxRegistrationModel,
    "watertaxregistration"
);
