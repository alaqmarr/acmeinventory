"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAlert } from "@/providers/AlertProvider";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showAlert } = useAlert();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        showAlert({
          title: "Login Failed",
          message: "Invalid email or password.",
          type: "error",
        });
      } else {
        router.push("/");
        router.refresh();
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
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100 ">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 ">Acme Inventory</h1>
          <p className="text-slate-500 leading-relaxed mt-2 text-sm">
            Sign in to manage your system.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-black :ring-white outline-none transition-all"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-black :ring-white outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all border border-blue-700 font-medium rounded-xl hover:bg-gray-800 :bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
