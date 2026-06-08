import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGO_URL;
        if (!uri) {
            throw new Error("MongoDB connection URI is missing from environment variables.");
        }
        const conn = await mongoose.connect(uri);
        console.log(`mongoDB connected: ${conn.connection.host}`);
    } catch(error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
};