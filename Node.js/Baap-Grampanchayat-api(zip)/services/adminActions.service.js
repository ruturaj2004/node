const BaseService = require("@baapcompany/core-api/services/base.service");
const gramPanchayathModel = require("../schema/gramPanchayath.schema");
const LGDCodeSchema = require("../schema/gramPanchayathLGDCode.schema");
const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");

class AdminActionsService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async getAllPendingApprovalGPs(criteria) {
        const pagination = {
            pageNumber: criteria.pageNumber,
            pageSize: criteria.pageSize,
        };
        const paginationErrors =
            this.validateAndSanitizePaginationProps(pagination);
        if (paginationErrors) {
            return paginationErrors;
        }
        const query = { status: "Pending" };
        if (criteria.status) {
            query.status = criteria.status;
        }

        return this.execute(async () => {
            return {
                items: await gramPanchayathModel.find(
                    query,
                    {},
                    {
                        skip: pagination.pageSize * (pagination.pageNumber - 1),
                        limit: pagination.pageSize,
                    }
                ),
                totalItemsCount: await gramPanchayathModel.countDocuments(
                    query
                ),
            };
        });
    }

    async approveGp(gpId) {
        try {
            const resp = await gramPanchayathModel.findByIdAndUpdate(
                gpId,
                {
                    status: "APPROVED",
                },
                { new: true }
            );
            return new ServiceResponse({
                data: resp,
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }

    async rejectGp(gpId) {
        try {
            const resp = await gramPanchayathModel.findByIdAndUpdate(
                gpId,
                {
                    status: "REJECT",
                },
                { new: true }
            );
            return new ServiceResponse({
                data: resp,
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }

    async cleanupGPData() {
        try {
            const resp = await gramPanchayathModel.deleteMany({
                status: { $nin: ["APPROVED", "REJECT", "REJECTED"] },
            });
            return new ServiceResponse({
                data: resp,
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }

    async bulkupload(lgddetails) {
        try {
            const queries = lgddetails.map((lgdData) => {
                return {
                    updateOne: {
                        filter: {
                            code: lgdData.code,
                        },
                        update: {
                            $set: {
                                        gpName: lgdData.gpName,
                                        taluka: lgdData.taluka,
                                        district: lgdData.district,
                                        pinCode: lgdData.pinCode,
                                        code: lgdData.code,
                                     
                            },
                        },
                        upsert: true,
                    },
                };
            });
            const details = await LGDCodeSchema.bulkWrite(queries);

            return new ServiceResponse({
                data: details,
            });
        } catch (error) {
            console.log("something went wrong", error);
        }
    }
}

module.exports = new AdminActionsService(gramPanchayathModel, "");
