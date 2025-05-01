import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const accessChecker = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      const error = new Error("No token provided");
      (error as any).status = 401;
      throw error;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        const error = new Error("Invalid token");
        (error as any).status = 403;
        return next(error);
      }

      req.user = decoded;
      next();
    });
  } catch (err) {
    next(err);
  }
};
