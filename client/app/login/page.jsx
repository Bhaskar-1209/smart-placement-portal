"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import API from "../services/api";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      const path = values.role === "admin" ? "/auth/admin/login" : "/auth/login";
      const { data } = await API.post(path, values);
      login(data);
      toast.success("Welcome back");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <form className="card" style={{ width: "min(440px, 100%)" }} onSubmit={handleSubmit(onSubmit)}>
        <h1 style={{ marginTop: 0 }}>Login</h1>
        <div className="field"><label>Email</label><input type="email" {...register("email", { required: true })} /></div>
        <div className="field"><label>Password</label><input type="password" {...register("password", { required: true })} /></div>
        <div className="field"><label>Role</label><select {...register("role")} defaultValue="student"><option>student</option><option>company</option><option>admin</option></select></div>
        <button className="btn" style={{ width: "100%", marginTop: 14 }} disabled={isSubmitting}>Login</button>
        <p style={{ color: "var(--muted)" }}><Link href="/forgot-password">Forgot password?</Link> · <Link href="/register">Create account</Link></p>
      </form>
    </main>
  );
}
