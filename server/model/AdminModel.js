const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        admin_type: {
            type: Number,
            required: true,
            enum: [0, 1], // 0: Super Admin, 1: Regular Admin
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);