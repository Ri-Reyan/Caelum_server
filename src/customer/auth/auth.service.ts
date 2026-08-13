import { prisma } from "../../config/db";
import { AppError } from "../../global/AppError";
import { hashPassword, verifyPassword } from "../../utils/argon";
import { ILoginType, IRegisterType } from "./auth.interface";

const RegisterService = async (payload: IRegisterType) => {
  const { name, email, password } = payload;

  const ExistingUser = await prisma.customer.findUnique({
    where: {
      email,
    },
  });

  if (ExistingUser) {
    throw new AppError("User already exits", 400);
  }

  const hashedPass: string = await hashPassword(password);

  const user = await prisma.customer.create({
    data: {
      name,
      email,
      password: hashedPass,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const LoginService = async (payload: ILoginType) => {
  const { email, password } = payload;

  const user = await prisma.customer.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isMatched = await verifyPassword(user.password, password);

  if (!isMatched) {
    throw new AppError("Email or password incorrect", 400);
  }

  return user;
};

export const authService = {
  RegisterService,
  LoginService,
};
