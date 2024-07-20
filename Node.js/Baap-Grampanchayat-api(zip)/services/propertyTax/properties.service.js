const { default: mongoose } = require("mongoose");
const PropertiesModel = require("../../schema/propertyTax/properties.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class PropertiesService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    async getByCitizenId(citizenId) {
        try {
            // Find the property data based on the citizenId
            const propertyData = await PropertiesModel.find({
                citizenId: citizenId,
            });

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
            return {
                status: "Error",
                message: "Failed to fetch data from the properties table.",
            };
        }
    }
    async findTaxByFloorNumber(floorNumber, taxArray, taxType) {
        const floorTaxEntry = taxArray.find(floor => floor.floorNumber === floorNumber);
        return floorTaxEntry ? floorTaxEntry[taxType] : 0;
    }
    // async getByGpId(gpId) {
    //     try {
    //         // Find the property data based on the citizenId
    //         const propertyData = await PropertiesModel.find({
    //             gpId: gpId,
    //         });

    //         if (!propertyData) {
    //             return {
    //                 status: "Error",
    //                 message: "Property not found for the provided gpId.",
    //             };
    //         }
    //         return {
    //             status: "Success",
    //             data: propertyData,
    //         };
    //     } catch (error) {
    //         return {
    //             status: "Error",
    //             message: "Failed to fetch data from the properties table.",
    //         };
    //     }
    // }
    getByGpId(gpId, criteria) {
        return this.preparePaginationAndReturnData(
            {
                gpId: new mongoose.Types.ObjectId(gpId),
               
            },
            criteria
        );
    }

    
}

module.exports = new PropertiesService(PropertiesModel, "properties");
