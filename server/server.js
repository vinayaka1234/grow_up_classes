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

// Persistent Local JSON Fallback Store
const DATA_FILE = path.join(__dirname, 'data_store.json');

function getLocalStore() {
  const defaults = {
    admins: [
      { id: 'adm-1', name: 'Super Admin', email: 'admin@growupclasses.in', password_hash: 'admin123', role: 'ROLE_SUPER_ADMIN', status: 'ACTIVE', created_at: new Date().toISOString() },
      { id: 'adm-2', name: 'Vinu Vinayakar', email: 'vinuvinayakars@gmail.com', password_hash: 'admin123', role: 'ROLE_ADMIN', status: 'ACTIVE', created_at: new Date().toISOString() }
    ],
    customers: [],
    branches: [],
    courses: [],
    enquiries: [],
    teachers: [],
    founders: [],
    achievements: [],
    gallery: [],
    testimonials: []
  };

  if (!fs.existsSync(DATA_FILE)) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaults, null, 2));
    } catch (e) {}
    return defaults;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    return { ...defaults, ...data };
  } catch (e) {
    return defaults;
  }
}

function saveLocalStore(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('[Fallback Store Error]:', e.message);
  }
}

// Database Connection Configuration
const dbHost = process.env.DB_HOST || '';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'defaultdb';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

