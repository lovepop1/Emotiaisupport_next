"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "2024-01-01", score: 20 },
  { date: "2024-01-05", score: 25 },
  { date: "2024-01-10", score: 28 },
  { date: "2024-01-15", score: 30 },
  { date: "2024-01-20", score: 35 },
  { date: "2024-01-25", score: 38 },
  { date: "2024-02-01", score: 42 },
];

const EmotionalProgressChart = () => {
  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Emotional Progress Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 48]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionalProgressChart;
