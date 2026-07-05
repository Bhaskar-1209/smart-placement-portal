"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import AppShell from "../components/AppShell";
import RequireAuth from "../components/RequireAuth";
import DataTable from "../components/DataTable";
import useAuth from "../hooks/useAuth";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const load = () => API.get("/applications").then((res) => setRows(res.data.items || []));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await API.patch(`/applications/${id}`, { status });
    toast.success("Application updated");
    load();
  };

  return (
    <RequireAuth>
      <AppShell title="Applications">
        <DataTable
          rows={rows}
          columns={[
            { key: "student", label: "Student", render: (row) => row.student?.user?.name || "Student" },
            { key: "job", label: "Job", render: (row) => row.job?.title },
            { key: "company", label: "Company", render: (row) => row.company?.companyName },
            { key: "status", label: "Status", render: (row) => <span className="badge">{row.status}</span> },
            {
              key: "action",
              label: "",
              render: (row) => user?.role !== "student" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn" onClick={() => updateStatus(row._id, "shortlisted")}>Shortlist</button>
                  <button className="btn btn-secondary" onClick={() => updateStatus(row._id, "rejected")}>Reject</button>
                </div>
              ) : null,
            },
          ]}
        />
      </AppShell>
    </RequireAuth>
  );
}
