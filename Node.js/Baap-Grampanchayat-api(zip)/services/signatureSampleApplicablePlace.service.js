const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");
const SignatureSampleApplicablePlaceModel = require("../schema/signatureSampleApplicablePlace.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class SignatureSampleApplicablePlaceService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async bulkupload(places) {
        try {
            const queries = places.map((place) => {
                return {
                    updateOne: {
                        filter: {
                            name: place,
                        },
                        update: {
                            $set: {
                                name: place,
                            },
                        },
                        upsert: true,
                    },
                };
            });
            const details = await SignatureSampleApplicablePlaceModel.bulkWrite(queries);

            return new ServiceResponse({
                data: details,
            });
        } catch (error) {
            console.log("something went wrong", error);
        }
    }
}

module.exports = new SignatureSampleApplicablePlaceService(SignatureSampleApplicablePlaceModel, 'signatureSampleApplicablePlace');
