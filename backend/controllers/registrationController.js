import { Registration } from "../models/Registration.js";

import { JWT_SECRET } from "../config/config.js"; 

// Read all (protected)
export const getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: registrations.length, data: registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Create (public)
export const createRegistration = async (req, res) => {
    const { fullName, email, denary, parish, paymentStatus, amount, transactionId } = req.body;
    try {
        if (!fullName || !email || !denary || !parish || !amount || !transactionId) {
            return res.status(400).json({ success: false, message: "All fields including amount and transactionId are required." });
        }
        const registration = new Registration({
            fullName,
            email,
            denary,
            parish,
            paymentStatus: paymentStatus || "Completed",
            amount,
            transactionId
        });
        await registration.save();
        res.status(201).json({ success: true, data: registration });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "Transaction ID already exists." });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update status (protected)
export const updateRegistration = async (req, res) => {
    try {
        const registration = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!registration) {
            return res.status(404).json({ success: false, message: "Registration not found" });
        }
        res.status(200).json({ success: true, data: registration });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete (protected)
export const deleteRegistration = async (req, res) => {
    try {
        const registration = await Registration.findByIdAndDelete(req.params.id);
        if (!registration) {
            return res.status(404).json({ success: false, message: "Registration not found" });
        }
        res.status(200).json({ success: true, message: "Registration deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
