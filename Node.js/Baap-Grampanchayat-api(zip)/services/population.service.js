const { default: mongoose } = require("mongoose");
const PopulationEntryModel = require("../schema/population-entry.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class PopulationEntryService extends BaseService {
    async getAllPopulationEntries(gpid) {
        return this.getAllByCriteria({ gpid: gpid });
    }

    async getPopulationByYear(year, gpid, criteria) {
        return this.preparePaginationAndReturnData(
            { gpid: new mongoose.Types.ObjectId(gpid), year: year },
            criteria
        );
    }
}

module.exports = new PopulationEntryService(PopulationEntryModel, "population");
