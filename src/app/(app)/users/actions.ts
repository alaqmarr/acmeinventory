"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateId } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUsers() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPERADMIN") throw new Error("Unauthorized");
  return prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
}

export async function createUser(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "SUPERADMIN") throw new Error("Unauthorized");

    const cap = parseInt(process.env.USER_CAP || "5", 10);
    const existingCount = await prisma.user.count();

    if (existingCount >= cap) {
      return { success: false, error: `User limit reached (Cap: ${cap}). Cannot create more users.` };
    }

    const { email, password, name, role } = data;
    if (!email || !password || !role) {
      return { success: false, error: "Email, password, and role are required." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `${generateId("usr", name || email.split("@")[0])}-${Math.random().toString(36).substring(2, 6)}`;

    await prisma.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        name,
        role,
      },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create user." };
  }
}
