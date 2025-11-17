// 管理連線 + 操作函式
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '..', '..', 'database', 'annotations.db');

// 建立連線
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`SQLite database connected at: ${DB_PATH}`);
  }
});

// 封裝
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onResult(err) {
      if (err) {
        return reject(err);
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// 建立圖片記錄
async function createImage({
  filename,
  originalName,
  filePath,
  fileSize,
  mimeType,
}) {
  const sql = `
    INSERT INTO images (filename, original_name, file_path, file_size, mime_type)
    VALUES (?, ?, ?, ?, ?)
  `;

  const result = await runAsync(sql, [
    filename,
    originalName,
    filePath,
    fileSize,
    mimeType,
  ]);

  const image = await getAsync(
    `
    SELECT *
    FROM images
    WHERE id = ?
  `,
    [result.lastID],
  );

  return image;
}

// label 加到圖片上
async function addLabelToImage(imageId, labelName, confidence = 1.0) {
  const label = await findOrCreateLabelByName(labelName);

  // 避免重複
  await runAsync(
    `
    INSERT OR IGNORE INTO annotations (image_id, label_id, confidence)
    VALUES (?, ?, ?)
  `,
    [imageId, label.id, confidence],
  );
}

// 從圖片移除 label
async function removeLabelFromImage(imageId, labelId) {
  await runAsync(
    `
    DELETE FROM annotations
    WHERE image_id = ? AND label_id = ?
  `,
    [imageId, labelId],
  );
}

// 取得圖片 + 擁有的labels
async function getImageByIdWithLabels(imageId) {
  const image = await getAsync(
    `
    SELECT *
    FROM images
    WHERE id = ?
  `,
    [imageId],
  );

  if (!image) {
    return null;
  }

  const rows = await allAsync(
    `
    SELECT
      l.id        AS label_id,
      l.name      AS label_name,
      a.confidence AS confidence
    FROM annotations a
    JOIN labels l ON a.label_id = l.id
    WHERE a.image_id = ?
  `,
    [imageId],
  );

  const labels = rows.map((row) => ({
    id: row.label_id,
    name: row.label_name,
    confidence: row.confidence,
  }));

  return {
    ...image,
    labels,
  };
}

// gallery
async function getAllImagesWithLabels() {
  const images = await allAsync(
    `
    SELECT *
    FROM images
    ORDER BY uploaded_at DESC, id DESC
  `,
  );

  if (images.length === 0) {
    return [];
  }

  const imageIds = images.map((img) => img.id);

  const placeholder = imageIds.map(() => '?').join(',');

  const rows = await allAsync(
    `
    SELECT
      a.image_id   AS image_id,
      l.id         AS label_id,
      l.name       AS label_name,
      a.confidence AS confidence
    FROM annotations a
    JOIN labels l ON a.label_id = l.id
    WHERE a.image_id IN (${placeholder})
  `,
    imageIds,
  );

  const labelsByImageId = new Map();

  rows.forEach((row) => {
    if (!labelsByImageId.has(row.image_id)) {
      labelsByImageId.set(row.image_id, []);
    }
    labelsByImageId.get(row.image_id).push({
      id: row.label_id,
      name: row.label_name,
      confidence: row.confidence,
    });
  });

  const result = images.map((img) => ({
    ...img,
    labels: labelsByImageId.get(img.id) || [],
  }));

  return result;
}

// 全部 labels
async function getAllLabels() {
  return await allAsync(`
    SELECT id, name, created_at
    FROM labels
    ORDER BY id ASC
  `);
}

// 新增/找到 label
async function findOrCreateLabelByName(name) {
  const existing = await getAsync(`SELECT * FROM labels WHERE name = ?`, [name]);
  if (existing) return existing;

  const result = await runAsync(
    `INSERT INTO labels (name) VALUES (?)`,
    [name],
  );

  return await getAsync(`SELECT * FROM labels WHERE id = ?`, [result.lastID]);
}

// 修改 label 名稱
async function updateLabelName(id, name) {
  await runAsync(
    `
    UPDATE labels
    SET name = ?
    WHERE id = ?
    `,
    [name, id]
  );
}

// 刪除 label
async function deleteLabelById(id) {
  await runAsync(`DELETE FROM labels WHERE id = ?`, [id]);
}

module.exports = {
  db,
  runAsync,
  getAsync,
  allAsync,
  createImage,
  findOrCreateLabelByName,
  addLabelToImage,
  removeLabelFromImage,
  getImageByIdWithLabels,
  getAllImagesWithLabels,
  getAllLabels,
  updateLabelName,
  deleteLabelById,
};
