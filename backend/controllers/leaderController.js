import { Leader } from "../models/Leader.js";

// Read all
export const getLeaders = async (req, res) => {
    try {
        const leaders = await Leader.find({});
        res.status(200).json({ success: true, count: leaders.length, data: leaders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Read single
export const getLeaderById = async (req, res) => {
    try {
        const leader = await Leader.findById(req.params.id);
        if (!leader) {
            return res.status(404).json({ success: false, message: "Leader not found" });
        }
        res.status(200).json({ success: true, data: leader });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Create (protected)
export const createLeader = async (req, res) => {
    const { name, position, achievements, imageUrl } = req.body;
    try {
        if (!name || !position || !imageUrl) {
            return res.status(400).json({ success: false, message: "Name, position, and imageUrl are required" });
        }
        const leader = new Leader({ name, position, achievements: achievements || [], imageUrl });
        await leader.save();
        res.status(201).json({ success: true, data: leader });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update (protected)
export const updateLeader = async (req, res) => {
    try {
        const leader = await Leader.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!leader) {
            return res.status(404).json({ success: false, message: "Leader not found" });
        }
        res.status(200).json({ success: true, data: leader });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete (protected)
export const deleteLeader = async (req, res) => {
    try {
        const leader = await Leader.findByIdAndDelete(req.params.id);
        if (!leader) {
            return res.status(404).json({ success: false, message: "Leader not found" });
        }
        res.status(200).json({ success: true, message: "Leader deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
