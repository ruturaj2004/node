   const CategoryModel = require("../schema/category.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class CategoryService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new CategoryService(CategoryModel, "Category");
