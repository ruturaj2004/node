const userSignUpOtpModel = require("../schema/userSignUpOtp");
const AuthModel = require("../schema/auth.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const userService = require("./user.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");
const UserModel = require("../schema/user.schema");
const { phoneNumber } = require("../dto/auth/signup.dto");
const verified = require("../services/verified.service");
const { model } = require("mongoose");
const axios = require("axios");
const VerifiedModel = require("../schema/verified.schema");
const verifiedService = require("../services/verified.service");
class AuthService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async signIn(userDto) {
        try {
            const serviceResponse = await userService.getUserByUserName(
                userDto.userName
            );
            const user = serviceResponse.data && serviceResponse.data._doc;

            if (!user) {
                throw new Error("user does not exist");
            }

            const passwordIsValid = bcrypt.compareSync(
                userDto.password,
                user.password
            );

            if (!passwordIsValid) {
                throw new Error("Invalid password");
            }

            var token = jwt.sign(
                {
                    ...user,
                    password: null,
                },
                process.env.API_SECRET,
                {
                    expiresIn: 86400,
                }
            );

            return new ServiceResponse({
                data: token,
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }
    generateOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expirationTime = Date.now() + 3 * 60 * 1000;
        const expiresInMinutes = 3;
        return { otp, expirationTime, expiresInMinutes };
    };
    // async sendOtp({ phoneNumber }) {
    //     try {
    //         const serviceResponse = await userService.getUserByUserName(
    //             phoneNumber
    //         );
    //         const user = serviceResponse.data && serviceResponse.data._doc;
    //         if (!user) {
    //             throw new Error("User with this phone number does not exist");
    //         }
    //         // Generate OTP with expiration time
    //         const otpData = this.generateOTP();
    //         const otp = otpData.otp;
    //         const expirationTime = otpData.expirationTime;
    //         const expiresInMinutes = otpData.expiresInMinutes;
    //         // Store the OTP and its expiration time in the user object
    //         user.otp = otp;
    //         user.expirationTime = expirationTime;
    //         // Update the user document in the database
    //         await UserModel.findOneAndUpdate(
    //             { _id: user._id },
    //             { otp, expirationTime, expiresInMinutes },
    //             { new: true }
    //         );
    //         // Schedule a task to remove the OTP after 3 minutes
    //         setTimeout(async () => {
    //             // Find the user document again to ensure it is still valid
    //             const updatedUser = await UserModel.findById(user._id);
    //             if (updatedUser && updatedUser.expirationTime <= Date.now()) {
    //                 // If the expiration time has passed, remove the OTP
    //                 updatedUser.otp = undefined;
    //                 updatedUser.expirationTime = undefined;
    //                 await updatedUser.save();
    //             }
    //         }, 3 * 60 * 1000);
    //         return new ServiceResponse({
    //             message: `OTP sent successfully. It expires in ${expiresInMinutes} minutes.`,
    //             data: otp,
    //         });
    //     } catch (error) {
    //         return new ServiceResponse({
    //             isError: true,
    //             message: error.message,
    //         });
    //     }
    // }

    async sendOtp({ phoneNumber }) {
        try {
            const serviceResponse = await userService.getUserByUserName(
                phoneNumber
            );
            const user = serviceResponse.data && serviceResponse.data._doc;

            if (!user) {
                // User does not exist, store data in the "verified" table
                const otpData = this.generateOTP();
                const otp = otpData.otp;
                const expirationTime = otpData.expirationTime;
                const expiresInMinutes = otpData.expiresInMinutes;
                // Create a new entry in the "verified" table
                
                await VerifiedModel.findOneAndUpdate(
                    { phoneNumber: phoneNumber },
                    {
                        $set: {
                            otp: otp,
                            expirationTime: expirationTime,
                            expiresInMinutes: expiresInMinutes,
                        },
                    },
                    { upsert: true }
                );
    
                setTimeout(async () => {
                    // Find the "verified" entry for the given phoneNumber to ensure it is still valid
                    const updatedVerifiedUser = await VerifiedModel.findOne({ phoneNumber: phoneNumber });
                    if (updatedVerifiedUser && updatedVerifiedUser.expirationTime <= Date.now()) {
                        // If the expiration time has passed, remove the OTP
                        updatedVerifiedUser.otp = undefined;
                        updatedVerifiedUser.expirationTime = undefined;
                        updatedVerifiedUser.expiresInMinutes = undefined;
                        await updatedVerifiedUser.save();
                    }
                }, 3 * 60 * 1000);
                return new ServiceResponse({
                    message: `OTP sent successfully to new user. It expires in ${expiresInMinutes} minutes.`,
                    data: otp,
                });
            }
            // User exists, proceed with updating user document with OTP
            const otpData = this.generateOTP();
            const otp = otpData.otp;
            const expirationTime = otpData.expirationTime;
            const expiresInMinutes = otpData.expiresInMinutes;

            // Store the OTP and its expiration time in the user object
            user.otp = otp;
            user.expirationTime = expirationTime;

            // Update the user document in the database
            await UserModel.findOneAndUpdate(
                { _id: user._id },
                { otp: otp, expirationTime, expiresInMinutes },
                { new: true }
            );



            // Schedule a task to remove the OTP after 3 minutes
               setTimeout(async () => {
                // Find the user document again to ensure it is still valid
                const updatedUser = await UserModel.findById(user._id);
                if (updatedUser && updatedUser.expirationTime <= Date.now()) {
                    // If the expiration time has passed, remove the OTP
                    updatedUser.otp = undefined;
                    updatedUser.expirationTime = undefined;
                    await updatedUser.save();
                }
            }, 3 * 60 * 1000);
           

            return new ServiceResponse({
                message: `OTP sent successfully to existing user. It expires in ${expiresInMinutes} minutes.`,
                data: otp,
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }
    // Do not validates the user
    async sendOtpWithOutValidatingUser({ phoneNumber }) {
        try {
            // need to integrate sms service here
            await userSignUpOtpModel.findOneAndUpdate(
                {
                    phoneNumber: phoneNumber,
                },
                {
                    phoneNumber: phoneNumber,
                    otp: 123456,
                },
                {
                    upsert: true,
                }
            );

            return new ServiceResponse({
                message: "OTP Sent Successfully",
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }
    async signUpVerifyPhone({ phoneNumber, email }) {
        try {
            let contactInfo;
            let verificationRecord;

            if (phoneNumber && !email) {
                contactInfo = phoneNumber;
                verificationRecord = await VerifiedModel.findOneAndUpdate(
                    { phoneNumber },
                    { $set: { phoneNumber } },
                    { upsert: true, new: true }
                );
            } else if (email && !phoneNumber) {
                contactInfo = email;
                verificationRecord = await VerifiedModel.findOneAndUpdate(
                    { email },
                    { $set: { email } },
                    { upsert: true, new: true }
                );
            } else {
                throw new Error(
                    "Please provide either a phone number or an email."
                );
            }
            // Generate OTP if the record is newly created

            const otp = Math.floor(100000 + Math.random() * 900000);
            verificationRecord.otp = otp;
            verificationRecord.createdAt = new Date();
            await verificationRecord.save();

            // Schedule a task to remove the OTP after 3 minutes
            setTimeout(async () => {
                // Find the verification record again to ensure it is still valid
                const updatedVerificationRecord = await VerifiedModel.findById(
                    verificationRecord._id
                );

                if (
                    updatedVerificationRecord &&
                    updatedVerificationRecord.createdAt <=
                        Date.now() - 3 * 60 * 1000
                ) {
                    // If the expiration time has passed, remove the OTP
                    updatedVerificationRecord.otp = undefined;
                    await updatedVerificationRecord.save();

                    // Return an error message indicating OTP expiration
                    console.log("OTP expired:", updatedVerificationRecord._id);
                }
            }, 3 * 60 * 1000);

            // Send the OTP to the user via SMS or email (integration needed here)

            return new ServiceResponse({
                message: "OTP sent successfully.",
                data: otp,
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }

    async signUpValidateOtp({ phoneNumber, otp }) {
        try {
            let singupOtp;
            if (phoneNumber) {
                singupOtp = await VerifiedModel.findOne({
                    phoneNumber: phoneNumber,
                    otp: otp,
                });
            } else {
                singupOtp = await VerifiedModel.findOne({
                    email: email,
                    otp: otp,
                });
            }

            if (!singupOtp) {
                return new ServiceResponse({
                    isError: true,
                    message: "Invalid OTP",
                });
            }

            return new ServiceResponse({
                message: "OTP is valid",
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }

    // async verifyOpt(otpDto) {
    //     try {
    //         const serviceResponse = await userService.getUserByUserName(
    //             otpDto.phoneNumber
    //         );
    //         const user = serviceResponse.data && serviceResponse.data._doc;
    //         if (!user) {
    //             throw new Error("User does not exist");
    //         }
    //         const isOtpValid = otpDto.otp === user.otp; // Compare the provided OTP with the OTP stored in the user object

    //         if (!isOtpValid) {
    //             throw new Error("Invalid OTP");
    //         }
    //         var token = jwt.sign(
    //             {
    //                 ...user,
    //                 password: null,
    //             },
    //             process.env.API_SECRET,
    //             {
    //                 expiresIn: 86400,
    //             }
    //         );

    //         return new ServiceResponse({
    //             token: token,
    //             message: "Verified successfully",
    //         });
    //     } catch (error) {
    //         return new ServiceResponse({
    //             isError: true,
    //             message: error.message,
    //         });
    //     }
    // }

    async verifyOpt(otpDto) {
        try {
            const userResponse = await userService.getUserByUserName(
                otpDto.phoneNumber
            );
            const user = userResponse.data && userResponse.data._doc;

            if (!user) {
                const verifiedResponse =
                    await verifiedService.getVerifiedUserByPhoneNumber(
                        otpDto.phoneNumber
                    );
                const verifiedUser =
                    verifiedResponse.data && verifiedResponse.data._doc;

                if (!verifiedUser) {
                    throw new Error("User does not exist");
                }

                const isOtpValid = otpDto.otp == verifiedUser.otp;

                if (!isOtpValid) {
                    throw new Error("Invalid OTP");
                }

                var token = jwt.sign(
                    {
                        ...verifiedUser,
                        password: null,
                    },
                    process.env.API_SECRET,
                    {
                        expiresIn: 86400,
                    }
                );

                const response = {
                    token: token,
                    message: "Verfied Successfully",
                };

                if (user) {
                    response.token = token;
                    response.data = { userExits: true };
                } else {
                    response.data = { userExits: false };
                }

                return new ServiceResponse(response);
            }

            const isOtpValid = otpDto.otp == user.otp;
            if (!isOtpValid) {
                throw new Error("Invalid OTP");
            }

            var token = jwt.sign(
                {
                    ...user,
                    password: null,
                },
                process.env.API_SECRET,
                {
                    expiresIn: 86400,
                }
            );

            const response = {
                message: "Verfied Successfully",
            };

            if (user) {
                response.token = token;
                response.data = { userExits: true };
            } else {
                response.data = { userExits: false };
            }

            return new ServiceResponse(response);
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }
    async verifyMobileOpt(otpDto) {
        try {
            const serviceResponse = await userService.getUserByUserName(
                otpDto.phoneNumber
            );
            const user = serviceResponse.data && serviceResponse.data._doc;

            const isOtpValid = otpDto.otp === 282812;

            if (!isOtpValid) {
                throw new Error("Invalid OTP");
            }

            var token = jwt.sign(
                {
                    ...user,
                    password: null,
                },
                process.env.API_SECRET,
                {
                    expiresIn: 86400,
                }
            );

            const response = {
                message: "Verfied Successfully",
            };

            if (user) {
                response.token = token;
                response.data = { userExits: true };
            } else {
                response.data = { userExits: false, isMobileValidated: true };
            }

            return new ServiceResponse(response);
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }

    async signUp(signupDto) {
        // const verfiedMobile = await userSignUpOtpModel.findOne({
        //     phoneNumber: signupDto.phoneNumber,
        // });

        // if (!verfiedMobile) {
        //     return new ServiceResponse({
        //         isError: true,
        //         message: "user phoneNumber need to be verified before signup",
        //     });
        // }
        const newUserResponse = await userService.save(signupDto);
        if (newUserResponse.data) {
            var token = jwt.sign(
                {
                    ...newUserResponse.data,
                    password: null,
                },
                process.env.API_SECRET,
                {
                    expiresIn: 86400,
                }
            );

            newUserResponse.token = token;
        }

        return newUserResponse;
    }
}

module.exports = new AuthService(AuthModel, "auth");
