"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiBell, FiBriefcase, FiFileText, FiGrid, FiHome, FiLogOut, FiSearch, FiUser, FiUsers } from "react-icons/fi";
import useAuth from "../hooks/useAuth";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: FiGrid, roles: ["admin", "student", "company"] },
  { href: "/jobs", label: "Jobs", icon: FiBriefcase, roles: ["admin", "student", "company"] },
  { href: "/companies", label: "Companies", icon: FiHome, roles: ["admin", "student"] },
  { href: "/applications", label: "Applications", icon: FiFileText, roles: ["admin", "student", "company"] },
  { href: "/profile", label: "Profile", icon: FiUser, roles: ["student", "company"] },
  { href: "/admin", label: "Admin", icon: FiUsers, roles: ["admin"] },
];

export default function AppShell({ children, title = "Smart Placement Portal" }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const visibleLinks = links.filter((link) => link.roles.includes(user?.role));

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/" style={{ display: "block", marginBottom: 28 }}>
          <strong style={{ display: "block", fontSize: 20 }}>Smart Placement</strong>
          <span style={{ color: "#99f6e4", fontSize: 13 }}>Portal</span>
        </Link>
        <nav style={{ display: "grid", gap: 6 }}>
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="nav-link">
                <Icon aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>{title}</h1>
            <p style={{ margin: "4px 0 0", color: "var(--muted)" }}>{user?.name} · {user?.role}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FiSearch aria-label="Search" title="Search" />
            <FiBell aria-label="Notifications" title="Notifications" />
            <button
              className="btn btn-secondary"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              <FiLogOut aria-hidden /> Logout
            </button>
          </div>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}
