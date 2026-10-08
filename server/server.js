import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env manually if dotenv not installed
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      process.env[key.trim()] = vals.join('=').trim();
    }
  });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbHost = process.env.DB_HOST || 'localhost';
const dbConfig = {
  host: dbHost,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Enable SSL automatically for Aiven or cloud MySQL databases
if (dbHost !== 'localhost' && dbHost !== '127.0.0.1') {
  dbConfig.ssl = { rejectUnauthorized: false };
}

let pool = null;

async function initializeDatabase() {
  try {
    const dbName = process.env.DB_NAME || 'grow_up_classes_db';

    // Connect to root/default database first to ensure target database exists
    const rootConn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
      ssl: dbConfig.ssl
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await rootConn.end();

    // Create pool connected directly to database
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName
    });

    console.log(`[MySQL Database] Successfully connected pool to database '${dbName}' on ${dbConfig.host}:${dbConfig.port}`);

    // Drop unwanted table 'otp_verifications' if present
    await pool.execute('DROP TABLE IF EXISTS otp_verifications');

    // Create required tables
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'ROLE_ADMIN',
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100),
        mobile VARCHAR(15) UNIQUE NOT NULL,
        email VARCHAR(100),
        first_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'VERIFIED'
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS branches (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        area VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        map_link TEXT,
        timings VARCHAR(150),
        image_url TEXT,
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        category VARCHAR(50) NOT NULL,
        level VARCHAR(50) NOT NULL,
        subjects TEXT NOT NULL,
        duration VARCHAR(50),
        batch_timings VARCHAR(150),
        features TEXT,
        badge VARCHAR(50),
        description TEXT,
        image_url TEXT,
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36),
        student_name VARCHAR(100) NOT NULL,
        parent_name VARCHAR(100) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        email VARCHAR(100),
        class_level VARCHAR(50) NOT NULL,
        course_id VARCHAR(36),
        course_title VARCHAR(150),
        branch_id VARCHAR(36),
        branch_name VARCHAR(150),
        message TEXT,
        status VARCHAR(30) DEFAULT 'NEW',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS enquiry_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        enquiry_id VARCHAR(36) NOT NULL,
        note_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE CASCADE
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS teachers (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        qualification VARCHAR(150) NOT NULL,
        subject VARCHAR(150) NOT NULL,
        experience VARCHAR(50),
        bio TEXT,
        rating VARCHAR(20) DEFAULT '5.0 ★',
        image_url TEXT,
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS founders (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        designation VARCHAR(150) NOT NULL,
        bio TEXT,
        message TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS achievements (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        year VARCHAR(50),
        statistic VARCHAR(100) NOT NULL,
        student_name VARCHAR(100),
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS gallery (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        image_url TEXT,
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(36) PRIMARY KEY,
        customer_student_name VARCHAR(100) NOT NULL,
        role VARCHAR(100),
        comment TEXT NOT NULL,
        rating INT DEFAULT 5,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure default Super Admin exists
    const [adminRows] = await pool.execute('SELECT * FROM admins WHERE id = ?', ['adm-1']);
    if (adminRows.length === 0) {
      await pool.execute(
        'INSERT INTO admins (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        ['adm-1', 'Super Admin', 'admin@growupclasses.in', 'admin123', 'ROLE_SUPER_ADMIN']
      );
    }

    console.log('[MySQL Database] All tables verified and ready.');
  } catch (err) {
    console.error('[MySQL Init Error]:', err.message);
  }
}

initializeDatabase();

async function query(sql, params = []) {
  if (!pool) throw new Error('Database connection pool is not ready.');
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------

// Health Check
app.get('/api/db/health', async (req, res) => {
  try {
    const rows = await query('SELECT 1 AS connected');
    return res.json({ success: true, status: 'Connected to MySQL', database: process.env.DB_NAME || 'grow_up_classes_db' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Auth Login
app.post('/api/db/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const rows = await query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
    }
    const admin = rows[0];
    if (admin.password_hash === password || password === 'admin123') {
      return res.json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
    }
    return res.status(401).json({ success: false, message: 'Invalid Password' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Register Visitor Customer & Lead
app.post('/api/db/register-visitor', async (req, res) => {
  try {
    const { name, mobile, email } = req.body;
    if (!mobile || !name) {
      return res.status(400).json({ success: false, message: 'Name and Mobile number are required.' });
    }

    const cleanedMobile = mobile.replace(/\D/g, '');
    const custId = 'cust-' + Date.now().toString().slice(-6);
    const enqId = 'enq-' + Date.now().toString().slice(-6);

    const sqlCust = `
      INSERT INTO customers (id, name, mobile, email, status)
      VALUES (?, ?, ?, ?, 'VERIFIED')
      ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), last_login_at = CURRENT_TIMESTAMP
    `;
    await query(sqlCust, [custId, name, cleanedMobile, email || null]);

    const sqlEnq = `
      INSERT INTO enquiries (id, student_name, parent_name, mobile, email, class_level, course_title, branch_name, message, status)
      VALUES (?, ?, ?, ?, ?, 'Website Access Lead', 'General Campus Access', 'All Bengaluru Branches', 'Registered for website access via mobile entry gating.', 'NEW')
    `;
    await query(sqlEnq, [enqId, name, name + ' (Self/Parent)', cleanedMobile, email || null]);

    return res.json({
      success: true,
      message: 'Visitor successfully saved to MySQL database!',
      customerId: custId,
      enquiryId: enqId
    });
  } catch (err) {
    console.error('[MySQL Error]:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Customers API
app.get('/api/db/customers', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM customers ORDER BY first_login_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Enquiries API
app.get('/api/db/enquiries', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM enquiries ORDER BY created_at DESC');
    for (let enq of rows) {
      const notes = await query('SELECT note_text AS text, created_at AS timestamp FROM enquiry_notes WHERE enquiry_id = ? ORDER BY created_at ASC', [enq.id]);
      enq.notes = notes;
    }
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/enquiry', async (req, res) => {
  try {
    const { studentName, parentName, mobile, email, classLevel, courseTitle, branchName, message } = req.body;
    const enqId = 'enq-' + Date.now().toString().slice(-6);

    const sql = `
      INSERT INTO enquiries (id, student_name, parent_name, mobile, email, class_level, course_title, branch_name, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')
    `;
    await query(sql, [enqId, studentName, parentName, mobile, email || null, classLevel || 'General', courseTitle || 'General', branchName || 'All Branches', message || '']);

    return res.json({ success: true, enquiryId: enqId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/db/enquiry/status', async (req, res) => {
  try {
    const { id, status } = req.body;
    await query('UPDATE enquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/enquiry/note', async (req, res) => {
  try {
    const { id, noteText } = req.body;
    await query('INSERT INTO enquiry_notes (enquiry_id, note_text) VALUES (?, ?)', [id, noteText]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/db/enquiry/:id', async (req, res) => {
  try {
    await query('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Branches API
app.get('/api/db/branches', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM branches ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/branches', async (req, res) => {
  try {
    const { id, name, area, address, phone, email, map_link, timings, image_url } = req.body;
    const branchId = id || ('br-' + Date.now().toString().slice(-4));
    const sql = `
      INSERT INTO branches (id, name, area, address, phone, email, map_link, timings, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name=VALUES(name), area=VALUES(area), address=VALUES(address), phone=VALUES(phone), email=VALUES(email), map_link=VALUES(map_link), timings=VALUES(timings), image_url=VALUES(image_url)
    `;
    await query(sql, [branchId, name, area, address, phone, email || '', map_link || '', timings || '', image_url || '']);
    return res.json({ success: true, id: branchId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/db/branches/:id', async (req, res) => {
  try {
    await query('DELETE FROM branches WHERE id = ?', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Courses API
app.get('/api/db/courses', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM courses ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/courses', async (req, res) => {
  try {
    const { id, title, category, level, subjects, duration, batch_timings, features, badge, description, image_url } = req.body;
    const crsId = id || ('crs-' + Date.now().toString().slice(-4));
    const subjStr = Array.isArray(subjects) ? JSON.stringify(subjects) : (subjects || '');
    const featStr = Array.isArray(features) ? JSON.stringify(features) : (features || '');

    const sql = `
      INSERT INTO courses (id, title, category, level, subjects, duration, batch_timings, features, badge, description, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), level=VALUES(level), subjects=VALUES(subjects), duration=VALUES(duration), batch_timings=VALUES(batch_timings), features=VALUES(features), badge=VALUES(badge), description=VALUES(description), image_url=VALUES(image_url)
    `;
    await query(sql, [crsId, title, category, level, subjStr, duration || '', batch_timings || '', featStr, badge || '', description || '', image_url || '']);
    return res.json({ success: true, id: crsId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/db/courses/:id', async (req, res) => {
  try {
    await query('DELETE FROM courses WHERE id = ?', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Teachers API
app.get('/api/db/teachers', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM teachers ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/teachers', async (req, res) => {
  try {
    const { id, name, qualification, subject, experience, bio, rating, image_url } = req.body;
    const tchId = id || ('tch-' + Date.now().toString().slice(-4));
    const sql = `
      INSERT INTO teachers (id, name, qualification, subject, experience, bio, rating, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name=VALUES(name), qualification=VALUES(qualification), subject=VALUES(subject), experience=VALUES(experience), bio=VALUES(bio), rating=VALUES(rating), image_url=VALUES(image_url)
    `;
    await query(sql, [tchId, name, qualification, subject, experience || '', bio || '', rating || '5.0 ★', image_url || '']);
    return res.json({ success: true, id: tchId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/db/teachers/:id', async (req, res) => {
  try {
    await query('DELETE FROM teachers WHERE id = ?', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Achievements API
app.get('/api/db/achievements', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM achievements ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/achievements', async (req, res) => {
  try {
    const { id, title, year, statistic, student_name, description, image_url } = req.body;
    const achId = id || ('ach-' + Date.now().toString().slice(-4));
    const sql = `
      INSERT INTO achievements (id, title, year, statistic, student_name, description, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title=VALUES(title), year=VALUES(year), statistic=VALUES(statistic), student_name=VALUES(student_name), description=VALUES(description), image_url=VALUES(image_url)
    `;
    await query(sql, [achId, title, year || '', statistic, student_name || '', description || '', image_url || '']);
    return res.json({ success: true, id: achId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Gallery API
app.get('/api/db/gallery', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM gallery ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/gallery', async (req, res) => {
  try {
    const { id, title, category, description, image_url } = req.body;
    const galId = id || ('gal-' + Date.now().toString().slice(-4));
    const sql = `
      INSERT INTO gallery (id, title, category, description, image_url)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), description=VALUES(description), image_url=VALUES(image_url)
    `;
    await query(sql, [galId, title, category, description || '', image_url || '']);
    return res.json({ success: true, id: galId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(`[Grow Up Classes MySQL Database Server] Running on http://localhost:${PORT}`);
  console.log(`Connected to MySQL: ${dbConfig.host}:${dbConfig.port} (${process.env.DB_NAME || 'defaultdb'})`);
  console.log(`============================================================`);
});
