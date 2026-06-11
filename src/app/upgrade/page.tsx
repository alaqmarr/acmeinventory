import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UpgradeClient } from "./UpgradeClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function UpgradePage() {
  const superadminCount = await prisma.user.count({
    where: { role: "SUPERADMIN" },
  });

  if (superadminCount > 0) {
    const session = await getServerSession(authOptions);
    if (session) {
      redirect("/");
    } else {
      redirect("/api/auth/signin");
    }
  }

  const existingUsers = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true, email: true },
  });

  return <UpgradeClient existingUsers={existingUsers} />;
}
