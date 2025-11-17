// server/routes/images.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const {
  createImage,
  addLabelToImage,
  getAllImagesWithLabels,
  getImageByIdWithLabels,
  removeLabelFromImage,
  runAsync,
} = require('../models/database');

const router = express.Router();

// 上傳目的地
const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'images');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `img_${timestamp}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });


// Get Images
router.get('/', async (req, res) => {
  try {
    const images = await getAllImagesWithLabels();
    res.json(images);
  } catch (err) {
    console.error('GET /api/images error:', err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});


// Get Image ID
router.get('/:id', async (req, res) => {
  const imageId = req.params.id;

  try {
    const image = await getImageByIdWithLabels(imageId);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
  } catch (err) {
    console.error('GET /api/images/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});


// 上傳圖片
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const savedFile = req.file;

    const image = await createImage({
      filename: savedFile.filename,
      originalName: savedFile.originalname,
      filePath: `/uploads/images/${savedFile.filename}`,
      fileSize: savedFile.size,
      mimeType: savedFile.mimetype,
    });

    res.json(image);
  } catch (err) {
    console.error('POST /api/images error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});


// 新增labels
router.post('/:id/labels', async (req, res) => {
  const imageId = req.params.id;
  const { label_name, confidence } = req.body;

  if (!label_name) {
    return res.status(400).json({ error: 'label_name is required' });
  }

  try {
    await addLabelToImage(imageId, label_name, confidence || 1.0);

    const updated = await getImageByIdWithLabels(imageId);
    res.json(updated);
  } catch (err) {
    console.error('POST /api/images/:id/labels error:', err);
    res.status(500).json({ error: 'Failed to add label' });
  }
});

// 刪除 label
router.delete('/:id/labels/:labelId', async (req, res) => {
  const imageId = req.params.id;
  const labelId = req.params.labelId;

  try {
    await removeLabelFromImage(imageId, labelId);

    const updated = await getImageByIdWithLabels(imageId);
    res.json(updated);
  } catch (err) {
    console.error('DELETE /api/images/:id/labels/:labelId error:', err);
    res.status(500).json({ error: 'Failed to remove label' });
  }
});

// 刪除圖片
router.delete('/:id', async (req, res) => {
  const imageId = req.params.id;

  try {
    // 取資料，確認存在，刪掉檔案
    const img = await getImageByIdWithLabels(imageId);
    if (!img) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // 刪除圖片
    const diskPath = path.join(__dirname, '..', '..', img.file_path);
    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
    }

    // 刪除紀錄
    await runAsync(`DELETE FROM images WHERE id = ?`, [imageId]);

    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/images/:id error:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;
