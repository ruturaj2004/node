const { default: mongoose } = require("mongoose");
const WardModel = require("../schema/ward.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class WardService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    // getWardData(gpId, criteria) {
    //     return this.preparePaginationAndReturnData(
    //         {
    //             gpid: new mongoose.Types.ObjectId(gpId),
        
    //         },
    //         criteria
    //     );
    // }
    getWardData(gpId, criteria) {
        const query = {
            gpid: new mongoose.Types.ObjectId(gpId),
        };

        if (criteria.wardNumber) query.wardNumber = criteria.wardNumber;
        if (criteria.wardNumbers) query.wardNumbers = criteria.wardNumbers;
                                                                              
        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new WardService(WardModel, "Ward");
