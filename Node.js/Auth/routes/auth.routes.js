const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/auth.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

const signInDto = require("../dto/auth/signin.dto");
const signupDto = require("../dto/auth/signup.dto");
const otpDto = require("../dto/auth/otp-validate");
const userService = require("../services/user.service");
const VerifiedModel = require("../schema/verified.schema");
const UserModel = require("../schema/user.schema");

router.post("/signin", checkSchema(signInDto), async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }

    const response = await service.signIn(req.body);

    if (response.data) {
        res.cookie("baap-identity", response.data, {
            domain: ".baap.com",
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
        });
    }

    requestResponsehelper.sendResponse(res, response);
});

router.post("/validateOtp", checkSchema(otpDto), async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }

    const response = await service.verifyOpt(req.body);

    if (response.data) {
        res.cookie("baap-identity", response.data, {
            domain: ".baap.com",
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
        });
    }

    requestResponsehelper.sendResponse(res, response);
});

router.post(
    "/validateMobileOtp",
    checkSchema(otpDto),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const response = await service.verifyMobileOpt(req.body);

        if (response.data) {
            res.cookie("baap-identity", response.data, {
                domain: ".baap.com",
                expires: new Date(Date.now() + 900000),
                httpOnly: true,
            });
        }

        requestResponsehelper.sendResponse(res, response);
    }
);

router.post(
    "/sendOtp",
    checkSchema({
        phoneNumber: { notEmpty: true },
    }),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const response = await service.sendOtp(req.body);

        requestResponsehelper.sendResponse(res, response);
    }
);

router.post(
    "/sendMobileOtp",
    checkSchema({
        phoneNumber: { notEmpty: true },
    }),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const response = await service.sendOtpWithOutValidatingUser(req.body);

        requestResponsehelper.sendResponse(res, response);
    }
);
//without any validation both is there sifnup,login
router.post("/signup", checkSchema(signupDto), async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const userId = +Date.now();
  
    req.body.userId = userId;

    const response = await service.signUp(req.body);

    requestResponsehelper.sendResponse(res, response);
});

//check userAvaliable 
router.post("/find/signup", checkSchema(signupDto), async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
      return;
    }
  
    // Check if email is verified
    const emailVerificationRecord = await VerifiedModel.findOne({ email: req.body.email });
    if (!emailVerificationRecord) {
      requestResponsehelper.sendResponse(res, {
        status: "Failed",
        message: "Please verify your email address before signing up.",
      });
      return;
    }
  
    // Check if phone number is verified
    const phoneVerificationRecord = await VerifiedModel.findOne({ phoneNumber: req.body.phoneNumber });
    if (!phoneVerificationRecord) {
      requestResponsehelper.sendResponse(res, {
        status: "Failed",
        message: "Please verify your phone number before signing up.",
      });
      return;
    }
  
    // Check if email or phone number already exists in the user table
    const userWithEmail = await UserModel.findOne({ email: req.body.email });
    const userWithPhoneNumber = await UserModel.findOne({ phoneNumber: req.body.phoneNumber });
    if (userWithEmail || userWithPhoneNumber) {
      requestResponsehelper.sendResponse(res, {
        status: "Failed",
        message: "User with this email or phone number already exists.",
      });
      return;
    }
  
    // Sign up the user
    const response = await service.signUp(req.body);
    requestResponsehelper.sendResponse(res, response);
  });
  //verify phneNumber
router.post(
    "/signUpVerifyPhone",
    checkSchema({
        phoneNumber: { notEmpty: false },
        email: {
          custom: {
            options: (value, { req }) => {
              if (typeof value !== 'undefined' && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                throw new Error('Invalid email address');
              }
              return true;
            },
          },
        },
      }),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const response = await service.signUpVerifyPhone(req.body);

        requestResponsehelper.sendResponse(res, response);
    }
);
//verify phoneNumber otp
router.post(
    "/signUpValidateOtp",
    checkSchema({
        phoneNumber: { notEmpty: false },
        email: { notEmpty: false}
    }),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        const response = await service.signUpValidateOtp(req.body);

        requestResponsehelper.sendResponse(res, response);
    }
);
module.exports = router;