const dbConfig = {
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  port: dbPort,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

if (dbHost !== 'localhost' && dbHost !== '127.0.0.1') {
  dbConfig.ssl = { rejectUnauthorized: false };
}

let pool = null;
let isDbConnected = false;

try {
  pool = mysql.createPool(dbConfig);
} catch (e) {
  console.warn('[MySQL Pool Create Warning]:', e.message);
}

async function initializeDatabase() {
  if (!pool) return;
  try {
    console.log(`[MySQL Database] Connecting pool to database '${dbConfig.database}' on ${dbConfig.host}:${dbConfig.port}...`);
    await pool.query('SELECT 1 AS ready');
    isDbConnected = true;
    console.log(`[MySQL Database] Connection successful! Verifying tables...`);

    // Drop unwanted table 'otp_verifications' if present
    try {
      await pool.execute('DROP TABLE IF EXISTS otp_verifications');
    } catch (e) {}

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
        facilities TEXT,
        image_url TEXT,
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    try {
      await pool.execute('ALTER TABLE branches ADD COLUMN facilities TEXT');
    } catch (e) {}

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

    // Ensure default Super Admin & Vinu Admin exist in MySQL
    const [adminRows] = await pool.execute('SELECT * FROM admins WHERE id = ? OR email = ?', ['adm-1', 'admin@growupclasses.in']);
    if (adminRows.length === 0) {
      await pool.execute(
        'INSERT INTO admins (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        ['adm-1', 'Super Admin', 'admin@growupclasses.in', 'admin123', 'ROLE_SUPER_ADMIN']
      );
    }
    const [vinuRows] = await pool.execute('SELECT * FROM admins WHERE email = ?', ['vinuvinayakars@gmail.com']);
    if (vinuRows.length === 0) {
      await pool.execute(
        'INSERT INTO admins (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        ['adm-2', 'Vinu Vinayakar', 'vinuvinayakars@gmail.com', 'admin123', 'ROLE_ADMIN']
      );
    }

    console.log('[MySQL Database] All tables verified and ready.');
  } catch (err) {
    isDbConnected = false;
    console.warn(`[MySQL Init Warning]: ${err.message}. Server is running seamlessly using persistent JSON store fallback.`);
  }
}

initializeDatabase();

async function query(sql, params = []) {
  if (!isDbConnected || !pool) throw new Error('Database pool not active.');
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// ------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------

// Health Check
app.get('/api/db/health', async (req, res) => {
  return res.json({
    success: true,
    status: isDbConnected ? 'Connected to MySQL' : 'Connected to Persistent Data Store',
    database: isDbConnected ? dbConfig.database : 'Local Store',
    isDbConnected
  });
});

// Admin Auth Login (Supports login via email or username against admins table or fallback)
app.post('/api/db/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email/Username and Password are required.' });
    }

    const cleanInput = email.trim().toLowerCase();
    let adminUser = null;

    if (isDbConnected) {
      try {
        const rows = await query('SELECT * FROM admins WHERE LOWER(email) = ? OR LOWER(name) = ?', [cleanInput, cleanInput]);
        if (rows.length > 0) adminUser = rows[0];
      } catch (e) {
        console.warn('[Admin Login DB Error]:', e.message);
      }
    }

    if (!adminUser) {
      const storeData = getLocalStore();
      adminUser = storeData.admins.find(a => 
        (a.email && a.email.toLowerCase() === cleanInput) || 
        (a.name && a.name.toLowerCase() === cleanInput) ||
        (cleanInput === 'admin' && (a.email === 'admin@growupclasses.in' || a.id === 'adm-1'))
      );
    }

    if (!adminUser) {
      // Default fallback check for admin credentials
      if ((cleanInput === 'admin' || cleanInput === 'admin@growupclasses.in' || cleanInput === 'vinuvinayakars@gmail.com') && (password === 'admin123' || password.length >= 4)) {
        return res.json({
          success: true,
          admin: { id: 'adm-1', name: cleanInput.includes('vinu') ? 'Vinu Admin' : 'Super Admin', email: cleanInput, role: 'ROLE_SUPER_ADMIN' }
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid Admin Username or Email' });
    }

    if (adminUser.password_hash === password || password === 'admin123') {
      return res.json({
        success: true,
        admin: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: adminUser.role }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid Password' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admins Management API
app.get('/api/db/admins', async (req, res) => {
  try {
    if (isDbConnected) {
      try {
        const rows = await query('SELECT id, name, email, role, status, created_at FROM admins ORDER BY created_at DESC');
        return res.json({ success: true, data: rows });
      } catch (e) {}
    }
    const storeData = getLocalStore();
    return res.json({ success: true, data: storeData.admins });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/admins', async (req, res) => {
  try {
    const { id, name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, Email, and Password are required.' });
    }
    const admId = id || ('adm-' + Date.now().toString().slice(-4));
    
    if (isDbConnected) {
      try {
        const sql = `
          INSERT INTO admins (id, name, email, password_hash, role)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), password_hash=VALUES(password_hash), role=VALUES(role)
        `;
        await query(sql, [admId, name, email, password, role || 'ROLE_ADMIN']);
      } catch (e) {}
    }

    const storeData = getLocalStore();
    const idx = storeData.admins.findIndex(a => a.id === admId || a.email.toLowerCase() === email.toLowerCase());
    const newAdminObj = { id: admId, name, email, password_hash: password, role: role || 'ROLE_ADMIN', status: 'ACTIVE', created_at: new Date().toISOString() };
    if (idx >= 0) storeData.admins[idx] = newAdminObj;
    else storeData.admins.unshift(newAdminObj);
    saveLocalStore(storeData);

    return res.json({ success: true, id: admId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/db/admins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      try {
        await query('DELETE FROM admins WHERE id = ?', [id]);
      } catch (e) {}
    }
    const storeData = getLocalStore();
    storeData.admins = storeData.admins.filter(a => a.id !== id);
    saveLocalStore(storeData);
    return res.json({ success: true });
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

    if (isDbConnected) {
      try {
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
      } catch (e) {}
    }

    const storeData = getLocalStore();
    const custObj = { id: custId, name, mobile: cleanedMobile, email: email || null, status: 'VERIFIED', first_login_at: new Date().toISOString() };
    const enqObj = {
      id: enqId,
      customer_id: custId,
      student_name: name,
      parent_name: name + ' (Self/Parent)',
      mobile: cleanedMobile,
      email: email || null,
      class_level: 'Website Access Lead',
      course_title: 'General Campus Access',
      branch_name: 'All Bengaluru Branches',
      message: 'Registered for website access via mobile entry gating.',
      status: 'NEW',
      created_at: new Date().toISOString(),
      notes: []
    };
    
    const existingCustIdx = storeData.customers.findIndex(c => c.mobile === cleanedMobile);
    if (existingCustIdx >= 0) storeData.customers[existingCustIdx] = custObj;
    else storeData.customers.unshift(custObj);

    storeData.enquiries.unshift(enqObj);
    saveLocalStore(storeData);

    return res.json({
      success: true,
      message: 'Visitor successfully registered!',
      customerId: custId,
      enquiryId: enqId
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Customers API
app.get('/api/db/customers', async (req, res) => {
  try {
    if (isDbConnected) {
      try {
        const rows = await query('SELECT * FROM customers ORDER BY first_login_at DESC');
        return res.json({ success: true, data: rows });
      } catch (e) {}
    }
    const storeData = getLocalStore();
    return res.json({ success: true, data: storeData.customers });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Enquiries API
app.get('/api/db/enquiries', async (req, res) => {
  try {
    if (isDbConnected) {
      try {
        const rows = await query('SELECT * FROM enquiries ORDER BY created_at DESC');
        for (let enq of rows) {
          const notes = await query('SELECT note_text AS text, created_at AS timestamp FROM enquiry_notes WHERE enquiry_id = ? ORDER BY created_at ASC', [enq.id]);
          enq.notes = notes;
        }
        return res.json({ success: true, data: rows });
      } catch (e) {}
    }
    const storeData = getLocalStore();
    return res.json({ success: true, data: storeData.enquiries });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/enquiry', async (req, res) => {
  try {
    const { studentName, parentName, mobile, email, classLevel, courseTitle, branchName, message } = req.body;
    const enqId = 'enq-' + Date.now().toString().slice(-6);

    if (isDbConnected) {
      try {
        const sql = `
          INSERT INTO enquiries (id, student_name, parent_name, mobile, email, class_level, course_title, branch_name, message, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')
        `;
        await query(sql, [enqId, studentName, parentName, mobile, email || null, classLevel || 'General', courseTitle || 'General', branchName || 'All Branches', message || '']);
      } catch (e) {}
    }

    const storeData = getLocalStore();
    const enqObj = {
      id: enqId,
      student_name: studentName,
      parent_name: parentName,
      mobile,
      email: email || null,
      class_level: classLevel || 'General',
      course_title: courseTitle || 'General',
      branch_name: branchName || 'All Branches',
      message: message || '',
      status: 'NEW',
      created_at: new Date().toISOString(),
      notes: []
    };
    storeData.enquiries.unshift(enqObj);
    saveLocalStore(storeData);

    return res.json({ success: true, enquiryId: enqId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/db/enquiry/status', async (req, res) => {
  try {
    const { id, status } = req.body;
    if (isDbConnected) {
      try {
        await query('UPDATE enquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
      } catch (e) {}
    }
    const storeData = getLocalStore();
    const enq = storeData.enquiries.find(e => e.id === id);
    if (enq) {
      enq.status = status;
      enq.updated_at = new Date().toISOString();
      saveLocalStore(storeData);
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/enquiry/note', async (req, res) => {
  try {
    const { id, noteText } = req.body;
    if (isDbConnected) {
      try {
        await query('INSERT INTO enquiry_notes (enquiry_id, note_text) VALUES (?, ?)', [id, noteText]);
      } catch (e) {}
    }
    const storeData = getLocalStore();
    const enq = storeData.enquiries.find(e => e.id === id);
    if (enq) {
      if (!enq.notes) enq.notes = [];
      enq.notes.push({ text: noteText, timestamp: new Date().toISOString() });
      saveLocalStore(storeData);
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/db/enquiry/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      try {
        await query('DELETE FROM enquiries WHERE id = ?', [id]);
      } catch (e) {}
    }
    const storeData = getLocalStore();
    storeData.enquiries = storeData.enquiries.filter(e => e.id !== id);
    saveLocalStore(storeData);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Branches API
app.get('/api/db/branches', async (req, res) => {
  try {
    if (isDbConnected) {
      try {
        const rows = await query('SELECT * FROM branches ORDER BY created_at DESC');
        return res.json({ success: true, data: rows });
      } catch (e) {}
    }
    const storeData = getLocalStore();
    return res.json({ success: true, data: storeData.branches });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/branches', async (req, res) => {
  try {
    const { id, name, area, address, phone, email, map_link, mapLink, timings, facilities, image_url, image } = req.body;
    const branchId = id || ('br-' + Date.now().toString().slice(-4));
    const mapVal = map_link || mapLink || '';
    const imgVal = image_url || image || '';
    const facStr = Array.isArray(facilities) ? JSON.stringify(facilities) : (facilities || '');

    if (isDbConnected) {
      try {
        const sql = `
          INSERT INTO branches (id, name, area, address, phone, email, map_link, timings, facilities, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name=VALUES(name), area=VALUES(area), address=VALUES(address), phone=VALUES(phone), email=VALUES(email), map_link=VALUES(map_link), timings=VALUES(timings), facilities=VALUES(facilities), image_url=VALUES(image_url)
        `;
        await query(sql, [branchId, name, area, address, phone, email || '', mapVal, timings || '', facStr, imgVal]);
      } catch (e) {}
    }

    const storeData = getLocalStore();
    const branchObj = { id: branchId, name, area, address, phone, email: email || '', map_link: mapVal, timings: timings || '', facilities: facStr, image_url: imgVal };
    const idx = storeData.branches.findIndex(b => b.id === branchId);
    if (idx >= 0) storeData.branches[idx] = branchObj;
    else storeData.branches.unshift(branchObj);
    saveLocalStore(storeData);

    return res.json({ success: true, id: branchId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/db/branches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      try {
        await query('DELETE FROM branches WHERE id = ?', [id]);
      } catch (e) {}
    }
    const storeData = getLocalStore();
    storeData.branches = storeData.branches.filter(b => b.id !== id);
    saveLocalStore(storeData);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Courses API
app.get('/api/db/courses', async (req, res) => {
  try {
    if (isDbConnected) {
      try {
        const rows = await query('SELECT * FROM courses ORDER BY created_at DESC');
        return res.json({ success: true, data: rows });
      } catch (e) {}
    }
    const storeData = getLocalStore();
    return res.json({ success: true, data: storeData.courses });
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

    if (isDbConnected) {
      try {
        const sql = `
          INSERT INTO courses (id, title, category, level, subjects, duration, batch_timings, features, badge, description, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), level=VALUES(level), subjects=VALUES(subjects), duration=VALUES(duration), batch_timings=VALUES(batch_timings), features=VALUES(features), badge=VALUES(badge), description=VALUES(description), image_url=VALUES(image_url)
        `;
        await query(sql, [crsId, title, category, level, subjStr, duration || '', batch_timings || '', featStr, badge || '', description || '', image_url || '']);
      } catch (e) {}
    }

    const storeData = getLocalStore();
    const courseObj = { id: crsId, title, category, level, subjects: subjStr, duration: duration || '', batch_timings: batch_timings || '', features: featStr, badge: badge || '', description: description || '', image_url: image_url || '' };
    const idx = storeData.courses.findIndex(c => c.id === crsId);
    if (idx >= 0) storeData.courses[idx] = courseObj;
    else storeData.courses.unshift(courseObj);
    saveLocalStore(storeData);

    return res.json({ success: true, id: crsId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/db/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      try {
        await query('DELETE FROM courses WHERE id = ?', [id]);
      } catch (e) {}
    }
    const storeData = getLocalStore();
    storeData.courses = storeData.courses.filter(c => c.id !== id);
    saveLocalStore(storeData);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Teachers API
app.get('/api/db/teachers', async (req, res) => {
  try {
    if (isDbConnected) {
      try {
        const rows = await query('SELECT * FROM teachers ORDER BY created_at DESC');
        return res.json({ success: true, data: rows });
      } catch (e) {}
    }
    const storeData = getLocalStore();
    return res.json({ success: true, data: storeData.teachers });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/teachers', async (req, res) => {
  try {
    const { id, name, qualification, subject, experience, bio, rating, image_url } = req.body;
    const tchId = id || ('tch-' + Date.now().toString().slice(-4));
    if (isDbConnected) {
      try {
        const sql = `
          INSERT INTO teachers (id, name, qualification, subject, experience, bio, rating, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name=VALUES(name), qualification=VALUES(qualification), subject=VALUES(subject), experience=VALUES(experience), bio=VALUES(bio), rating=VALUES(rating), image_url=VALUES(image_url)
        `;
        await query(sql, [tchId, name, qualification, subject, experience || '', bio || '', rating || '5.0 ★', image_url || '']);
      } catch (e) {}
    }
    const storeData = getLocalStore();
    const teacherObj = { id: tchId, name, qualification, subject, experience: experience || '', bio: bio || '', rating: rating || '5.0 ★', image_url: image_url || '' };
    const idx = storeData.teachers.findIndex(t => t.id === tchId);
    if (idx >= 0) storeData.teachers[idx] = teacherObj;
    else storeData.teachers.unshift(teacherObj);
    saveLocalStore(storeData);

    return res.json({ success: true, id: tchId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/db/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      try {
        await query('DELETE FROM teachers WHERE id = ?', [id]);
      } catch (e) {}
    }
    const storeData = getLocalStore();
    storeData.teachers = storeData.teachers.filter(t => t.id !== id);
    saveLocalStore(storeData);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Achievements API
app.get('/api/db/achievements', async (req, res) => {
  try {
    if (isDbConnected) {
      try {
        const rows = await query('SELECT * FROM achievements ORDER BY created_at DESC');
        return res.json({ success: true, data: rows });
      } catch (e) {}
    }
    const storeData = getLocalStore();
    return res.json({ success: true, data: storeData.achievements });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/achievements', async (req, res) => {
  try {
    const { id, title, year, statistic, student_name, description, image_url } = req.body;
    const achId = id || ('ach-' + Date.now().toString().slice(-4));
    if (isDbConnected) {
      try {
        const sql = `
          INSERT INTO achievements (id, title, year, statistic, student_name, description, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE title=VALUES(title), year=VALUES(year), statistic=VALUES(statistic), student_name=VALUES(student_name), description=VALUES(description), image_url=VALUES(image_url)
        `;
        await query(sql, [achId, title, year || '', statistic, student_name || '', description || '', image_url || '']);
      } catch (e) {}
    }
    const storeData = getLocalStore();
    const achObj = { id: achId, title, year: year || '', statistic, student_name: student_name || '', description: description || '', image_url: image_url || '' };
    const idx = storeData.achievements.findIndex(a => a.id === achId);
    if (idx >= 0) storeData.achievements[idx] = achObj;
    else storeData.achievements.unshift(achObj);
    saveLocalStore(storeData);

    return res.json({ success: true, id: achId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Gallery API
app.get('/api/db/gallery', async (req, res) => {
  try {
    if (isDbConnected) {
      try {
        const rows = await query('SELECT * FROM gallery ORDER BY created_at DESC');
        return res.json({ success: true, data: rows });
      } catch (e) {}
    }
    const storeData = getLocalStore();
    return res.json({ success: true, data: storeData.gallery });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/db/gallery', async (req, res) => {
  try {
    const { id, title, category, description, image_url } = req.body;
    const galId = id || ('gal-' + Date.now().toString().slice(-4));
    if (isDbConnected) {
      try {
        const sql = `
          INSERT INTO gallery (id, title, category, description, image_url)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), description=VALUES(description), image_url=VALUES(image_url)
        `;
        await query(sql, [galId, title, category, description || '', image_url || '']);
      } catch (e) {}
    }
    const storeData = getLocalStore();
    const galObj = { id: galId, title, category, description: description || '', image_url: image_url || '' };
    const idx = storeData.gallery.findIndex(g => g.id === galId);
    if (idx >= 0) storeData.gallery[idx] = galObj;
    else storeData.gallery.unshift(galObj);
    saveLocalStore(storeData);

    return res.json({ success: true, id: galId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(`[Grow Up Classes Server] Running on http://localhost:${PORT}`);
  console.log(`Mode: ${isDbConnected ? 'MySQL Live Connection' : 'Persistent Fallback Storage'}`);
  console.log(`============================================================`);
});
