import mongoose from "mongoose";

const leaderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    achievements: {
        type: [String],
        default: []
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

export const Leader = mongoose.model("Leader", leaderSchema);
