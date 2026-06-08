import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    denary: {
        type: String,
        required: true,
        trim: true
    },
    parish: {
        type: String,
        required: true,
        trim: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

export const Registration = mongoose.model("Registration", registrationSchema);
