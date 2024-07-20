const { default: mongoose } = require("mongoose");
const { mongo } = require("../db/db.connection");
const ModificationModel = require("../schema/modification.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class ModificationService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    async saveGPByModificationOwner(gpId, propertyId, details) {
        return this.execute(async () => {
            return await this.model.updateOne(
                {
                    gpId: gpId,
                    // ownerId: new mongoose.Types.ObjectId(ownerId),
                    propertyId: new mongoose.Types.ObjectId(propertyId),
                },
                details,

                { upsert: true, new: true }
            );
        });
    }
    getAllDataByGpId(gpId, criteria) {
        const query = {
            gpId: new mongoose.Types.ObjectId(gpId),
        };

        if (criteria.propertyId) query.propertyId = criteria.propertyId;

        return this.preparePaginationAndReturnData(query, criteria);
    }
    async getModificationData(gpId, propertyId) {
        return this.execute(async () => {
            return await this.model.find({
                gpId: gpId,
                propertyId: new mongoose.Types.ObjectId(propertyId),
            });
        });
    }
}

module.exports = new ModificationService(ModificationModel, "modification");
