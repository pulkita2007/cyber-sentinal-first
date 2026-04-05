import { useEffect, useRef } from "react";

export default function GraphView({ data, onNodeSelect, attackPaths, selectedNode }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const attackNodeIds = new Set(
      (attackPaths?.reachedNodes || []).map(n => n.id)
    );
    const attackEdgeIds = new Set(
      (attackPaths?.reachedEdges || []).map(e => `${e.from}-${e.to}`)
    );

    const nodeColors = {
      User:     { fill: "#1a1a4e", stroke: "#4444ff" },
      Device:   { fill: "#1a2e1a", stroke: "#44aa44" },
      Server:   { fill: "#2e1a1a", stroke: "#aa8844" },
      Database: { fill: "#2e2a00", stroke: "#ffaa00" },
    };

    // Simple force-like positioning
    const nodeCount = data.vertices.length;
    const positions = {};
    data.vertices.forEach((v, i) => {
      const angle = (i / nodeCount) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.35;
      positions[v.id] = {
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
      };
    });

    // Clear previous
    svgRef.current.innerHTML = "";

    const svg = svgRef.current;

    // Draw edges first
    data.edges.forEach((e) => {
      const from = positions[e.from];
      const to = positions[e.to];
      if (!from || !to) return;

      const isAttack = attackEdgeIds.has(`${e.from}-${e.to}`);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", from.x);
      line.setAttribute("y1", from.y);
      line.setAttribute("x2", to.x);
      line.setAttribute("y2", to.y);
      line.setAttribute("stroke", isAttack ? "#ff4444" : "#333366");
      line.setAttribute("stroke-width", isAttack ? "3" : "1.5");
      line.setAttribute("stroke-dasharray", isAttack ? "6,3" : "none");
      line.setAttribute("marker-end", "url(#arrow)");
      svg.appendChild(line);
    });

    // Arrow marker
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#555" />
      </marker>
    `;
    svg.insertBefore(defs, svg.firstChild);

    // Draw nodes
    data.vertices.forEach((v) => {
      const pos = positions[v.id];
      const colors = nodeColors[v.type] || { fill: "#1a1a2e", stroke: "#4444ff" };
      const isSelected = selectedNode?.id === v.id;
      const isAttacked = attackNodeIds.has(v.id);
      const isCritical = v.attrs.risk_level === "critical";

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.style.cursor = "pointer";

      // Node circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", pos.x);
      circle.setAttribute("cy", pos.y);
      circle.setAttribute("r", isCritical ? 28 : 22);
      circle.setAttribute("fill", isSelected ? "#ff2222" : isAttacked ? "#3a0000" : colors.fill);
      circle.setAttribute("stroke", isSelected ? "#ffffff" : isAttacked ? "#ff4444" : colors.stroke);
      circle.setAttribute("stroke-width", isSelected ? "4" : isCritical ? "3" : "2");

      // Glow effect for selected
      if (isSelected) {
        circle.setAttribute("filter", "url(#glow)");
      }

      // Label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", pos.x);
      text.setAttribute("y", pos.y + 38);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#cccccc");
      text.setAttribute("font-size", "11");
      text.setAttribute("font-family", "monospace");
      text.textContent = v.attrs.name;

      // Type icon in circle
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "text");
      icon.setAttribute("x", pos.x);
      icon.setAttribute("y", pos.y + 5);
      icon.setAttribute("text-anchor", "middle");
      icon.setAttribute("font-size", "14");
      icon.textContent =
        v.type === "User" ? "👤" :
        v.type === "Device" ? "💻" :
        v.type === "Server" ? "🖥️" : "🗄️";

      g.appendChild(circle);
      g.appendChild(icon);
      g.appendChild(text);

      // CLICK EVENT
      g.addEventListener("click", () => {
        onNodeSelect({
          id: v.id,
          name: v.attrs.name,
          type: v.type,
        });
      });

      // Hover effect
      g.addEventListener("mouseenter", () => {
        circle.setAttribute("stroke-width", "4");
        circle.setAttribute("r", "26");
      });
      g.addEventListener("mouseleave", () => {
        circle.setAttribute("stroke-width", isSelected ? "4" : "2");
        circle.setAttribute("r", isCritical ? "28" : "22");
      });

      svg.appendChild(g);
    });

    // Glow filter
    const glowFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    glowFilter.setAttribute("id", "glow");
    glowFilter.innerHTML = `
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    `;
    defs.appendChild(glowFilter);

  }, [data, attackPaths, selectedNode]);

  if (!data) return (
    <div className="graph-container" style={{
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <p style={{ color: "#555" }}>⏳ Graph load ho raha hai...</p>
    </div>
  );

  return (
    <div className="graph-container">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ background: "transparent" }}
      />
    </div>
  );
}