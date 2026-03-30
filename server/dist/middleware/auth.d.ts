import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                username: string;
            };
        }
    }
}
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map