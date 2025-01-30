import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET } from "../global";

interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: string;
}

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload;
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "No token provided." });
    }

    try {
        const decoded = verify(token, SECRET || "joss");
        req.user = decoded as JwtPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

export const verifyRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Access denied." });
        }

        next();
    };
};