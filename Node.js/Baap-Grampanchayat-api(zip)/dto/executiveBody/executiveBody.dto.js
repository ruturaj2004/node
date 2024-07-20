module.exports = {
    gpId: {
        notEmpty:true
    },
    memberName: {
        notEmpty: true,
    },
    designation: {
        notEmpty: true,
    },
    gender: {
        enum: ["Male", "Female", "Others"],
        default: "Male",
    },
    wardNumber: {
        notEmpty: true,
    },
    category: {
        notEmpty: true,
    },
    startDate: {
        notEmpty: true,
    },
    endDate: {
        notEmpty: true,
    },
};
