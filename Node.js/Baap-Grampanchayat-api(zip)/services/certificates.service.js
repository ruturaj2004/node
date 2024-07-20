const { default: mongoose } = require("mongoose");
const CertificatesModel = require("../schema/certificates.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const ApplicationModel = require("../schema/application.schema");

class CertificatesService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async findPlaceholders(template) {
        const placeholderRegex = /\{(\w+)\}/g;
        const placeholders = template.match(placeholderRegex) || [];
        const names = placeholders.map((placeholder) =>
            placeholder.replace(placeholderRegex, "$1")
        );
        return {
            count: placeholders.length,
            names: names,
        };
    }
    async  generateReceiptNumber() {
        try {
            const lastReceipt = await CertificatesModel.findOne({}, {}, { sort: { receiptNo: -1 } });
            let serialNumber;
            if (lastReceipt) {
                const lastSerialNumber = Number(lastReceipt.receiptNo.split("-")[1]);
                serialNumber = lastSerialNumber + 1;
            } else {
                serialNumber = 1;
            }
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            const formattedSerialNumber = String(serialNumber).padStart(4, "0");
            const receiptNo = `${year}${month}${day}-${formattedSerialNumber}`;
            console.log(receiptNo);
    
            return receiptNo;
        } catch (error) {
            console.error("Error generating receipt number:", error);
            throw error;
        }
    }
    async checkApplicationStatus(applicationId) {
        try {
            const query = ApplicationModel.findOne({ _id: applicationId });
            return query;
        } catch (error) {
            // Handle any errors here
            console.error("Error checking application status:", error);
            throw error;
        }
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
    getAllDataByGpId(gpId, criteria) {
        const query = {
            gpId: new mongoose.Types.ObjectId(gpId),
        };

        if (criteria.citizenId) query.citizenId = criteria.citizenId;
        if (criteria.type) query.type = criteria.type;

        return this.preparePaginationAndReturnData(query, criteria);
    }

    async getByApplicationId(applicationId) {
        return this.execute(() => {
            return this.model.findOne({
                applicationId: new mongoose.Types.ObjectId(applicationId),
            });
        });
    }
}

module.exports = new CertificatesService(CertificatesModel, "certificates");
