module.exports = {
    name: {
        isLength: { 
            options: { min: 5, max: 12 },
        }
    },
    userName: {
        isLength: { 
            options: { min: 5, max: 12 },
        }
    },
    password: {
        isLength: { 
            options: { min: 8},
        }
    },
    email: {
        isEmail: true
    },
    adharNumber: {
    },

}