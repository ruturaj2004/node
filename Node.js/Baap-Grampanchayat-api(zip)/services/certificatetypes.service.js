const CertificateTypesModel = require("../schema/certificatetypes.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class CertificateTypesService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    async findPlaceholders(template) {
        const placeholderRegex = /\{(\w+)\}/g;
        const placeholders = template.match(placeholderRegex) || [];
        // console.log("placeholders:", placeholderRegex, placeholders);
        const names = placeholders.map((placeholder) =>
            placeholder.replace(placeholderRegex, "$1")
        );
        // console.log("names:", names);
        return {
            count: placeholders.length,
            names: names,
        };
    }
    async findApplicationPlaceholders(applicationtemplate) {
        const placeholderRegex = /\{(\w+)\}/g;
        const placeholders = applicationtemplate.match(placeholderRegex) || [];
        // console.log("placeholders:", placeholderRegex, placeholders);
        const names = placeholders.map((placeholder) =>
            placeholder.replace(placeholderRegex, "$1")
        );
        // console.log("names:", names);
        return {
            count: placeholders.length,
            names: names,
        };
     
    }
    async getByCategoryId(categoryId) {
        return this.execute(() => {
            return this.model.findOne({ categoryId: categoryId });
        });
        
    }
    getAllDataByGroupId(gpId, criteria) {
        const query = {
            gpId: gpId,
        };
        // if (criteria.categoryId) query.categoryId = new RegExp(criteria.categoryId, "i");
        if (criteria.categoryId) query.categoryId = criteria.categoryId;

        return this.preparePaginationAndReturnData(query, criteria);
    }
    getAllRequestsByCriteria(criteria) {
        const query = {};

        if (criteria.categoryId) {
            query.categoryId = criteria.categoryId;
        }

        return this.getAllByCriteria(query);
    }
}

module.exports = new CertificateTypesService(
    CertificateTypesModel,
    "certificatetypes"
);
