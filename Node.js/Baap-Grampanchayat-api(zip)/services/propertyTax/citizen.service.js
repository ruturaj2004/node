const { default: mongoose } = require("mongoose");
const CitizenModel = require("../../schema/propertyTax/citizen.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const PropertiesModel = require("../../schema/propertyTax/properties.schema");

class CitizenService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    // async getBygpId(gpId) {
    //     return this.execute(() => {
    //         return this.model.find({ gpId: new mongoose.Types.ObjectId(gpId) });
    //     });
    // }
    getBygpId(gpId, criteria) {
        const query = {
            gpId: new mongoose.Types.ObjectId(gpId),
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");
        // if (criteria.name) query.name = criteria.name;

        return this.preparePaginationAndReturnData(query, criteria);
    }
    //     getAllDataByGpId(gpId, criteria) {
    //         const query = {
    //             gpId: new mongoose.Types.ObjectId(gpId),
    //         };
    //         if (criteria.phoneNumber) query.phoneNumber = new RegExp(criteria.phoneNumber, "i");
    //         if (criteria.panNumber) query.panNumber = criteria.panNumber;
    //         if (criteria.aadharNumber) query.aadharNumber = criteria.aadharNumber;
    //         return this.preparePaginationAndReturnData(query, criteria);
    //     }

    // }
    //
    async getByGpIds(gpId, searchQuery) {
        const searchData = await this.execute(() => {
            const query = {
                gpId: new mongoose.Types.ObjectId(gpId),
                $or: [
                    { phoneNumber: !isNaN(searchQuery) ? searchQuery : null },
                    { panNumber: searchQuery.toString() },
                    { aadharNumber: !isNaN(searchQuery) ? searchQuery : null },
                ],
            };
            return CitizenModel.find(query);
        });

        return searchData;
    }
    // Assuming you have imported the necessary models and database connection

    async getByCitizenId(citizenId) {
        try {
            // Find the property data based on the citizenId
            const propertyData = await PropertiesModel.find({ citizenId:citizenId });
            console.log(propertyData);
            if (!propertyData) {
                return {
                    status: "Error",
                    message: "Property not found for the provided citizenId.",
                };
            }
            return {
                status: "Success",
                data: propertyData,
            };
        } catch (error) { 
            console.error(error)
            return {
                status: "Error",
                message: "Failed to fetch data from the properties table.",
            };
        }
    }
}

module.exports = new CitizenService(CitizenModel, "citizen");
