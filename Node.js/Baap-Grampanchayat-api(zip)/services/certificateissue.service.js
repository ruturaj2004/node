const CertificateIssueModel = require("../schema/certificateissue.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class CertificateIssueService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.citizenId) query.citizenId = new RegExp(criteria.citizenId, "i");

        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new CertificateIssueService(CertificateIssueModel, 'certificateissue');
