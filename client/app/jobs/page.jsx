"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import API from "../services/api";
import AppShell from "../components/AppShell";
import RequireAuth from "../components/RequireAuth";
import DataTable from "../components/DataTable";
import useAuth from "../hooks/useAuth";

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const load = () => API.get("/jobs?status=all").then((res) => setJobs(res.data.items || []));
  useEffect(() => { load(); }, []);

  const createJob = async (values) => {
    try {
      await API.post("/jobs", {
        ...values,
        package: Number(values.package),
        requiredSkills: values.requiredSkills?.split(",").map((item) => item.trim()).filter(Boolean),
        eligibility: { minCgpa: Number(values.minCgpa || 0), branches: values.branches?.split(",").map((item) => item.trim()).filter(Boolean) },
      });
      toast.success("Job posted");
      reset();
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not post job");
    }
  };

  const apply = async (jobId) => {
    try {
      await API.post(`/applications/jobs/${jobId}/apply`, {});
      toast.success("Application submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not apply");
    }
  };

  return (
    <RequireAuth>
      <AppShell title="Jobs">
        {user?.role === "company" && (
          <form className="card" style={{ marginBottom: 18 }} onSubmit={handleSubmit(createJob)}>
            <h2 style={{ marginTop: 0 }}>Post Job</h2>
            <div className="grid-auto">
              <div className="field"><label>Title</label><input {...register("title", { required: true })} /></div>
              <div className="field"><label>Location</label><input {...register("location", { required: true })} /></div>
              <div className="field"><label>Package</label><input type="number" {...register("package", { required: true })} /></div>
              <div className="field"><label>Deadline</label><input type="date" {...register("deadline", { required: true })} /></div>
              <div className="field"><label>Min CGPA</label><input type="number" step="0.1" {...register("minCgpa")} /></div>
              <div className="field"><label>Skills</label><input placeholder="React, Node" {...register("requiredSkills")} /></div>
              <div className="field"><label>Branches</label><input placeholder="CSE, IT" {...register("branches")} /></div>
            </div>
            <div className="field" style={{ marginTop: 12 }}><label>Description</label><textarea rows="3" {...register("description", { required: true })} /></div>
            <button className="btn" style={{ marginTop: 12 }}>Create Job</button>
          </form>
        )}
        <DataTable
          rows={jobs}
          columns={[
            { key: "title", label: "Title" },
            { key: "company", label: "Company", render: (row) => row.company?.companyName || "Company" },
            { key: "location", label: "Location" },
            { key: "package", label: "Package", render: (row) => `₹${row.package} LPA` },
            { key: "deadline", label: "Deadline", render: (row) => new Date(row.deadline).toLocaleDateString() },
            { key: "status", label: "Status", render: (row) => <span className="badge">{row.status}</span> },
            { key: "action", label: "", render: (row) => user?.role === "student" ? <button className="btn" onClick={() => apply(row._id)}>Apply</button> : null },
          ]}
        />
      </AppShell>
    </RequireAuth>
  );
}
