import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUsers } from "./actions";
import { UsersClient } from "./UsersClient";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "SUPERADMIN") {
    redirect("/");
  }
  const users = await getUsers();
  const cap = parseInt(process.env.USER_CAP || "5", 10);
  
  return <UsersClient initialUsers={users} userCap={cap} />;
}
