const ColonyModel = require("../schema/colony.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class ColonyService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
}

module.exports = new ColonyService(ColonyModel, 'colony');
