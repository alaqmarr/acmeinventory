"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateId } from "@/lib/utils";
export async function createAdminUser(data: any) {
  try {
    const existingSuperadmins = await prisma.user.count({
      where: { role: "SUPERADMIN" }
    });
    if (existingSuperadmins > 0) {
      return {
        success: false,
        error: "A Superadmin already exists. You cannot create another one from this route.",
      };
    }
    const { email, password, name } = data;
    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          name,
          role: "SUPERADMIN",
        }
      });
      return { success: true };
    }

    const userId = `${generateId("usr", name || email.split("@")[0])}-${Math.random().toString(36).substring(2, 6)}`;
    await prisma.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        name,
        role: "SUPERADMIN",
      },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create user." };
  }
}

export async function upgradeExistingUser(id: string) {
  try {
    const existingSuperadmins = await prisma.user.count({
      where: { role: "SUPERADMIN" },
    });
    if (existingSuperadmins > 0) {
      return { success: false, error: "A Superadmin already exists in the system." };
    }

    await prisma.user.update({
      where: { id },
      data: { role: "SUPERADMIN" }
    });
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to upgrade user." };
  }
}
