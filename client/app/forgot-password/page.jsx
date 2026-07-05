"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import API from "../services/api";

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm();
  const submit = async (values) => {
    const { data } = await API.post("/auth/forgot-password", values);
    toast.success(data.message);
  };
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <form className="card" style={{ width: "min(420px, 100%)" }} onSubmit={handleSubmit(submit)}>
        <h1>Forgot Password</h1>
        <div className="field"><label>Email</label><input type="email" {...register("email", { required: true })} /></div>
        <button className="btn" style={{ marginTop: 12 }}>Send Reset Link</button>
      </form>
    </main>
  );
}
