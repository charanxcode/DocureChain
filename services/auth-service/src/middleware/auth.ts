import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || "supersafesecretkey_change_in_production", (err: any, user: any) => {
            if (err) {
                return res.status(403).json({ success: false, error: "Invalid token" });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ success: false, error: "Authentication required" });
    }
};

export const requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: "Insufficient permissions" });
        }
        next();
    };
};
