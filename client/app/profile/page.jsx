"use client";

import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import API from "../services/api";
import AppShell from "../components/AppShell";
import RequireAuth from "../components/RequireAuth";
import useAuth from "../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const endpoint = user?.role === "company" ? "/companies/me" : "/students/me";
  const load = useCallback(() => API.get(endpoint).then((res) => { setProfile(res.data); reset(res.data); }), [endpoint, reset]);
  useEffect(() => { if (user?.role && user.role !== "admin") load(); }, [user, load]);

  const save = async (values) => {
    const payload = user.role === "student" ? {
      ...values,
      cgpa: Number(values.cgpa || 0),
      skills: values.skillsText?.split(",").map((item) => item.trim()).filter(Boolean) || profile?.skills,
    } : values;
    await API.patch(endpoint, payload);
    toast.success("Profile saved");
    load();
  };

  const uploadResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    await API.post("/students/resume", formData);
    toast.success("Resume uploaded");
    load();
  };

  return (
    <RequireAuth roles={["student", "company"]}>
      <AppShell title="Profile">
        <form className="card" onSubmit={handleSubmit(save)}>
          <div className="grid-auto">
            {user?.role === "student" ? (
              <>
                <div className="field"><label>Enrollment No</label><input {...register("enrollmentNo")} /></div>
                <div className="field"><label>Branch</label><input {...register("branch")} /></div>
                <div className="field"><label>Batch</label><input {...register("batch")} /></div>
                <div className="field"><label>Semester</label><input type="number" {...register("semester")} /></div>
                <div className="field"><label>CGPA</label><input type="number" step="0.1" {...register("cgpa")} /></div>
                <div className="field"><label>Phone</label><input {...register("phone")} /></div>
                <div className="field"><label>Skills</label><input defaultValue={profile?.skills?.join(", ")} {...register("skillsText")} /></div>
                <div className="field"><label>Resume PDF</label><input type="file" accept="application/pdf" onChange={uploadResume} /></div>
              </>
            ) : (
              <>
                <div className="field"><label>Company Name</label><input {...register("companyName")} /></div>
                <div className="field"><label>Website</label><input {...register("website")} /></div>
                <div className="field"><label>Industry</label><input {...register("industry")} /></div>
                <div className="field"><label>Location</label><input {...register("location")} /></div>
                <div className="field"><label>Contact Person</label><input {...register("contactPerson")} /></div>
                <div className="field"><label>Phone</label><input {...register("contactPhone")} /></div>
              </>
            )}
          </div>
          <div className="field" style={{ marginTop: 12 }}><label>{user?.role === "student" ? "Address" : "Description"}</label><textarea rows="4" {...register(user?.role === "student" ? "address" : "description")} /></div>
          <button className="btn" style={{ marginTop: 12 }}>Save Profile</button>
          {profile?.resume?.fileUrl && <p><a href={`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:7070/api").replace("/api", "")}${profile.resume.fileUrl}`} target="_blank">Preview resume</a></p>}
        </form>
      </AppShell>
    </RequireAuth>
  );
}
