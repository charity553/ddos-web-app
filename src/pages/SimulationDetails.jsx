// src/pages/SimulationDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const SimulationDetails = () => {
  const { id } = useParams();
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/simulations/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Simulation not found");
        return res.json();
      })
      .then((data) => {
        setSimulation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!simulation) return <div className="p-8 text-red-600">Simulation not found.</div>;

  const { timestamp, attack_type, intensity, duration, target } = simulation;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Simulation Details</h2>

      <div className="space-y-4 text-lg">
        <div><strong>ID:</strong> {simulation.id}</div>
        <div><strong>Timestamp:</strong> {new Date(timestamp).toLocaleString()}</div>
        <div><strong>Attack Type:</strong> {attack_type}</div>
        <div><strong>Intensity:</strong> {intensity} requests/sec</div>
        <div><strong>Duration:</strong> {duration} seconds</div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Target</h3>
          <p><strong>Name:</strong> {target.name}</p>
          <p><strong>URL:</strong> <a href={target.url} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">{target.url}</a></p>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default SimulationDetails;
