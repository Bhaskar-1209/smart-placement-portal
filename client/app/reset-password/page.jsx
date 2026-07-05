"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import API from "../services/api";

function ResetPasswordForm() {
  const params = useSearchParams();
  const { register, handleSubmit } = useForm({ defaultValues: { token: params.get("token") || "" } });
  const submit = async (values) => {
    const { data } = await API.post("/auth/reset-password", values);
    toast.success(data.message);
  };
  return (
    <form className="card" style={{ width: "min(420px, 100%)" }} onSubmit={handleSubmit(submit)}>
      <h1>Reset Password</h1>
      <div className="field"><label>Token</label><input {...register("token", { required: true })} /></div>
      <div className="field"><label>New Password</label><input type="password" {...register("password", { required: true, minLength: 6 })} /></div>
      <button className="btn" style={{ marginTop: 12 }}>Reset Password</button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <Suspense fallback={<div className="card">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
