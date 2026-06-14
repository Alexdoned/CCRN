import { Event } from "../models/Event.js";
// In both protectAdmin and loginAdmin files:
import { JWT_SECRET } from "../config/config.js"; 

// Read all
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ date: 1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Read single
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Create (protected)
export const createEvent = async (req, res) => {
    const { title, description, date, venue, imageUrl } = req.body;
    try {
        if (!title || !description || !date || !venue || !imageUrl) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const event = new Event({ title, description, date, venue, imageUrl });
        await event.save();
        res.status(201).json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update (protected)
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete (protected)
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
