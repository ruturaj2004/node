const { default: mongoose } = require("mongoose");
const ProductsModel = require("../schema/products.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class ProductsService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    async getByProductCode(productcode) {
        return this.execute(() => {
            return this.model.findOne({ productcode: productcode });
        });
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };
        if (criteria.categoryId) query.categoryId = criteria.categoryId;
        if (criteria.name) query.name = new RegExp(criteria.name, "i");
        if (criteria.slug) query.slug = new RegExp(criteria.slug, "i");
        if(criteria.productcode)query.productcode=criteria.productcode

        return this.preparePaginationAndReturnData(query, criteria);
    }
    // async getAllSponseredProduct(groupId,criteria) {
    //     const pagination = {
    //         pageNumber: criteria.pageNumber,
    //         pageSize: criteria.pageSize,
    //     };
    //     const paginationErrors =
    //         this.validateAndSanitizePaginationProps(pagination);
    //     if (paginationErrors) {
    //         return paginationErrors;
    //     }
    //     const query = {groupId:groupId, sponsored: true };
    //     if (criteria.sponsored) {
    //         query.sponsored = criteria.sponsored;
    //     }

    //     return this.execute(async () => {
    //         return {
    //             items: await ProductsModel.find( 
    //                 query,
    //                 {},
    //                 {
    //                     skip: pagination.pageSize * (pagination.pageNumber - 1),
    //                     limit: pagination.pageSize,
    //                 }
    //             ),
    //             totalItemsCount: await ProductsModel.countDocuments(query),
    //         };
    //     });
    // }
    getAllSponsoredProductsByGroupId(groupId, criteria) {
        const pagination = {
            pageNumber: criteria.pageNumber,
            pageSize: criteria.pageSize,
        };
        const paginationErrors =
            this.validateAndSanitizePaginationProps(pagination);
        if (paginationErrors) {
            return paginationErrors;
        }
        const query = {
            groupId: groupId,
            sponsored: true,
        };
        if (criteria.sponsored) {
            query.sponsored = criteria.sponsored;
        }

        return this.execute(async () => {
            return {
                items: await ProductsModel.find(
                    query,
                    {},
                    {
                        skip: pagination.pageSize * (pagination.pageNumber - 1),
                        limit: pagination.pageSize,
                    }
                ),
                totalItemsCount: await ProductsModel.countDocuments(query),
            };
        });
    }
}

module.exports = new ProductsService(ProductsModel, "products");
