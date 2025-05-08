import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const SimulationDetails = () => {
  const { id } = useParams();
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allLogs, setAllLogs] = useState([]); // State for all logs

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

  const fetchAllLogs = () => {
    fetch(`http://localhost:5000/api/simulations/${id}/logs`)
      .then((res) => res.json())
      .then((data) => {
        setAllLogs(data);
      })
      .catch((err) => {
        console.error("Failed to fetch all logs:", err);
      });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const { timestamp, attack_type, intensity, duration, target_url, total_requests, peak_cpu, peak_memory, logs } = simulation;
    
    // Add title
    doc.setFontSize(22);
    doc.text("Simulation Details", 14, 20);

    // Add simulation info
    doc.setFontSize(14);
    doc.text(`Timestamp: ${new Date(timestamp).toLocaleString()}`, 14, 30);
    doc.text(`Attack Type: ${attack_type}`, 14, 40);
    doc.text(`Intensity: ${intensity} requests/sec`, 14, 50);
    doc.text(`Duration: ${duration} seconds`, 14, 60);
    doc.text(`Target URL: ${target_url}`, 14, 70);
    doc.text(`Total Requests: ${total_requests}`, 14, 80);
    doc.text(`Peak CPU: ${peak_cpu}%`, 14, 90);
    doc.text(`Peak Memory: ${peak_memory}%`, 14, 100);

    // Add logs (limiting to 5 logs for brevity in the PDF)
    doc.text("Traffic Logs (First 5 Entries):", 14, 110);
    logs.slice(0, 5).forEach((log, index) => {
      const logText = `Time: ${new Date(log.timestamp).toLocaleString()}, Request Type: ${log.request_type}, Requests/sec: ${log.requests_per_sec}, Response Time: ${log.response_time} ms`;
      doc.text(logText, 14, 120 + index * 10);
    });

    // Save the PDF
    doc.save('simulation_details.pdf');
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!simulation) return <div className="p-8 text-red-600">Simulation not found.</div>;

  const { timestamp, attack_type, intensity, duration, target_url, total_requests, peak_cpu, peak_memory, logs = [] } = simulation;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Simulation Details</h2>

      {/* Basic Simulation Info */}
      <div className="space-y-4 text-lg mb-8">
        <div><strong>Timestamp:</strong> {new Date(timestamp).toLocaleString()}</div>
        <div><strong>Attack Type:</strong> {attack_type}</div>
        <div><strong>Intensity:</strong> {intensity} requests/sec</div>
        <div><strong>Duration:</strong> {duration} seconds</div>
        <div>
          <strong>Target URL:</strong>{' '}
          <a href={target_url} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
            {target_url}
          </a>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">System Metrics Summary</h3>
        <div className="p-4 border rounded bg-gray-50 space-y-2">
          <div><strong>Total Requests:</strong> {total_requests}</div>
          <div><strong>Peak CPU Usage:</strong> {peak_cpu}%</div>
          <div><strong>Peak Memory Usage:</strong> {peak_memory}%</div>
        </div>
      </div>

      {/* Logs */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Traffic Logs</h3>
        {logs.length > 0 ? (
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li key={index} className="p-4 border rounded bg-gray-50">
                <div><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</div>
                <div><strong>Request Type:</strong> {log.request_type}</div>
                <div><strong>Requests/sec:</strong> {log.requests_per_sec}</div>
                <div><strong>Response Time:</strong> {log.response_time} ms</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No traffic logs available.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          onClick={exportToPDF}
        >
          Export to PDF
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded"
          onClick={fetchAllLogs}
        >
          View All Logs
        </button>
        <Link
          to="/dashboard"
          className="ml-auto text-blue-600 hover:underline self-center"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Display all logs after fetching */}
      {allLogs.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">All Traffic Logs</h3>
          <ul className="space-y-2">
            {allLogs.map((log, index) => (
              <li key={index} className="p-4 border rounded bg-gray-50">
                <div><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</div>
                <div><strong>Request Type:</strong> {log.request_type}</div>
                <div><strong>Requests/sec:</strong> {log.requests_per_sec}</div>
                <div><strong>Response Time:</strong> {log.response_time} ms</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SimulationDetails;
