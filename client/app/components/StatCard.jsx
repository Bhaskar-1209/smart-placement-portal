export default function StatCard({ label, value, tone = "teal" }) {
  const colors = {
    teal: ["#ccfbf1", "#0f766e"],
    rose: ["#ffe4e6", "#be123c"],
    amber: ["#fef3c7", "#b45309"],
    blue: ["#dbeafe", "#1d4ed8"],
  };
  const [background, color] = colors[tone] || colors.teal;

  return (
    <div className="card">
      <span className="badge" style={{ background, color }}>{label}</span>
      <strong style={{ display: "block", marginTop: 12, fontSize: 30 }}>{value ?? 0}</strong>
    </div>
  );
}
