"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/AlertProvider";
import { createAdminUser, upgradeExistingUser } from "./actions";
import { Shield, ShieldAlert, ArrowUpCircle } from "lucide-react";

export function UpgradeClient({ existingUsers }: { existingUsers: any[] }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlert();

  const handleUpgradeUser = async (userId: string) => {
    setLoading(true);
    try {
      const result = await upgradeExistingUser(userId);
      if (result.success) {
        showAlert({
          title: "Upgrade Complete",
          message: "User successfully upgraded to Superadmin. Please log in.",
          type: "success",
        });
        router.push("/api/auth/signin");
      } else {
        showAlert({
          title: "Upgrade Failed",
          message: result.error || "Failed to upgrade user.",
          type: "error",
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Unexpected Error",
        message: error.message || "An unexpected error occurred.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createAdminUser({ email, password, name });
      if (result.success) {
        showAlert({
          title: "Upgrade Complete",
          message: "Superadmin user created successfully. You can now log in.",
          type: "success",
        });
        router.push("/api/auth/signin");
      } else {
        showAlert({
          title: "Upgrade Failed",
          message: result.error || "Failed to create Superadmin user.",
          type: "error",
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Unexpected Error",
        message: error.message || "An unexpected error occurred.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 border-slate-200 p-4">
      <div className="w-full max-w-4xl space-y-8">
        
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">System Upgrade</h1>
          <p className="text-slate-500 leading-relaxed mt-2">
            Create or promote the initial Superadmin account to manage this system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Create New Superadmin Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              Create New Superadmin
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Superadmin Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Acme Admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="admin@acme.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all border border-indigo-700 font-medium rounded-xl disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Creating Account..." : "Complete Upgrade"}
              </button>
            </form>
          </div>

          {/* Existing Users List */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200 overflow-hidden flex flex-col h-full">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Promote Existing User
            </h2>
            
            {existingUsers.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">No existing users found in the system. Create a new one on the left.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {existingUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="truncate pr-4">
                      <p className="font-semibold text-slate-900 truncate">{user.name || "Unknown"}</p>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleUpgradeUser(user.id)}
                      disabled={loading}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 font-semibold text-sm rounded-lg hover:bg-emerald-200 transition-colors disabled:opacity-50"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      Promote
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
