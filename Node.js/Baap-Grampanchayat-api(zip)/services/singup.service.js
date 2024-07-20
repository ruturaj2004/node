const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");

const codeModel = require("../schema/gramPanchayathLGDCode.schema");
const gramPanchayathModel = require("../schema/gramPanchayath.schema");
const axios = require("axios");

class SingUpService {
    static async getGpdetails(lgdCode) {
        try {
            const details = await codeModel.find({
                code: lgdCode,
            });

            return new ServiceResponse({
                data: details,
            });
        } catch (error) {
            console.log("something went wrong", error);
        }
    }

    static async savLGDdetails(lgddetails) {
        try {
            const details = await new codeModel(lgddetails).save();

            return new ServiceResponse({
                data: details,
            });
        } catch (error) {
            console.log("something went wrong", error);
        }
    }

    static async registerUserGP(grampanchaythDetails) {
        console.log("Entered registerUserGP method");

        const userCreationResponse = await SingUpService.registerUser(
            grampanchaythDetails.primaryContact
        );

        const user = userCreationResponse?.data?.data;
        console.log("registerUserGP method, user created");

        if (userCreationResponse.isError) {
            return new ServiceResponse({
                isError: true,
                message:
                    "Primary user creation failed : " +
                    userCreationResponse.message,
            });
        }
        const gpCreationResponse = await SingUpService.saveGramPanchayath({
            ...grampanchaythDetails,
            primaryUserId: user._id,
            primaryContact: undefined,
        });

        if (gpCreationResponse.isError) {
            const userDeleteResponse = await SingUpService.revertUserCreation(
                user._id
            );

            return new ServiceResponse({
                isError: true,
                message: "could not save gram panchayath",
            });
        }

        console.log("END:: registerUserGP method");
        return new ServiceResponse({
            message: "Grampanchayth Saved successfully",
        });
    }

    static async saveGramPanchayath(grampanchaythDetails) {
        try {
            const existingPanchayath = await gramPanchayathModel.findOne({
                name: grampanchaythDetails.name,
            });
            if (existingPanchayath) {
                return new ServiceResponse({
                    isError: true,
                    message: "A Panchayath with this name already exists.",
                });
            }

            const existingLgdCode = await gramPanchayathModel.findOne({
                lgdCode: grampanchaythDetails.lgdCode,
            });
            if (existingLgdCode) {
                return new ServiceResponse({
                    isError: true,
                    message: "LGD code already exists.",
                });
            }

            const newGramPanchayath = new gramPanchayathModel({
                ...grampanchaythDetails,
            });
            const data = await newGramPanchayath.save();
            return new ServiceResponse({
                data: data,
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }

    static async registerUser(userDto) {
        try {
            console.log("Entered register method");
            console.log(userDto);
            const response = await axios.post(
                process.env.AUTH_SERVICE_BASE_URL + "auth/signup",
                userDto
            );
            console.log("End register method");
            return new ServiceResponse({
                // data: response.data,
            });
        } catch (error) {
            console.log("Error in register method");
            return new ServiceResponse({
                isError: true,
                message: error.response
                    ? error.response.data.messages
                        ? error.response.data.messages
                        : error.response.data.message
                    : error.message,
            });
        }
    }

    static async revertUserCreation(userId) {
        try {
            const response = await axios.delete(
                process.env.AUTH_SERVICE_BASE_URL + "user/" + userId
            );
            return new ServiceResponse({
                data: response.data,
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }
}

module.exports = SingUpService;
