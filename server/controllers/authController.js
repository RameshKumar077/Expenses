import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    res.json({ message: "User Registered" });
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        if (!process.env.JWT_SECRET) {
            console.error('Missing JWT_SECRET');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Login error:', err && err.message ? err.message : err);
        res.status(500).json({ message: 'Login failed' });
    }
};

export const me = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "No user" });
        const user = await User.findById(userId).select('name email avatar');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user: { name: user.name, email: user.email, avatar: user.avatar } });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user' });
    }
};

export const updateMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'No user' });

        const { name, avatar } = req.body;
        const updated = await User.findByIdAndUpdate(userId, { name, avatar }, { new: true }).select('name email avatar');
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.json({ user: { name: updated.name, email: updated.email, avatar: updated.avatar } });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user' });
    }
};
