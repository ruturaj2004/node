const GroupModel = require("../schema/group.schema");
const UserGroupModel = require("../schema/usergroup.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const serviceResponse=require("@baapcompany/core-api/services/serviceResponse")
class UserGroupService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        if (criteria.phoneNo) query.phoneNo = criteria.phoneNo;

        return this.preparePaginationAndReturnData(query, criteria);
    }
     async updateMembership(custId, data) {
        try {
            const resp = await UserGroupModel.findOneAndUpdate(
                { custId: custId },

                data,
                { upsert: true, new: true }
            );

            return new serviceResponse({
                data: resp,
            });
        } catch (error) {
            return new serviceResponse({
                isError: true,
                message: error.message,
            });
        }
    }
    getAllRequestsByCriteria(criteria) {
        const query = {};

        if (criteria.groupId) {
            query.groupId = criteria.groupId;
        }

        if (criteria.phoneNo) {
            query.phoneNo = criteria.phoneNo;
        }
       
        return this.getAllByCriteria(query);
    }
    async findMembershipByGroupIdAndUserId(groupId, userId) {
        let is_member = false;

        const membership = await UserGroupModel.findOne({
            groupId: groupId,
            userId: userId,
        });

        if (membership) {
            is_member = true;
        }

        const group = await GroupModel.findOne({ groupId: groupId });

        return { group: group, is_member: is_member, membership: membership };
    }
    
}

module.exports = new UserGroupService(UserGroupModel, "usergroup");
