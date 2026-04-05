const axios = require('axios');
require('dotenv').config();

const BASE = process.env.TG_HOST;
const API_KEY = process.env.TG_APIKEY;

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

async function getFullGraph() {
  try {
    const res = await axios.get(
      `${BASE}/restpp/graph/${process.env.TG_GRAPH}/vertices/Device`,
      { headers }
    );
    return res.data;
  } catch(err) {
    throw err;
  }
}

async function getAttackPaths(entryNodeId) {
  try {
    const res = await axios.get(
      `${BASE}/restpp/query/${process.env.TG_GRAPH}/find_attack_paths`,
      { headers, params: { entry_point: entryNodeId, max_hops: 5 } }
    );
    return res.data;
  } catch(err) {
    throw err;
  }
}

module.exports = { getFullGraph, getAttackPaths };