import React, { useState } from "react";

const Simulation = () => {
  const [attackType, setAttackType] = useState("SYN Flood");
  const [targetUrl, setTargetUrl] = useState(""); // targetUrl instead of target
  const [duration, setDuration] = useState(10);
  const [intensity, setIntensity] = useState(50); // intensity default value
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Launching simulation...");

    try {
      const response = await fetch("http://localhost:5000/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attack_type: attackType,
          duration: parseInt(duration),
          intensity: intensity, // send intensity to backend
          target_url: targetUrl, // send target_url directly
        }),
      });

      if (!response.ok) throw new Error("Simulation failed");

      const result = await response.json();
      setMessage(`✅ Simulation started (ID: ${result.simulation.id})`);
    } catch (error) {
      setMessage("❌ Error starting simulation");
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Run a DDoS Simulation</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Attack Type */}
        <div>
          <label className="block font-semibold mb-1">Attack Type</label>
          <select value={attackType} onChange={(e) => setAttackType(e.target.value)} className="w-full border p-2 rounded">
            <option value="SYN Flood">SYN Flood</option>
            <option value="UDP Flood">UDP Flood</option>
            <option value="HTTP GET Flood">HTTP GET Flood</option>
            <option value="HTTP POST Flood">HTTP POST Flood</option>
          </select>
        </div>

        {/* Target URL */}
        <div>
          <label className="block font-semibold mb-1">Target URL</label>
          <input
            type="url"
            required
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block font-semibold mb-1">Duration (seconds)</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Intensity */}
        <div>
          <label className="block font-semibold mb-1">Intensity (1-100)</label>
          <input
            type="range"
            min="1"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            className="w-full"
          />
          <div className="text-center">{intensity}</div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Run Simulation
        </button>
      </form>

      {message && <div className="mt-4 text-center text-blue-700 font-semibold">{message}</div>}
    </div>
  );
};

export default Simulation;
