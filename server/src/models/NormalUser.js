import mongoose from "mongoose";

const normalUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid Indian phone number`
        }
    },
    batch: { type: String },
    branch: { type: String },
    profilePhoto: { type: String },
}, {timestamps: true});

export default mongoose.model('NormalUser', normalUserSchema);