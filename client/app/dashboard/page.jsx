"use client";

import { useEffect, useState } from "react";
import API from "../services/api";
import AppShell from "../components/AppShell";
import RequireAuth from "../components/RequireAuth";
import StatCard from "../components/StatCard";
import { ActivityBar, StatusDoughnut } from "../components/Charts";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const endpoint = user.role === "admin" ? "/reports/dashboard" : user.role === "company" ? "/companies/dashboard" : "/students/dashboard";
    API.get(endpoint).then((res) => setData(res.data)).catch(() => setData({}));
  }, [user]);

  const adminStats = data ? {
    students: data.students,
    companies: data.companies,
    jobs: data.jobs,
    applications: data.applications,
  } : {};

  return (
    <RequireAuth>
      <AppShell title={`${user?.role?.[0]?.toUpperCase()}${user?.role?.slice(1)} Dashboard`}>
        <div className="grid-auto">
          {user?.role === "admin" && (
            <>
              <StatCard label="Students" value={data?.students} />
              <StatCard label="Companies" value={data?.companies} tone="blue" />
              <StatCard label="Jobs" value={data?.jobs} tone="amber" />
              <StatCard label="Applications" value={data?.applications} tone="rose" />
            </>
          )}
          {user?.role === "company" && (
            <>
              <StatCard label="Jobs" value={data?.stats?.jobs} />
              <StatCard label="Open Jobs" value={data?.stats?.openJobs} tone="blue" />
              <StatCard label="Applicants" value={data?.stats?.applicants} tone="amber" />
              <StatCard label="Shortlisted" value={data?.stats?.shortlisted} tone="rose" />
            </>
          )}
          {user?.role === "student" && (
            <>
              <StatCard label="Profile" value={`${data?.profileCompletion || 0}%`} />
              <StatCard label="Applied" value={data?.stats?.applied} tone="blue" />
              <StatCard label="Interviews" value={data?.stats?.interviews} tone="amber" />
              <StatCard label="Offers" value={data?.stats?.offers} tone="rose" />
            </>
          )}
        </div>
        <div className="grid-auto" style={{ marginTop: 18 }}>
          <div className="card">{user?.role === "admin" ? <StatusDoughnut rows={data?.byStatus || []} /> : <ActivityBar stats={data?.stats || {}} />}</div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Recent Activity</h2>
            <p style={{ color: "var(--muted)" }}>Use the sidebar to manage jobs, applications, drives, interviews, notifications and reports.</p>
            {user?.role === "admin" && <ActivityBar stats={adminStats} />}
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
