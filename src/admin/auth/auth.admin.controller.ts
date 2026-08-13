import { sendCookie } from "../../utils/token";
import { Request, Response } from "express";
import { catchAsync } from "../../global/catchAsync";
import { LoginSchema, RegisterSchema } from "../../schemas/auth.zod";
import { authService } from "./auth.admin.service";
import { ILoginType, IRegisterType } from "./auth.admin.interface";
import { AppError } from "../../global/AppError";
import sendResponse from "../../global/sendResponse";
import { generateToken } from "../../utils/token";
import { SignOptions } from "jsonwebtoken";

const Register = catchAsync(async (req: Request, res: Response) => {
  const result = RegisterSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }

  const payload: IRegisterType = result.data;

  const user = await authService.RegisterService(payload);

  if (!user) {
    throw new AppError("Registration failed", 400);
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    process.env.ACCESS_TOKEN_SECRET as string,
    jwtPayload,
    process.env.ACCESS_TOKEN_TIME as SignOptions["expiresIn"],
  );

  const refreshToken = generateToken(
    process.env.REFRESH_TOKEN_SECRET as string,
    jwtPayload,
    process.env.REFRESH_TOKEN_TIME as SignOptions["expiresIn"],
  );

  sendCookie(res, "accessToken", accessToken);
  sendCookie(res, "refreshToken", refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Registration successfull",
    data: user,
  });
});

const Login = catchAsync(async (req: Request, res: Response) => {
  const result = LoginSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(result.error.issues[0].message as string, 400);
  }

  const payload: ILoginType = result.data;

  const user = await authService.LoginService(payload);

  if (!user) {
    throw new AppError("Login failed", 400);
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    process.env.ACCESS_TOKEN_SECRET as string,
    jwtPayload,
    process.env.ACCESS_TOKEN_TIME as SignOptions["expiresIn"],
  );

  const refreshToken = generateToken(
    process.env.REFRESH_TOKEN_SECRET as string,
    jwtPayload,
    process.env.REFRESH_TOKEN_TIME as SignOptions["expiresIn"],
  );

  sendCookie(res, "accessToken", accessToken);
  sendCookie(res, "refreshToken", refreshToken);

  type ISendLogin = {
    name: string;
    email: string;
    role: string;
  };

  const loginCredentails: ISendLogin = {
    name: user.name,
    email: user.email,
    role: user.role,
  };

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Login successfull",
    data: loginCredentails,
  });
});

export const authControllers = {
  Login,
  Register,
};
