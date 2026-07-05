import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="card" style={{ textAlign: "center" }}>
        <h1>404</h1>
        <p style={{ color: "var(--muted)" }}>The page you requested was not found.</p>
        <Link className="btn" href="/">Go Home</Link>
      </div>
    </main>
  );
}
