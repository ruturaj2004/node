const CertificateDocumentsModel = require("../schema/certificatedocuments.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class CertificateDocumentsService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    async getAllDataByGpId(gpId, criteria) {
        const query = {
            gpId: new mongoose.Types.ObjectId(gpId),
        };

        if (criteria.citizenId) query.citizenId = criteria.citizenId;

        return await this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new CertificateDocumentsService(
    CertificateDocumentsModel,
    "certificatedocuments"
);
