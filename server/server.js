const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 提供public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Dataset Annotation Tool server is running' });
});

// 啟動 server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
