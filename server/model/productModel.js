const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            max: 50,
            required: true,
            unique: true,
            trim:true
        },
        slug: {
            type: String,
            required: true,
            unique:true,
            trim:true
        },
        thumbnail: {
            type: String,
            unique:true
        },
        other_images:[
            {
            type:String
        }
    ],
        original_price:{
            type:Number,
            default:0
        },
        discount_presentage:{
            type:Number,
            default:0
        },
        final_price:{
            type:Number,
            default:0
        },
        stock:{
            type:Boolean,
            default:true
        },
        descripation:{
type:String
        },
        is_featured:{
            type:Boolean,
            default:true
        },
        is_hot:{
            type:Boolean,
            default:true
        },

        on_home: {
            type: Boolean,
            default: false
        },
        is_top: {
            type: Boolean,
            default: false
        },
        status: {
            type: Boolean,
            default: false
        },
        is_best: {
            type: Boolean,
            default: false
        },
        category_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true
        },color_id:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Color",
        
        },],brand_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Brand",
            required:true
    
        },
    },
    { timestamps: true }
)

const productModel = mongoose.model("product", productSchema)

module.exports = { productModel }
