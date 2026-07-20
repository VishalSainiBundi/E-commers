const mongoose = require('mongoose')

const ColorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            max: 50,
            required: true,
            unique: true
        },
        code: {
            type: String,
            required: true,
            unique:true
        },
       
        status: {
            type: Boolean,
            default: false
        },
        
    },
    { timestamps: true }
)

const colorModel = mongoose.model("Color", ColorSchema)

module.exports = { colorModel }
