-- ============================================================
-- GROW UP CLASSES - COMPLETE MYSQL DATABASE SCHEMA
-- Tuition & Learning Platform Multi-Branch Database
-- ============================================================

CREATE DATABASE IF NOT EXISTS grow_up_classes_db;
USE grow_up_classes_db;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ROLE_ADMIN',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table (Registered Visitors)
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100),
    mobile VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100),
    first_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'VERIFIED'
);

-- 3. Branches Table
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
);

-- 4. Courses Table
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
);

-- 5. Enquiries / Leads Table
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
    status ENUM('NEW', 'CONTACTED', 'FOLLOW-UP', 'CONVERTED', 'NOT INTERESTED') DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- 6. Enquiry Notes Table (Follow-up log)
CREATE TABLE IF NOT EXISTS enquiry_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enquiry_id VARCHAR(36) NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE CASCADE
);

-- 7. Teachers Table
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
);

-- 8. Founders Table
CREATE TABLE IF NOT EXISTS founders (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    bio TEXT,
    message TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    year VARCHAR(50),
    statistic VARCHAR(100) NOT NULL,
    student_name VARCHAR(100),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(36) PRIMARY KEY,
    customer_student_name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    comment TEXT NOT NULL,
    rating INT DEFAULT 5,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

INSERT IGNORE INTO admins (id, name, email, password_hash, role) VALUES 
('adm-1', 'Super Admin', 'admin@growupclasses.in', 'admin123', 'ROLE_SUPER_ADMIN');

INSERT IGNORE INTO branches (id, name, area, address, phone, email, timings, map_link, image_url) VALUES 
('br-1', 'Jayanagar Flagship Branch', 'Jayanagar 4th Block', '452, 11th Main Road, Jayanagar, Bengaluru - 560011', '+91 98450 12345', 'jayanagar@growupclasses.in', 'Mon-Sat 7am-8:30pm', 'https://maps.google.com/?q=Jayanagar', 'https://images.unsplash.com/photo-1562774053-701939374585'),
('br-2', 'Indiranagar Academic Centre', 'Indiranagar 100ft Road', '88, 100 Feet Road, Indiranagar, Bengaluru - 560038', '+91 98450 23456', 'indiranagar@growupclasses.in', 'Mon-Sat 7am-8:30pm', 'https://maps.google.com/?q=Indiranagar', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644');
