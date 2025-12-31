import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "No token" });

    // Support standard `Authorization: Bearer <token>` header
    if (typeof token === 'string' && token.toLowerCase().startsWith('bearer ')) {
        token = token.slice(7).trim();
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
