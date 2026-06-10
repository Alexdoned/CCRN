import { Admin } from "../models/Admin.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Lanwebanu@#34";

export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Please provide both username and password." });
        }
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.status(200).json({ success: true, token, admin: { id: admin._id, username: admin.username } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const registerAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Please provide both username and password." });
        }
        const adminExists = await Admin.findOne({ username });
        if (adminExists) {
            return res.status(400).json({ success: false, message: "Admin already exists." });
        }
        const newAdmin = new Admin({ username, password });
        await newAdmin.save();
        res.status(201).json({ success: true, message: "Admin registered successfully." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const changeAdminPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide both current and new password." });
        }

        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin account not found." });
        }

        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Current password is incorrect." });
        }

        admin.password = newPassword;
        await admin.save();

        res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
