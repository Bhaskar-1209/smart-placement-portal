"use client";

import { useEffect, useState } from "react";
import API from "../services/api";
import AppShell from "../components/AppShell";
import RequireAuth from "../components/RequireAuth";
import DataTable from "../components/DataTable";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  useEffect(() => { API.get("/companies").then((res) => setCompanies(res.data.items || [])); }, []);

  return (
    <RequireAuth roles={["admin", "student"]}>
      <AppShell title="Companies">
        <DataTable
          rows={companies}
          columns={[
            { key: "companyName", label: "Company" },
            { key: "industry", label: "Industry" },
            { key: "location", label: "Location" },
            { key: "website", label: "Website", render: (row) => row.website ? <a href={row.website} target="_blank">{row.website}</a> : "-" },
            { key: "isVerified", label: "Status", render: (row) => <span className="badge">{row.isVerified ? "Verified" : "Pending"}</span> },
          ]}
        />
      </AppShell>
    </RequireAuth>
  );
}
