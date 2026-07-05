"use client";

import { useEffect, useState } from "react";
import API from "../services/api";
import AppShell from "../components/AppShell";
import RequireAuth from "../components/RequireAuth";
import DataTable from "../components/DataTable";

export default function AdminPage() {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    API.get("/students").then((res) => setStudents(res.data.items || []));
    API.get("/companies").then((res) => setCompanies(res.data.items || []));
    API.get("/drives").then((res) => setDrives(res.data.items || []));
  }, []);

  const downloadReport = async (path, fileName) => {
    const { data } = await API.get(path, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <RequireAuth roles={["admin"]}>
      <AppShell title="Admin Console">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          <button className="btn" onClick={() => downloadReport("/reports/export/excel", "placement-report.csv")}>Export Excel</button>
          <button className="btn btn-secondary" onClick={() => downloadReport("/reports/export/pdf", "placement-summary.pdf")}>Export PDF</button>
        </div>
        <h2>Students</h2>
        <DataTable rows={students} columns={[{ key: "name", label: "Name", render: (r) => r.user?.name }, { key: "branch", label: "Branch" }, { key: "batch", label: "Batch" }, { key: "cgpa", label: "CGPA" }]} />
        <h2>Companies</h2>
        <DataTable rows={companies} columns={[{ key: "companyName", label: "Company" }, { key: "location", label: "Location" }, { key: "industry", label: "Industry" }]} />
        <h2>Placement Drives</h2>
        <DataTable rows={drives} columns={[{ key: "title", label: "Title" }, { key: "company", label: "Company", render: (r) => r.company?.companyName }, { key: "status", label: "Status" }]} />
      </AppShell>
    </RequireAuth>
  );
}
