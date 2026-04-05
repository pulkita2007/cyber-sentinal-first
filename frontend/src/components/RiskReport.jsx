export default function RiskReport({ paths, entryNode }) {
  const { reachedNodes = [], critical = [] } = paths;

  return (
    <div className="risk-report">
      <h2>⚠️ Attack Simulation Report</h2>
      <p style={{ color: "#888", marginBottom: 20, fontSize: "0.9rem" }}>
        Entry point: <strong style={{ color: "#ff8888" }}>
          {entryNode?.name}
        </strong>
      </p>

      {/* Stats */}
      <div className="stats">
        <div className="stat-box">
          <div className="number">{reachedNodes.length}</div>
          <div className="label">Total Nodes Reachable</div>
        </div>
        <div className="stat-box">
          <div className="number" style={{ color: "#ff2222" }}>
            {critical.length}
          </div>
          <div className="label">Critical Assets Exposed</div>
        </div>
        <div className="stat-box">
          <div className="number" style={{ color: "#ffaa00" }}>
            {reachedNodes.length > 0
              ? Math.max(...reachedNodes.map(n => n.hops))
              : 0}
          </div>
          <div className="label">Max Hops</div>
        </div>
      </div>

      {/* Critical Assets */}
      {critical.length === 0 ? (
        <div className="safe-msg">
          ✅ No critical assets reachable from this node!
        </div>
      ) : (
        <>
          <h3 style={{ color: "#ff8888", marginBottom: 10 }}>
            🚨 Critical Assets at Risk:
          </h3>
          {critical.map((node, i) => (
            <div className="risk-item" key={i}>
              <div>
                <span style={{ marginRight: 10 }}>🗄️</span>
                <span className="node-name">{node.attrs.name}</span>
              </div>
              <span className="hops">
                Reachable in {node.hops} hop{node.hops > 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </>
      )}

      {/* All reached nodes */}
      <details style={{ marginTop: 20 }}>
        <summary style={{ color: "#888", cursor: "pointer", fontSize: "0.9rem" }}>
          View all {reachedNodes.length} reachable nodes
        </summary>
        {reachedNodes.map((node, i) => (
          <div key={i} style={{
            padding: "8px 12px", marginTop: 6,
            background: "#111", borderRadius: 4,
            fontSize: "0.85rem", color: "#aaa",
            display: "flex", justifyContent: "space-between"
          }}>
            <span>{node.attrs.name} ({node.type})</span>
            <span style={{ color: "#666" }}>{node.hops} hop(s)</span>
          </div>
        ))}
      </details>
    </div>
  );
}