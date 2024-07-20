const VillageDevelopmentCommitteModel = require("../schema/villageDevelopmentCommitte.schema");
const committeMemberService = require("./committeMember.service");
const BaseService = require("@baapcompany/core-api/services/base.service");
const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");
const mongoose = require("mongoose");

class VillageDevelopmentCommitteService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async addCommitteeMember(committeId, memberObject) {
        const newMember = await committeMemberService.create(memberObject);

        return this.updateById(committeId, {
            $push: { committeeMembers: newMember.data.id },
        });
    }

    async getMemberById(memberId) {
        return committeMemberService.getById(memberId);
    }

    async updateCommitteeMember(memberId, memberObject) {
        return committeMemberService.updateById(memberId, memberObject);
    }

    async delteCommitteeMember(committeId, memberId) {
        const deletedMember = await committeMemberService.deleteById(memberId);

        if (deletedMember.isError) {
            return deletedMember;
        }

        return this.updateById(committeId, {
            $pull: { committeeMembers: deletedMember.data._id },
        });
    }

    // async getAllCommitteeMembersByCommitteeId(committeId) {
    //     const committee = await this.model.findById(committeId).populate('committeeMembers');

    //     return new ServiceResponse({
    //         data: committee
    //     });

    //     // return this.getByIdAndPopulate(committeId, ['committeeMembers dsads']);
    // }
    async getAllCommitteeMembersByCommitteeId(committeId, name) {
        const query = { _id: committeId };
        const populateOptions = {
            path: "committeeMembers",
            match: name ? { name: { $regex: name, $options: "i" } } : {},
            populate: { path: "post" }
        };

        const committee = await this.model
            .findOne(query)
            .populate(populateOptions)
            .populate("gpId")
            .lean();

        if (committee && committee.committeeMembers && name) {
            committee.committeeMembers = committee.committeeMembers.filter(
                (member) => member.name
                // .toLowerCase().includes(name.toLowerCase())
            );
        }

        const response = {
            data: committee,
        };

        return response;
    }
}

module.exports = new VillageDevelopmentCommitteService(
    VillageDevelopmentCommitteModel,
    "VillageDevelopmentCommitte"
);
