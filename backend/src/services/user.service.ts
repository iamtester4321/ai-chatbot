import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function findOrCreateUser(payload: {
  googleId: string;
  email: string;
  name: string;
}): Promise<User> {
  const { googleId, email, name } = payload;

  // 1) Try to find an existing user by Google ID
  let user = await prisma.user.findUnique({
    where: { email: googleId },
  });

  if (user) {
    return user;
  }

  user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    user = await prisma.user.update({
      where: { email },
      data: { email: googleId },
    });
    return user;
  }

  // 3) Otherwise, create a new user record
  user = await prisma.user.create({
    data: {
      email,
      password: "defaultPassword123",
    },
  });

  return user;
}
