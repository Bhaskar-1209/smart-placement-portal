"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import API from "../services/api";
import useAuth from "../hooks/useAuth";

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm({ defaultValues: { role: "student" } });
  const [role, setRole] = useState("student");

  const onSubmit = async (values) => {
    try {
      const { data } = await API.post("/auth/register", values);
      login(data);
      toast.success("Account created");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <form className="card" style={{ width: "min(560px, 100%)" }} onSubmit={handleSubmit(onSubmit)}>
        <h1 style={{ marginTop: 0 }}>Create Account</h1>
        <div className="grid-auto">
          <div className="field"><label>Name</label><input {...register("name", { required: true })} /></div>
          <div className="field"><label>Email</label><input type="email" {...register("email", { required: true })} /></div>
          <div className="field"><label>Password</label><input type="password" {...register("password", { required: true, minLength: 6 })} /></div>
          <div className="field">
            <label>Role</label>
            <select
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setValue("role", event.target.value, { shouldValidate: true });
              }}
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
            </select>
          </div>
          {role === "company" ? (
            <div className="field"><label>Company Name</label><input {...register("companyName")} /></div>
          ) : (
            <>
              <div className="field"><label>Enrollment No</label><input {...register("enrollmentNo")} /></div>
              <div className="field"><label>Branch</label><input {...register("branch")} /></div>
              <div className="field"><label>Batch</label><input {...register("batch")} /></div>
            </>
          )}
        </div>
        <button className="btn" style={{ width: "100%", marginTop: 14 }} disabled={isSubmitting}>Register</button>
        <p style={{ color: "var(--muted)" }}>Already registered? <Link href="/login">Login</Link></p>
      </form>
    </main>
  );
}
