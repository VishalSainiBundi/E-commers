const mongoose= require('mongoose')

const ShippingAddressSchema= new mongoose.Schema(
    {
        addressLine1:{type:String, required:true},
        addressLine2:{type:String},
        contect:{type:String, default: null},
        city:{type:String, required:true},
        state:{type:String, required:true},
        country:{type:String, required:true},
        pincode:{type:String, required:true},

    },{
        _id:false
    }
)

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
        type:String,
        required:[true, "email is required"],
        unique:true,
        trim:true
        },
        password:{
            type:String,
            required:[true, "password is required"],
            minlength:[6, "password must be leatest 6 chartest long"]
       },shipping_address:{
        type:[ShippingAddressSchema],
        default:[],
       },
       default_address:{
        type:Number,
        default:0
       }
    },
    {
    timestamps:true

    }
)

const userModel= mongoose.model("user",userSchema)
module.exports= userModel
