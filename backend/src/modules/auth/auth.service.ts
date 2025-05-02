import { prisma } from "../../db/client";
import { hashPassword, comparePasswords, signToken } from "./auth.utils";

export const AuthService = {
  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User already exists");

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });
    return user;
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const match = await comparePasswords(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = signToken({ userId: user.id });
    return { user, token };
  },
};
