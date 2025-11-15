// server/routes/labels.js
const express = require('express');
const {
  findOrCreateLabelByName,
  getAllLabels,
  deleteLabelById,
} = require('../models/database');

const router = express.Router();

// 取得全部 labels
router.get('/', async (req, res) => {
  try {
    const labels = await getAllLabels();
    res.json(labels);
  } catch (err) {
    console.error('GET /labels error:', err);
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});
// 新增 label
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const label = await findOrCreateLabelByName(name.trim());
    res.json(label);
  } catch (err) {
    console.error('POST /api/labels error:', err);
    res.status(500).json({ error: 'Failed to create label' });
  }
});

// 刪除 label
router.delete('/:id', async (req, res) => {
  const labelId = req.params.id;
  try {
    await deleteLabelById(labelId);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/labels/:id error:', err);
    res.status(500).json({ error: 'Failed to delete label' });
  }
});

module.exports = router;
