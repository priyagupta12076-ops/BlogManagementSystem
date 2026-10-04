const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
    try {
        console.log("Logged in user ID:", req.user.id);

        const user = await User.findById(req.user.id);

        console.log("User found:", user);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        console.log("User role:", user.role);

        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        next();

    } catch (error) {
        console.log("Admin middleware error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = adminMiddleware;