"use client";

import { useState } from "react";
import { useAlert } from "@/providers/AlertProvider";
import { createUser } from "./actions";
import { User, Shield, ShieldAlert, Plus, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export function UsersClient({ initialUsers, userCap }: { initialUsers: any[]; userCap: number }) {
  const [users, setUsers] = useState(initialUsers);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createUser(formData);
      if (res.success) {
        showAlert({ title: "Success", message: "User created successfully", type: "success" });
        setIsCreating(false);
        setFormData({ name: "", email: "", password: "", role: "ADMIN" });
        router.refresh(); // Refresh page to get updated users
      } else {
        showAlert({ title: "Error", message: res.error, type: "error" });
      }
    } catch (err: any) {
      showAlert({ title: "Error", message: "Unexpected error occurred", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const isAtCap = users.length >= userCap;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage system access and roles</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-xl text-sm font-medium ${isAtCap ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
            Users: {users.length} / {userCap}
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            disabled={isAtCap}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {isCreating && !isAtCap && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Create New User</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="ADMIN">Admin (Restricted Access)</option>
                <option value="SUPERADMIN">Superadmin (Full Access)</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">{user.name || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                      user.role === 'SUPERADMIN' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.role === 'SUPERADMIN' ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm text-right whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
