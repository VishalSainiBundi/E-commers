const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            max: 50,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            required: true,
        },
        img: {
            type: String,
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
        }
    },
    { timestamps: true }
)

const categoryModel = mongoose.model("Category", CategorySchema)

module.exports = { categoryModel }
