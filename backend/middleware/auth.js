import jwt from "jsonwebtoken";
// 1. Import the shared secret at the top
import { JWT_SECRET } from "../config/config.js"; 

export const protectAdmin = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, token missing" });
        }
        
        // 2. This will now decode using the identical secret key
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        // Helpful debug log for your server terminal
        console.error("JWT Error:", err.message); 
        return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};
