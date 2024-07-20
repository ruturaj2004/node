const BaseService = require("@baapcompany/core-api/services/base.service");
const PropertyTaxEntryModel = require("../../schema/propertyTax/propertyTaxEntry.schema");

const { default: mongoose } = require("mongoose");

class PropertyTaxEntryService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async addOwnerDetails(ownerDetails) {
        return await this.execute(async () => {
            return await this.model.create({
                ownerDetails: ownerDetails,
            });
        });
    }

    async updateOwnerDetails(ownerDetails, id) {
        return await this.execute(async () => {
            return await this.updateById(id, {
                ownerDetails: ownerDetails,
            });
        });
    }

    async addProperty(propertyDetails, id) {
        return await this.execute(async () => {
            return await this.updateById(id, {
                $push: { propertyDetails: propertyDetails },
            });
        });
    }
    async deleteProperty(propertyDetailsId, id) {
        return await this.execute(async () => {
            return await this.updateById(id, {
                $pull: { propertyDetails: { _id: propertyDetailsId } },
            });
        });
    }

    async saveExemptions(exemptions, id) {
        return await this.execute(async () => {
            return await this.updateById(id, {
                exemptions: exemptions,
            });
        });
    }

    async updateProperty(propertyDetails, entryid, propId) {
        return await this.execute(async () => {
            return await this.model.updateOne(
                {
                    "propertyDetails._id": new mongoose.Types.ObjectId(propId),
                    _id: new mongoose.Types.ObjectId(entryid),
                },
                {
                    $set: {
                        "propertyDetails.$.constructionType":
                            propertyDetails.constructionType,
                        "propertyDetails.$.length": propertyDetails.length,
                        "propertyDetails.$.width": propertyDetails.width,
                        "propertyDetails.$.floor": propertyDetails.floor,
                        "propertyDetails.$.areaInSqMeter":
                            propertyDetails.areaInSqMeter,
                        "propertyDetails.$.areaInSqft":
                            propertyDetails.areaInSqft,
                        "propertyDetails.$.usageType":
                            propertyDetails.usageType,
                        "propertyDetails.$.constructionYear":
                            propertyDetails.constructionYear,
                        "propertyDetails.$.age": propertyDetails.age,
                    },
                }
            );
        });
    }
}

module.exports = new PropertyTaxEntryService(
    PropertyTaxEntryModel,
    "propertyTaxEntry"
);
