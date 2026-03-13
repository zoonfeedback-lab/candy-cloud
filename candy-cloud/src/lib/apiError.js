import { NextResponse } from "next/server";

/**
 * Handle errors and return a proper JSON error response.
 * Handles Mongoose-specific errors (CastError, ValidationError, duplicate key).
 */
export function handleError(error) {
    let statusCode = error.status || 500;
    let message = error.message || "Internal Server Error";

    // Mongoose bad ObjectId
    if (error.name === "CastError" && error.kind === "ObjectId") {
        statusCode = 404;
        message = "Resource not found";
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value entered";
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(error.errors).map((val) => val.message).join(", ");
    }

    return NextResponse.json(
        {
            success: false,
            message,
            stack: process.env.NODE_ENV === "production" ? null : error.stack,
        },
        { status: statusCode }
    );
}
