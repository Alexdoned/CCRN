import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Lanwebanu@#34";

export const protectAdmin = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, token missing" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};
