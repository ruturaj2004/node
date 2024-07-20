const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");
const StaffPostModel = require("../schema/staffPost.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class StaffPostService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async bulkupload(posts) {
        try {
            const queries = posts.map((post) => {
                return {
                    updateOne: {
                        filter: {
                            name: post,
                        },
                        update: {
                            $set: {
                                name: post,
                            },
                        },
                        upsert: true,
                    },
                };
            });
            const details = await StaffPostModel.bulkWrite(queries);

            return new ServiceResponse({
                data: details,
            });
        } catch (error) {
            console.log("something went wrong", error);
        }
    }
}

module.exports = new StaffPostService(StaffPostModel, "staffPost");
