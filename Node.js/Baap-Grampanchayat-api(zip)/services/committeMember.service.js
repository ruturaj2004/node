const CommitteMemberModel = require("../schema/committeMember.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class CommitteMemberService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
}

module.exports = new CommitteMemberService(CommitteMemberModel, 'committeMember');
