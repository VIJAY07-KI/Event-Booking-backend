import User from "../Models/UserModel.js";

export const registerValidationSchema={

    name:{
        in : ["body"],
        exists:{
            errorMessage:"Name field is required"
        },
        notEmpty:{
            errorMessage:"name cannot be empty"
        },
        isLength:{
            options:{min:3,max:25},
            errorMessage:"name should be between 3 to 25 characters"
        },
        trim:true,
        custom :{
            options : async function(value){
                const user = await User.findOne({name:{$regex:value,$options:"i"}})
                if(!user){
                    return true
                }else{
                    throw new Error ("User name is already taken")
                }
            }
        }
        
    
    },
    email: {
        in: ["body"],
        exists: {
            errorMessage: "Email field is required"
        },
        notEmpty: {
            errorMessage: "Email cannot be empty"
        },
        isEmail: {
            errorMessage: "Invalid email format"
        },
        normalizeEmail: true,
        custom: {
            options: async function (value) {
                const user = await User.findOne({ email: { $regex: `^${value}$`, $options: "i" } });
                if (!user) {
                    return true;
                } else {
                    throw new Error("Email is already registered");
                }
            }
        }
    },
    password:{
        in:['body'],
        exists:{errorMessage:'password field is required'},
        notEmpty:{errorMessage:'password field should not be  empty'},
        isStrongPassword:{Options:{minLength:8,minLowercase:1,minUppercase:1,minNumber:1,minSymbol:1},
        errorMessage:'password must contain atleast one lowercase,one uppercase,one number,one symbol and minmum of 8 characters'
     },
     trim:true
    },
    
}

export const loginValidationSchema={
    email:{
        in:['body'],
        exists:{errorMessage:'email field is required'},
        notEmpty:{errorMessage:'email field is not empty'},
        isEmail:{errorMessage:'please provide valid format'},
        normalizeEmail:true,
        trim:true
    },
    password:{
        in:['body'],
        exists:{errorMessage:'password field is required'},
        notEmpty:{errorMessage:'password field is not empty'},
        isStrongPassword:{
            options:{minLength:8,minLowercase:1,minNumber:1,minSymbol:1,minUppercase:1}
        },
        trim:true
    }
}