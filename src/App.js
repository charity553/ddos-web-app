// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Simulation from './pages/Simulation';
import Metrics from './pages/Metrics';
import Dashboard from './pages/Dashboard'; 
import SimulationDetails from './pages/SimulationDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Navbar */}
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">DDoS Toolkit</h1>
          <div className="space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            <Link to="/simulation" className="text-gray-700 hover:text-blue-600">Simulation</Link>
            <Link to="/metrics" className="text-gray-700 hover:text-blue-600">Metrics</Link>
          </div>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/dashboard/:id" element={<SimulationDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
