"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateId } from "@/lib/utils";
export async function createAdminUser(data: any) {
  try {
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return {
        success: false,
        error: "Setup is already complete. Admin exists.",
      };
    }
    const { email, password, name } = data;
    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateId("usr", name || email.split("@")[0]);
    await prisma.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        name,
        role: "ADMIN",
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Setup error:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}
