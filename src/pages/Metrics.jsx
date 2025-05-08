import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from "recharts";

const COLORS = ["#1E3A8A", "#E5E7EB"]; // Blue for used, gray for unused

const Metrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/metrics")
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch metrics", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading system metrics...</div>;

  const latestMetric = metrics[metrics.length - 1];

  const cpuData = [
    { name: "Used", value: latestMetric?.cpu_usage || 0 },
    { name: "Free", value: 100 - (latestMetric?.cpu_usage || 0) }
  ];

  const memoryData = metrics.map((m, index) => ({
    name: `#${index + 1}`,
    value: m.memory_usage
  }));

  const loadData = metrics.map((m, index) => ({
    name: `#${index + 1}`,
    value: m.server_load
  }));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">System Metrics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* CPU Usage PieChart */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">CPU Usage</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Shows the percentage of CPU being utilized during the most recent simulation.
          </p>
          <PieChart width={200} height={200}>
            <Pie
              data={cpuData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              {cpuData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
          <div className="mt-4 text-blue-600 text-xl font-bold">
            {latestMetric?.cpu_usage?.toFixed(1)}%
          </div>
        </div>

        {/* Memory Usage LineChart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Memory Usage Over Time</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Tracks how much memory was used across the latest simulations.
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={memoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1D4ED8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Server Load BarChart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">Server Load</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Indicates how heavily the server was loaded during recent simulations.
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={loadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
