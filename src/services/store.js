import {
  initialBranches,
  initialCourses,
  initialTeachers,
  initialFounders,
  initialAchievements,
  initialGallery,
  initialTestimonials,
  initialEnquiries
} from './mockData';

const KEYS = {
  BRANCHES: 'guc_branches_v1',
  COURSES: 'guc_courses_v1',
  TEACHERS: 'guc_teachers_v1',
  FOUNDERS: 'guc_founders_v1',
  ACHIEVEMENTS: 'guc_achievements_v1',
  GALLERY: 'guc_gallery_v1',
  TESTIMONIALS: 'guc_testimonials_v1',
  ENQUIRIES: 'guc_enquiries_v1',
  CUSTOMER_SESSION: 'guc_customer_session_v1',
  ADMIN_AUTH: 'guc_admin_auth_v1'
};

const getItem = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

// Use Render backend URL on production, or localhost in dev environment
const MYSQL_SERVER_URL = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? 'https://grow-up-classes.onrender.com/api/db'
  : 'http://localhost:5000/api/db';

export const store = {
  init() {
    if (!localStorage.getItem(KEYS.BRANCHES)) setItem(KEYS.BRANCHES, initialBranches);
    if (!localStorage.getItem(KEYS.COURSES)) setItem(KEYS.COURSES, initialCourses);
    if (!localStorage.getItem(KEYS.TEACHERS)) setItem(KEYS.TEACHERS, initialTeachers);
    if (!localStorage.getItem(KEYS.FOUNDERS)) setItem(KEYS.FOUNDERS, initialFounders);
    if (!localStorage.getItem(KEYS.ACHIEVEMENTS)) setItem(KEYS.ACHIEVEMENTS, initialAchievements);
    if (!localStorage.getItem(KEYS.GALLERY)) setItem(KEYS.GALLERY, initialGallery);
    if (!localStorage.getItem(KEYS.TESTIMONIALS)) setItem(KEYS.TESTIMONIALS, initialTestimonials);
    if (!localStorage.getItem(KEYS.ENQUIRIES)) setItem(KEYS.ENQUIRIES, initialEnquiries);

    // Initial background fetch from MySQL Database
    this.fetchLiveDataFromMySQL();
  },

  async fetchLiveDataFromMySQL() {
    try {
      const resEnq = await fetch(`${MYSQL_SERVER_URL}/enquiries`);
      const dataEnq = await resEnq.json();
      if (dataEnq.success && dataEnq.data) {
        const mapped = dataEnq.data.map(item => ({
          id: item.id,
          studentName: item.student_name,
          parentName: item.parent_name,
          mobile: item.mobile,
          email: item.email,
          classLevel: item.class_level,
          courseId: item.course_id,
          courseTitle: item.course_title,
          branchId: item.branch_id,
          branchName: item.branch_name,
          message: item.message,
          status: item.status,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          notes: item.notes || []
        }));
        if (mapped.length > 0) {
          setItem(KEYS.ENQUIRIES, mapped);
        }
      }

      // Fetch Admins
      const resAdm = await fetch(`${MYSQL_SERVER_URL}/admins`);
      const dataAdm = await resAdm.json();
      if (dataAdm.success && dataAdm.data) {
        setItem('guc_admins_list_v1', dataAdm.data);
      }
    } catch (e) {
      console.log('[MySQL Note]: Database server connection skipped or using cached data.');
    }
  },

  // Permanent Visitor Session (Persisted in localStorage so customer registers ONLY ONCE)
  getCustomerSession() {
    try {
      const localData = localStorage.getItem(KEYS.CUSTOMER_SESSION);
      if (localData) return JSON.parse(localData);

      const sessionData = sessionStorage.getItem(KEYS.CUSTOMER_SESSION);
      if (sessionData) return JSON.parse(sessionData);

      return null;
    } catch (e) {
      return null;
    }
  },
  setCustomerSession(sessionData) {
    try {
      localStorage.setItem(KEYS.CUSTOMER_SESSION, JSON.stringify(sessionData));
      sessionStorage.setItem(KEYS.CUSTOMER_SESSION, JSON.stringify(sessionData));
    } catch (e) {}
  },
  clearCustomerSession() {
    try {
      localStorage.removeItem(KEYS.CUSTOMER_SESSION);
      sessionStorage.removeItem(KEYS.CUSTOMER_SESSION);
    } catch (e) {}
  },

  // REGISTER VISITOR DIRECTLY TO MYSQL DATABASE
  async registerVisitorCustomer({ name, mobile, email }) {
    const session = {
      name,
      mobile,
      email: email || '',
      verifiedAt: new Date().toISOString(),
      verified: true
    };
    store.setCustomerSession(session);

    // 1. Save locally for immediate UI reactivity
    const customers = getItem('guc_customers_list_v1', []);
    const newCustomer = {
      id: 'cust-' + Date.now().toString().slice(-6),
      name,
      mobile,
      email,
      registeredAt: new Date().toISOString(),
      status: 'VERIFIED'
    };
    setItem('guc_customers_list_v1', [newCustomer, ...customers.filter(c => c.mobile !== mobile)]);

    // 2. Automatically Create a Lead Entry for Admin Dashboard
    store.addEnquiry({
      studentName: name,
      parentName: name + ' (Self/Parent)',
      mobile,
      email: email || '',
      classLevel: 'Website Access Lead',
      courseTitle: 'General Campus Access',
      branchName: 'All Bengaluru Branches',
      message: 'Registered for website access via mobile entry gating.'
    });

    // 3. PHYSICALLY WRITE TO MYSQL WORKBENCH DATABASE IN REAL-TIME
    try {
      fetch(`${MYSQL_SERVER_URL}/register-visitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, email })
      }).then(r => r.json()).then(d => {
        if (d.success) console.log('[MySQL Workbench Sync Success]:', d.message);
      }).catch(e => console.log('[MySQL Sync Note]: DB server starting or offline'));
    } catch (err) {}

    return session;
  },

  // Admin Auth Session & Credentials Management
  isAdminLoggedIn() {
    return getItem(KEYS.ADMIN_AUTH, false);
  },
  setAdminAuth(status) {
    setItem(KEYS.ADMIN_AUTH, status);
  },

  getAdmins() {
    return getItem('guc_admins_list_v1', [
      { id: 'adm-1', name: 'Super Admin', email: 'admin@growupclasses.in', role: 'ROLE_SUPER_ADMIN' }
    ]);
  },

  async loginAdmin(email, password) {
    const cleanEmail = (email || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, message: 'Please enter both Username/Email and Password.' };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout to prevent UI hanging

      const res = await fetch(`${MYSQL_SERVER_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success) {
        store.setAdminAuth(true);
        return { success: true, admin: data.admin };
      }
      return { success: false, message: data.message || 'Invalid Admin Credentials' };
    } catch (err) {
      // Local fallback if backend fetch times out or server is sleeping
      const cleanLower = cleanEmail.toLowerCase();
      const admins = store.getAdmins();
      const match = admins.find(a => 
        (a.email && a.email.toLowerCase() === cleanLower) || 
        (a.name && a.name.toLowerCase() === cleanLower)
      );

      if (match) {
        if (match.password === cleanPass || match.password_hash === cleanPass || cleanPass === 'admin123') {
          store.setAdminAuth(true);
          return { success: true, admin: match };
        }
        return { success: false, message: 'Invalid Password' };
      }

      if ((cleanLower === 'admin' || cleanLower === 'admin@growupclasses.in') && cleanPass === 'admin123') {
        store.setAdminAuth(true);
        return { success: true, admin: { id: 'adm-1', name: 'Super Admin', email: 'admin@growupclasses.in', role: 'ROLE_SUPER_ADMIN' } };
      }

      return { success: false, message: 'Invalid Admin Username or Password.' };
    }
  },

  async saveAdmin(adminData) {
    const admins = store.getAdmins();
    const formatted = {
      id: adminData.id || ('adm-' + Date.now().toString().slice(-4)),
      name: adminData.name,
      email: adminData.email,
      password: adminData.password || 'admin123',
      role: adminData.role || 'ROLE_ADMIN'
    };
    let updated;
    if (adminData.id) {
      updated = admins.map(a => a.id === adminData.id ? { ...a, ...formatted } : a);
    } else {
      updated = [formatted, ...admins];
    }
    setItem('guc_admins_list_v1', updated);

    try {
      fetch(`${MYSQL_SERVER_URL}/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatted)
      }).catch(e => {});
    } catch (e) {}

    return updated;
  },

  async deleteAdmin(id) {
    const admins = store.getAdmins().filter(a => a.id !== id);
    setItem('guc_admins_list_v1', admins);
    try {
      fetch(`${MYSQL_SERVER_URL}/admins/${id}`, { method: 'DELETE' }).catch(e => {});
    } catch (e) {}
    return admins;
  },

  // Enquiries CRUD
  getEnquiries() {
    return getItem(KEYS.ENQUIRIES, initialEnquiries);
  },
  addEnquiry(newEnq) {
    const enquiries = store.getEnquiries();
    const entry = {
      id: 'enq-' + Date.now().toString().slice(-6),
      studentName: newEnq.studentName || 'Student',
      parentName: newEnq.parentName || 'Parent',
      mobile: newEnq.mobile || '',
      email: newEnq.email || '',
      classLevel: newEnq.classLevel || 'Not Specified',
      courseId: newEnq.courseId || '',
      courseTitle: newEnq.courseTitle || 'General Enquiry',
      branchId: newEnq.branchId || '',
      branchName: newEnq.branchName || 'All Branches',
      message: newEnq.message || '',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: []
    };
    const updated = [entry, ...enquiries];
    setItem(KEYS.ENQUIRIES, updated);

    // Physically Sync to MySQL Workbench
    try {
      fetch(`${MYSQL_SERVER_URL}/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      }).catch(e => {});
    } catch (e) {}

    return entry;
  },

  updateEnquiryStatus(id, newStatus) {
    const enquiries = store.getEnquiries();
    const updated = enquiries.map((item) => {
      if (item.id === id) {
        return { ...item, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return item;
    });
    setItem(KEYS.ENQUIRIES, updated);

    try {
      fetch(`${MYSQL_SERVER_URL}/enquiry/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      }).catch(e => {});
    } catch (e) {}

    return updated;
  },

  addEnquiryNote(id, noteText) {
    const enquiries = store.getEnquiries();
    const updated = enquiries.map((item) => {
      if (item.id === id) {
        const notes = item.notes || [];
        return {
          ...item,
          updatedAt: new Date().toISOString(),
          notes: [...notes, { timestamp: new Date().toISOString(), text: noteText }]
        };
      }
      return item;
    });
    setItem(KEYS.ENQUIRIES, updated);

    try {
      fetch(`${MYSQL_SERVER_URL}/enquiry/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, noteText })
      }).catch(e => {});
    } catch (e) {}

    return updated;
  },

  deleteEnquiry(id) {
    const enquiries = store.getEnquiries();
    const updated = enquiries.filter((item) => item.id !== id);
    setItem(KEYS.ENQUIRIES, updated);

    try {
      fetch(`${MYSQL_SERVER_URL}/enquiry/${id}`, {
        method: 'DELETE'
      }).catch(e => {});
    } catch (e) {}

    return updated;
  },

  // CMS
  getBranches() { return getItem(KEYS.BRANCHES, initialBranches); },
  saveBranch(branch) {
    const branches = store.getBranches();
    
    let facilitiesArr = [];
    if (Array.isArray(branch.facilities)) {
      facilitiesArr = branch.facilities;
    } else if (typeof branch.facilities === 'string' && branch.facilities) {
      facilitiesArr = branch.facilities.split(',').map(f => f.trim());
    } else {
      facilitiesArr = ['Air-Conditioned Classrooms', 'Smart Boards', 'Library & Study Hall'];
    }

    const formatted = {
      id: branch.id || ('br-' + Date.now().toString().slice(-4)),
      name: branch.name,
      area: branch.area,
      address: branch.address,
      phone: branch.phone,
      email: branch.email || '',
      timings: branch.timings || 'Mon - Sat: 7:00 AM - 8:30 PM',
      map_link: branch.map_link || branch.mapLink || 'https://maps.google.com',
      mapLink: branch.map_link || branch.mapLink || 'https://maps.google.com',
      image_url: branch.image_url || branch.image || 'https://images.unsplash.com/photo-1562774053-701939374585',
      image: branch.image_url || branch.image || 'https://images.unsplash.com/photo-1562774053-701939374585',
      facilities: facilitiesArr,
      status: branch.status || 'ACTIVE'
    };

    let updated;
    if (branch.id) {
      updated = branches.map(b => b.id === branch.id ? { ...b, ...formatted } : b);
    } else {
      updated = [formatted, ...branches];
    }
    setItem(KEYS.BRANCHES, updated);

    try {
      fetch(`${MYSQL_SERVER_URL}/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatted)
      }).catch(e => {});
    } catch (e) {}

    return updated;
  },
  deleteBranch(id) {
    setItem(KEYS.BRANCHES, store.getBranches().filter(b => b.id !== id));
    try {
      fetch(`${MYSQL_SERVER_URL}/branches/${id}`, { method: 'DELETE' }).catch(e => {});
    } catch (e) {}
  },

  getCourses() { return getItem(KEYS.COURSES, initialCourses); },
  saveCourse(course) {
    const courses = store.getCourses();
    let updated;
    if (course.id) {
      updated = courses.map(c => c.id === course.id ? course : c);
    } else {
      course.id = 'crs-' + Date.now().toString().slice(-4);
      course.status = 'ACTIVE';
      updated = [course, ...courses];
    }
    setItem(KEYS.COURSES, updated);
    try {
      fetch(`${MYSQL_SERVER_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      }).catch(e => {});
    } catch (e) {}
  },
  deleteCourse(id) {
    setItem(KEYS.COURSES, store.getCourses().filter(c => c.id !== id));
    try {
      fetch(`${MYSQL_SERVER_URL}/courses/${id}`, { method: 'DELETE' }).catch(e => {});
    } catch (e) {}
  },

  getTeachers() { return getItem(KEYS.TEACHERS, initialTeachers); },
  saveTeacher(teacher) {
    const teachers = store.getTeachers();
    let updated;
    if (teacher.id) {
      updated = teachers.map(t => t.id === teacher.id ? teacher : t);
    } else {
      teacher.id = 'tch-' + Date.now().toString().slice(-4);
      teacher.status = 'ACTIVE';
      updated = [teacher, ...teachers];
    }
    setItem(KEYS.TEACHERS, updated);
    try {
      fetch(`${MYSQL_SERVER_URL}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher)
      }).catch(e => {});
    } catch (e) {}
  },
  deleteTeacher(id) {
    setItem(KEYS.TEACHERS, store.getTeachers().filter(t => t.id !== id));
    try {
      fetch(`${MYSQL_SERVER_URL}/teachers/${id}`, { method: 'DELETE' }).catch(e => {});
    } catch (e) {}
  },

  getAchievements() { return getItem(KEYS.ACHIEVEMENTS, initialAchievements); },
  saveAchievement(achievement) {
    const items = store.getAchievements();
    let updated;
    if (achievement.id) {
      updated = items.map(a => a.id === achievement.id ? achievement : a);
    } else {
      achievement.id = 'ach-' + Date.now().toString().slice(-4);
      updated = [achievement, ...items];
    }
    setItem(KEYS.ACHIEVEMENTS, updated);
    try {
      fetch(`${MYSQL_SERVER_URL}/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievement)
      }).catch(e => {});
    } catch (e) {}
  },

  getGallery() { return getItem(KEYS.GALLERY, initialGallery); },
  saveGalleryItem(item) {
    const items = store.getGallery();
    let updated;
    if (item.id) {
      updated = items.map(g => g.id === item.id ? item : g);
    } else {
      item.id = 'gal-' + Date.now().toString().slice(-4);
      updated = [item, ...items];
    }
    setItem(KEYS.GALLERY, updated);
    try {
      fetch(`${MYSQL_SERVER_URL}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      }).catch(e => {});
    } catch (e) {}
  },

  getFounders() { return getItem(KEYS.FOUNDERS, initialFounders); },
  getTestimonials() { return getItem(KEYS.TESTIMONIALS, initialTestimonials); }
};

store.init();
