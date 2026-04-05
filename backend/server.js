const express = require('express');
const cors = require('cors');
require('dotenv').config();
const graphRoutes = require('./routes/graph');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', graphRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CyberSentinel backend running on port ${PORT}`);
});