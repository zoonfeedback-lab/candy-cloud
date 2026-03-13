import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

/**
 * Extract the authenticated user from the request.
 * Returns the user object (without password) or null if not authenticated.
 */
export async function getAuthUser(request) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        await connectDB();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        return user || null;
    } catch {
        return null;
    }
}

/**
 * Require authentication. Throws an error with status info if not authenticated.
 */
export async function requireAuth(request) {
    const user = await getAuthUser(request);
    if (!user) {
        const error = new Error("Not authorized, no token");
        error.status = 401;
        throw error;
    }
    return user;
}

/**
 * Require admin role. Throws an error if not admin.
 */
export async function requireAdmin(request) {
    const user = await requireAuth(request);
    if (user.role !== "admin") {
        const error = new Error("Not authorized as an admin");
        error.status = 403;
        throw error;
    }
    return user;
}
