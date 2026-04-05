const express = require('express');
const router = express.Router();
const tg = require('../tigergraph');
const mockData = require('../mockData');

// Attack paths compute karo
function computeAttackPaths(startId, vertices, edges, maxHops) {
  const visited = new Set();
  const reachedNodes = [];
  const reachedEdges = [];
  let current = [startId];
  visited.add(startId);

  for (let hop = 0; hop < maxHops; hop++) {
    const next = [];
    for (const edg of edges) {
      if (current.includes(edg.from) && !visited.has(edg.to)) {
        visited.add(edg.to);
        next.push(edg.to);
        reachedEdges.push(edg);
        const node = vertices.find(v => v.id === edg.to);
        if (node) reachedNodes.push({ ...node, hops: hop + 1 });
      }
    }
    current = next;
    if (current.length === 0) break;
  }

  const critical = reachedNodes.filter(
    n => n.attrs.risk_level === "critical" || n.attrs.sensitivity === "critical"
  );

  return { reachedNodes, reachedEdges, critical };
}

router.get('/graph', async (req, res) => {
  try {
    const data = await tg.getFullGraph();
    res.json(data);
  } catch (err) {
    // TigerGraph connect na ho toh mock data use karo
    res.json(mockData);
  }
});

router.post('/simulate', async (req, res) => {
  const { nodeId } = req.body;
  try {
    const paths = await tg.getAttackPaths(nodeId);
    res.json(paths);
  } catch (err) {
    // Mock data se compute karo
    const result = computeAttackPaths(
      nodeId,
      mockData.vertices,
      mockData.edges,
      5
    );
    res.json(result);
  }
});

module.exports = router;
