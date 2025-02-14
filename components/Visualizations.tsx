"use client";

import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart as ReLineChart, Line } from "recharts";

export function BarChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#22c55e" />
        <YAxis stroke="#22c55e" />
        <Tooltip />
        <Bar dataKey="value" fill="#22c55e" />
      </ReBarChart>
    </ResponsiveContainer>
  );
}

export function LineChart({ data }: { data: { date: string; score: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#22c55e" />
        <YAxis stroke="#22c55e" />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={2} />
      </ReLineChart>
    </ResponsiveContainer>
  );
}
