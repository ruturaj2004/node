const { default: mongoose } = require("mongoose");
const ApplicationModel = require("../schema/application.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const CertificatesModel = require("../schema/certificates.schema");
const certificatesService = require("./certificates.service");

class ApplicationService extends BaseService {
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

    async generateReceiptNumber() {
        try {
            const lastReceipt = await ApplicationModel.findOne(
                {},
                {},
                { sort: { paymentReceiptNo: -1 } }
            );

            let serialNumber;
            if (lastReceipt) {
                const lastSerialNumber = Number(
                    lastReceipt.paymentReceiptNo.split("-")[1]
                );
                serialNumber = lastSerialNumber + 1;
            } else {
                serialNumber = 1;
            }

            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            const formattedSerialNumber = String(serialNumber).padStart(4, "0");
            const paymentReceiptNo = `${year}${month}${day}-${formattedSerialNumber}`;
            console.log(paymentReceiptNo);

            return paymentReceiptNo;
        } catch (error) {
            console.error("Error generating receipt number:", error);
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
    async getByCitizenId(citizenId) {
        try {
            const a = await this.model.find({
                citizenId: new mongoose.Types.ObjectId(citizenId),
            });
            const b = await CertificatesModel.find({
                citizenId: new mongoose.Types.ObjectId(citizenId),
            });

            const matchingIds = [];
            for (const recordA of a) {
                if (
                    b.some((recordB) =>
                        recordB.applicationId?.equals(recordA._id)
                    )
                ) {
                    matchingIds.push(recordA._id);
                    await this.model.updateMany(
                        { _id: recordA._id },
                        { $set: { status: "Issued" } },
                        { new: true }
                    );
                }
            }
            const sendResponse = {
                data: a,
            };
            return sendResponse;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAllDataByGpId(gpId, criteria) {
        const query = {
            gpId: new mongoose.Types.ObjectId(gpId),
        };

        if (criteria.citizenId) query.citizenId = criteria.citizenId;

        return await this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new ApplicationService(ApplicationModel, "application");
