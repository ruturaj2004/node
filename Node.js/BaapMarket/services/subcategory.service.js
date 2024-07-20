const SubcategoryModel = require("../schema/subcategory.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class SubcategoryService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");
        if (criteria.categoryId) query.categoryId = criteria.categoryId;
        if (criteria.subcategory) query.subcategory = criteria.subcategory;

        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new SubcategoryService(SubcategoryModel, "subcategory");
