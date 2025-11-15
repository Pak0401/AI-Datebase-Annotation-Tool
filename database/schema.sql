PRAGMA foreign_keys = ON;

-- 圖片表, 基本資訊
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,           -- 檔名
    original_name TEXT NOT NULL,      -- 上傳的原始檔名
    file_path TEXT NOT NULL,          -- 檔案路徑
    file_size INTEGER,                -- 檔案大小（bytes）
    mime_type TEXT,                   -- jpeg/png
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 標籤表, 存放label
CREATE TABLE IF NOT EXISTS labels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 關聯表
CREATE TABLE IF NOT EXISTS annotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_id INTEGER NOT NULL,
    label_id INTEGER NOT NULL,
    confidence REAL DEFAULT 1.0,      -- 反正宜家全人工, 再睇睇要唔要整, keep住先
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE,
    UNIQUE (image_id, label_id)       -- 圖/label 不要重複
);
