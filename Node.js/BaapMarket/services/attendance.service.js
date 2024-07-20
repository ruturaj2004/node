const AttendanceModel = require("../schema/attendance.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class AttendanceService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAll(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        return this.preparePaginationAndReturnData(query, criteria);
    }
    async getDataByGroupId (groupId, page, limit, sort_by, asc = 1) {
        try {
        sort_by = 'createdAt'
        const skip = (page-1) * limit;
        const sortCriteria = { [sort_by]: asc }; 
        const totalItemsCount = await this.model.countDocuments({ groupId: groupId });
        if (skip >= totalItemsCount) {
        throw new Error("Page out of range");
        }
        const options =
        {
        skip,
        limit,
        };
        const paginatedMembers = await this.model
        .find({ groupId: groupId }) .sort(sortCriteria)
        .skip(skip)
        .limit(limit);
        const leaveData = await this.getMemberData(paginatedMembers);
        const combinedData = this.combineData(paginatedMembers, leaveData);
        return {
        data: combinedData,
        totalItemsCount,
        page,
        size: limit,
        };
        } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
        }
        }
       
}

module.exports = new AttendanceService(AttendanceModel, "attendance");
