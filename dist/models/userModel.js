"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    user_id: {
        type: Number,
        required: true,
        trim: true
    },
    user_name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Object,
        required: true,
        trim: true
    },
    punch_in: {
        type: Object,
        required: true,
        trim: true
    },
    punch_out: {
        type: Object,
        required: true,
        trim: true
    },
}, {
    versionKey: false
});
exports.default = (0, mongoose_1.model)('users', userSchema);
