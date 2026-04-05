import { useState, useEffect } from "react";
import axios from "axios";
import GraphView from "./components/GraphView";
import RiskReport from "./components/RiskReport";
import "./App.css";

export default function App() {
  const [graphData, setGraphData] = useState(null);
  const [attackPaths, setAttackPaths] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/graph")
      .then(r => setGraphData(r.data))
      .catch(() => console.log("Backend se data nahi aaya"));
  }, []);

  const simulate = async () => {
    if (!selectedNode) return alert("Please select a node from the graph first!");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/simulate", {
        nodeId: selectedNode.id
      });
      setAttackPaths(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const reset = () => {
    setAttackPaths(null);
    setSelectedNode(null);
  };

  const totalNodes = graphData?.vertices?.length || 0;
  const attackPathCount = attackPaths?.reachedNodes?.length || 0;
  const criticalCount = attackPaths?.critical?.length || 0;

  return (
    <div className="app">

      {/* Header */}
      <div className="header">
        <h1>🛡️ CyberSentinel</h1>
        <p>Real-time Attack Path Simulator — Powered by TigerGraph</p>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-pill">
          <span className="stat-num">{totalNodes}</span>
          <span className="stat-label">Total Nodes</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-pill">
          <span className="stat-num" style={{ color: attackPathCount > 0 ? "#ffaa00" : "#fff" }}>
            {attackPathCount}
          </span>
          <span className="stat-label">Nodes Reachable</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-pill">
          <span className="stat-num" style={{ color: criticalCount > 0 ? "#ff4444" : "#fff" }}>
            {criticalCount}
          </span>
          <span className="stat-label">Critical Assets Exposed</span>
        </div>
      </div>

      {/* Selected Node Info */}
      <div className="info-bar">
        {selectedNode ? (
          <span>
            ⚠️ Compromised Node Selected:{" "}
            <strong style={{ color: "#ff4444" }}>{selectedNode.name}</strong>
            <span style={{ color: "#666", marginLeft: 10, fontSize: "0.85rem" }}>
              ({selectedNode.type})
            </span>
          </span>
        ) : (
          <span style={{ color: "#888" }}>
            👆 Click any node on the graph to select it as compromised
          </span>
        )}
      </div>

      {/* Graph + Legend side by side */}
      <div className="graph-wrapper">
        <GraphView
          data={graphData}
          onNodeSelect={setSelectedNode}
          attackPaths={attackPaths}
          selectedNode={selectedNode}
        />

        {/* Legend */}
        <div className="legend">
          <h4>Legend</h4>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#1a1a4e", border: "2px solid #4444ff" }} />
            <span>👤 User</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#1a2e1a", border: "2px solid #44aa44" }} />
            <span>💻 Device</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#2e1a1a", border: "2px solid #aa8844" }} />
            <span>🖥️ Server</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#2e2a00", border: "2px solid #ffaa00" }} />
            <span>🗄️ Database</span>
          </div>
          <hr style={{ border: "1px solid #222", margin: "12px 0" }} />
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#ff2222", border: "3px solid #fff" }} />
            <span>☠️ Compromised</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#3a0000", border: "2px solid #ff4444" }} />
            <span>⚠️ At Risk</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#2e2a00", border: "3px solid #ffaa00" }} />
            <span>🔴 Critical Asset</span>
          </div>
          <hr style={{ border: "1px solid #222", margin: "12px 0" }} />
          <div className="legend-line">
            <span className="legend-edge" style={{ background: "#333366" }} />
            <span>Connection</span>
          </div>
          <div className="legend-line">
            <span className="legend-edge" style={{ background: "#ff4444" }} />
            <span>Attack Path</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="btn-row">
        <button
          className={`simulate-btn ${loading ? "loading" : ""}`}
          onClick={simulate}
          disabled={loading}
        >
          {loading ? "⏳ Simulating..." : "⚔️ Simulate Attack"}
        </button>

        {attackPaths && (
          <button className="reset-btn" onClick={reset}>
            🔄 Reset
          </button>
        )}
      </div>

      {/* Risk Report */}
      {attackPaths && (
        <RiskReport paths={attackPaths} entryNode={selectedNode} />
      )}

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2>⚡ How CyberSentinel Works</h2>
        <div className="hiw-grid">
          <div className="hiw-card">
            <div className="hiw-icon">🕸️</div>
            <h3>Graph Modeling</h3>
            <p>
              Your entire IT infrastructure — users, devices, servers, and
              databases — is modeled as a connected graph in TigerGraph.
            </p>
          </div>
          <div className="hiw-card">
            <div className="hiw-icon">⚡</div>
            <h3>Why Graph Database?</h3>
            <p>
              Traditional SQL databases cannot efficiently traverse
              multi-hop relationships. TigerGraph computes 6-degree
              attack paths in under 100ms.
            </p>
          </div>
          <div className="hiw-card">
            <div className="hiw-icon">🎯</div>
            <h3>Real-time Simulation</h3>
            <p>
              Select any compromised node and instantly see every
              asset an attacker can reach — before a real attack happens.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}