const PaymentsModel = require("../schema/payments.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");

class PaymentsService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.orderId) query.orderId = criteria.orderId;
        if (criteria.custId) query.custId = criteria.custId;
        return this.preparePaginationAndReturnData(query, criteria);
    }
    async updatePayment(paymentId, data) {
        try {
            const resp = await PaymentsModel.findOneAndUpdate(
                { paymentId: paymentId },

                data,
                { upsert: true, new: true }
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
    async updateCustId(custId, data) {
        try {
            const resp = await PaymentsModel.findOneAndUpdate(
                { custId: custId },

                data,
                { upsert: true, new: true }
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
    async getByPaymentId(paymentId) {
        return this.execute(() => {
            return this.model.findOne({ paymentId: paymentId });
        });
    }
}

module.exports = new PaymentsService(PaymentsModel, "payments");
