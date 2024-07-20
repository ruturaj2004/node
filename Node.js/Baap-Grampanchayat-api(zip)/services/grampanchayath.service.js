const gramPanchayathModel = require("../schema/gramPanchayath.schema");

const BaseService = require("@baapcompany/core-api/services/base.service");

class GramPanchayathService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    getAllGPs() {
        return this.execute(() => {
            return this.model.find();
        });
    }

    getGpDetailsByUserId(userId) {
        return this.execute(() => {
            return this.model.findOne({
                primaryUserId: userId,
            });
        });
    }

    updateGPDetails(gpId, details) {
        return this.execute(() => {
            return gramPanchayathModel.findByIdAndUpdate(gpId, {
              name: details.name,
              district: details.district,
              pinCode: details.pinCode,
              taluka: details.taluka,
              displayName: details.displayName
            }, {new: true})
        });
    }
}

module.exports = new GramPanchayathService(
    gramPanchayathModel,
    "gramPanchayath"
);
