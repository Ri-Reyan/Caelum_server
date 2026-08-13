import { catchAsync } from "../global/catchAsync";
import { Request, Response, NextFunction } from "express";
import { generateToken, sendCookie, verifyToken } from "../utils/token";
import { prisma } from "../config/db";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { AppError } from "../global/AppError";

type TokenPayload = JwtPayload & {
  id: string;
  email: string;
  role: string;
};

const verifyUser = (ROLE: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    let decoded: TokenPayload;
    try {
      decoded = verifyToken(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as TokenPayload;
    } catch (error) {
      if (!refreshToken) {
        throw new AppError("Unauthorized", 401);
      }

      const refreshDecoded = verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as TokenPayload;

      let user;

      if (ROLE === "admin") {
        user = await prisma.admin.findUnique({
          where: {
            id: refreshDecoded.id,
          },
        });
      } else {
        user = await prisma.customer.findUnique({
          where: {
            id: refreshDecoded.id,
          },
        });
      }

      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (user.role !== ROLE) {
        throw new AppError("You are not allowed", 403);
      }

      const newAccessToken = generateToken(
        process.env.ACCESS_TOKEN_SECRET!,
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_TIME as SignOptions["expiresIn"],
      );

      const newRefreshToken = generateToken(
        process.env.REFRESH_TOKEN_SECRET!,
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.REFRESH_TOKEN_TIME as SignOptions["expiresIn"],
      );

      sendCookie(res, "accessToken", newAccessToken);
      sendCookie(res, "refreshToken", newRefreshToken);

      decoded = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    }

    let user;

    if (ROLE === "admin") {
      user = await prisma.admin.findUnique({
        where: {
          id: decoded.id,
        },
      });
    } else {
      user = await prisma.customer.findUnique({
        where: {
          id: decoded.id,
        },
      });
    }

    if (!user) {
      throw new AppError("User not found", 404);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    next();
  });

export default verifyUser;
