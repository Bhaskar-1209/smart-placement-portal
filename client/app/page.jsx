import Link from "next/link";
import { FiArrowRight, FiBriefcase, FiPieChart, FiShield } from "react-icons/fi";

export default function Home() {
  return (
    <main>
      <section style={{ minHeight: "82vh", display: "grid", alignItems: "center", padding: "44px 28px", background: "linear-gradient(135deg, #0f766e 0%, #102a2d 72%)", color: "#fff" }}>
        <div style={{ width: "min(1120px, 100%)", margin: "0 auto", display: "grid", gap: 28 }}>
          <div style={{ maxWidth: 760 }}>
            <p style={{ margin: "0 0 12px", color: "#99f6e4", fontWeight: 800 }}>College recruitment management</p>
            <h1 style={{ margin: 0, fontSize: "clamp(38px, 7vw, 72px)", lineHeight: 1 }}>Smart Placement Portal</h1>
            <p style={{ color: "#d5f8f4", fontSize: 18, lineHeight: 1.7 }}>
              Manage students, companies, jobs, drives, interviews, applications, notifications and placement reports from one secure role-based portal.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link className="btn" href="/login">Login <FiArrowRight aria-hidden /></Link>
              <Link className="btn btn-secondary" href="/register">Register</Link>
            </div>
          </div>
          <div className="grid-auto">
            {[["Role security", FiShield], ["Drive operations", FiBriefcase], ["Reports and charts", FiPieChart]].map(([label, Icon]) => (
              <div key={label} style={{ border: "1px solid rgba(255,255,255,.22)", borderRadius: 8, padding: 18, background: "rgba(255,255,255,.08)" }}>
                <Icon size={24} aria-hidden />
                <strong style={{ display: "block", marginTop: 12 }}>{label}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
