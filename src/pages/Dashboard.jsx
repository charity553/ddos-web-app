// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/simulations")
      .then((res) => res.json())
      .then((data) => {
        setSimulations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch simulations", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading recent simulations...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Recent Simulations</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left">Timestamp</th>
              <th className="px-4 py-2 text-left">Attack Type</th>
              <th className="px-4 py-2 text-left">Requests/sec</th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {simulations.map((sim) => (
              <tr key={sim.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{new Date(sim.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{sim.attack_type}</td>
                <td className="px-4 py-2">{sim.intensity}</td>
                <td className="px-4 py-2">{sim.duration}s</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => navigate(`/dashboard/${sim.id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
