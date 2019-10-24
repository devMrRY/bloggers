const mongoose=require('mongoose')
const validator=require('validator')
const User=mongoose.Schema

const userSchema=new User({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email not valid')
            }
        },
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain "password"')
            }
        }
    }
})

const user=mongoose.model('user', userSchema)

module.exports=user