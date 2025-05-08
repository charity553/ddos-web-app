// src/pages/Metrics.jsx
import React, { useEffect, useState } from "react";

const MetricCard = ({ title, value, unit }) => (
  <div className="bg-white p-6 rounded-lg shadow-md w-full">
    <h3 className="text-xl font-semibold mb-2 text-gray-700">{title}</h3>
    <div className="text-3xl font-bold text-blue-600">
      {value} <span className="text-sm text-gray-500">{unit}</span>
    </div>
  </div>
);

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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">System Metrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {metrics.map((metric) => (
          <React.Fragment key={metric.id}>
            <MetricCard title="CPU Usage" value={metric.cpu_usage} unit="%" />
            <MetricCard title="Memory Usage" value={metric.memory_usage} unit="%" />
            <MetricCard title="Server Load" value={metric.server_load} unit="" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Metrics;
