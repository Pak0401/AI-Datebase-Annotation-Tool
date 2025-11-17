// server/routes/labels.js
const express = require('express');
const {
  getAllLabels,
  findOrCreateLabelByName,
  updateLabelName,
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
    console.error('POST /labels error:', err);
    res.status(500).json({ error: 'Failed to create label' });
  }
});

// 編輯 label
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    await updateLabelName(req.params.id, name.trim());
    res.json({ success: true });
  } catch (err) {
    console.error('PUT /labels error:', err);
    res.status(500).json({ error: 'Failed to edit label' });
  }
});

// 刪除 label
router.delete('/:id', async (req, res) => {
  try {
    await deleteLabelById(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /labels error:', err);
    res.status(500).json({ error: 'Failed to delete label' });
  }
});

module.exports = router;
