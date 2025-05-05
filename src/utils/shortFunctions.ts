import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string, {
    expiresIn: "1h"
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string, {
    expiresIn: "5d"
  });
};
