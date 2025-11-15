// 讀取 schema.sql，建立 SQLite 資料庫檔案
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'annotations.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

function initDatabase() {
  console.log('Initializing SQLite database...');

  // 讀取schema.sql
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');

  // 資料庫
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Failed to open database:', err.message);
      process.exit(1);
    }
  });

  // 執行SQL
  db.exec(schema, (err) => {
    if (err) {
      console.error('Failed to initialize database schema:', err.message);
      process.exit(1);
    } else {
      console.log('Database schema initialized successfully.');
    }

    db.close((closeErr) => {
      if (closeErr) {
        console.error('Failed to close database:', closeErr.message);
        process.exit(1);
      }
      console.log(`Database is ready at: ${DB_PATH}`);
    });
  });
}

initDatabase();
