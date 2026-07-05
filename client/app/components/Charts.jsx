"use client";

import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function StatusDoughnut({ rows = [] }) {
  const labels = rows.map((row) => row._id || "unknown");
  const values = rows.map((row) => row.count);
  return (
    <Doughnut
      data={{
        labels,
        datasets: [{ data: values, backgroundColor: ["#0f766e", "#be123c", "#b45309", "#1d4ed8", "#64748b"] }],
      }}
    />
  );
}

export function ActivityBar({ stats = {} }) {
  return (
    <Bar
      data={{
        labels: Object.keys(stats),
        datasets: [{ label: "Total", data: Object.values(stats), backgroundColor: "#0f766e" }],
      }}
      options={{ plugins: { legend: { display: false } } }}
    />
  );
}
