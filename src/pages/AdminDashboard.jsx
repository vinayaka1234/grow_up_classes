import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import {
  LayoutDashboard, Users, Building2, BookOpen, Award, Image as ImageIcon,
  CheckCircle2, Clock, Phone, Mail, Search, Filter, Plus, Trash2, Edit,
  LogOut, Lock, Download, MessageSquare, ChevronRight, X, AlertCircle, RefreshCw,
  ExternalLink, MapPin
} from 'lucide-react';

export default function AdminDashboard({ onClose }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'enquiries' | 'branches' | 'courses' | 'teachers' | 'achievements' | 'gallery'

  // Data State
  const [enquiries, setEnquiries] = useState([]);
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Filters & Search for Enquiries
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  
  // Selected Lead Drawer / Note State
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [noteText, setNoteText] = useState('');

  // CMS Add Modals State
  const [modalType, setModalType] = useState(null); // 'ADD_BRANCH' | 'EDIT_BRANCH' | 'ADD_COURSE' | 'ADD_TEACHER' | 'ADD_ACHIEVEMENT' | 'ADD_GALLERY'
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const status = store.isAdminLoggedIn();
    setIsAdminLoggedIn(status);
    if (status) {
      loadAllData();
    }
  }, []);

  const loadAllData = () => {
    setEnquiries(store.getEnquiries());
    setBranches(store.getBranches());
    setCourses(store.getCourses());
    setTeachers(store.getTeachers());
    setAchievements(store.getAchievements());
    setGallery(store.getGallery());
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      store.setAdminAuth(true);
      setIsAdminLoggedIn(true);
      loadAllData();
    } else {
      setLoginError('Invalid username or password. (Use demo credentials: admin / admin123)');
    }
  };

  const handleAdminLogout = () => {
    store.setAdminAuth(false);
    setIsAdminLoggedIn(false);
  };

  // Status Change Handlers
  const handleUpdateStatus = (id, newStatus) => {
    const updated = store.updateEnquiryStatus(id, newStatus);
    setEnquiries(updated);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedEnquiry) return;
    const updated = store.addEnquiryNote(selectedEnquiry.id, noteText);
    setEnquiries(updated);
    const updatedLead = updated.find(item => item.id === selectedEnquiry.id);
    setSelectedEnquiry(updatedLead);
    setNoteText('');
  };

  const handleDeleteEnquiry = (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry lead?')) {
      const updated = store.deleteEnquiry(id);
      setEnquiries(updated);
      if (selectedEnquiry && selectedEnquiry.id === id) setSelectedEnquiry(null);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Enquiry ID', 'Student Name', 'Parent Name', 'Mobile', 'Email', 'Class Level', 'Course Interested', 'Branch', 'Status', 'Date Submitted'];
    const rows = enquiries.map(e => [
      e.id,
      `"${e.studentName}"`,
      `"${e.parentName}"`,
      e.mobile,
      e.email,
      `"${e.classLevel}"`,
      `"${e.courseTitle}"`,
      `"${e.branchName}"`,
      e.status,
      e.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `grow_up_classes_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CMS Handlers
  const handleSaveCMSBranch = (e) => {
    e.preventDefault();
    store.saveBranch(formData);
    loadAllData();
    setModalType(null);
    setFormData({});
  };

  const handleSaveCMSCourse = (e) => {
    e.preventDefault();
    store.saveCourse(formData);
    loadAllData();
    setModalType(null);
    setFormData({});
  };

  const handleSaveCMSTeacher = (e) => {
    e.preventDefault();
    store.saveTeacher(formData);
    loadAllData();
    setModalType(null);
    setFormData({});
  };

  const handleSaveCMSAchievement = (e) => {
    e.preventDefault();
    store.saveAchievement(formData);
    loadAllData();
    setModalType(null);
    setFormData({});
  };

  // Filtering Logic for Enquiries Table
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch = 
      e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.mobile.includes(searchQuery) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchesBranch = branchFilter === 'ALL' || e.branchId === branchFilter;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Calculate Metrics
  const totalLeads = enquiries.length;
  const newLeads = enquiries.filter(e => e.status === 'NEW').length;
  const followUpLeads = enquiries.filter(e => e.status === 'FOLLOW-UP').length;
  const convertedLeads = enquiries.filter(e => e.status === 'CONVERTED').length;

  if (!isAdminLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '2.5rem',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#EFF6FF',
              color: '#2563EB',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Lock size={32} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A' }}>
              Admin Management Portal
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.35rem' }}>
              Log in to manage student leads, courses, and branch locations.
            </p>
          </div>

          {loginError && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '0.75rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Username / Email
              </label>
              <input
                type="text"
                placeholder="admin"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="admin123"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: '12px' }}
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.875rem', cursor: 'pointer', fontWeight: '600' }}
            >
              ← Back to Main Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <header style={{ background: '#0F172A', color: '#FFFFFF', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#2563EB', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
            <LayoutDashboard size={20} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>Grow Up Classes Admin</h2>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Live Control Panel & Database</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={loadAllData}
            style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid #334155', padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RefreshCw size={14} /> Refresh Data
          </button>
          <button
            onClick={onClose}
            style={{ background: '#334155', color: '#FFFFFF', border: 'none', padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Exit Admin View
          </button>
          <button
            onClick={handleAdminLogout}
            style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* Sidebar Navigation */}
        <aside style={{ width: '250px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '1.5rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
            Main Menu
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'dashboard' ? '#EFF6FF' : 'transparent',
                color: activeTab === 'dashboard' ? '#2563EB' : '#475569',
                fontWeight: activeTab === 'dashboard' ? '700' : '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem'
              }}
            >
              <LayoutDashboard size={18} /> Overview Dashboard
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'enquiries' ? '#EFF6FF' : 'transparent',
                color: activeTab === 'enquiries' ? '#2563EB' : '#475569',
                fontWeight: activeTab === 'enquiries' ? '700' : '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={18} /> Enquiries & Leads
              </div>
              {newLeads > 0 && (
                <span style={{ background: '#EF4444', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: '800', padding: '0.15rem 0.45rem', borderRadius: '9999px' }}>
                  {newLeads}
                </span>
              )}
            </button>

            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              Website CMS
            </div>

            <button
              onClick={() => setActiveTab('branches')}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'branches' ? '#EFF6FF' : 'transparent',
                color: activeTab === 'branches' ? '#2563EB' : '#475569',
                fontWeight: activeTab === 'branches' ? '700' : '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem'
              }}
            >
              <Building2 size={18} /> Branches CMS
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'courses' ? '#EFF6FF' : 'transparent',
                color: activeTab === 'courses' ? '#2563EB' : '#475569',
                fontWeight: activeTab === 'courses' ? '700' : '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem'
              }}
            >
              <BookOpen size={18} /> Courses CMS
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'teachers' ? '#EFF6FF' : 'transparent',
                color: activeTab === 'teachers' ? '#2563EB' : '#475569',
                fontWeight: activeTab === 'teachers' ? '700' : '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem'
              }}
            >
              <Users size={18} /> Faculty CMS
            </button>
          </nav>
        </aside>

        {/* Tab Views */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.25rem' }}>Overview Dashboard</h1>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Real-time summary of student enquiries, leads, and branch operations.</p>

              {/* Metric Cards */}
              <div className="grid-responsive-4" style={{ marginBottom: '2rem' }}>
                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>Total Enquiries</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0F172A' }}>{totalLeads}</div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>New Applications</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2563EB' }}>{newLeads}</div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ color: '#D97706', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>Follow-ups Active</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#D97706' }}>{followUpLeads}</div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>Converted Students</div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669' }}>{convertedLeads}</div>
                </div>
              </div>

              {/* Recent Enquiries Preview */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A' }}>Recent Enquiries</h3>
                  <button onClick={() => setActiveTab('enquiries')} style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                    View All →
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', color: '#475569', textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem' }}>Student Name</th>
                        <th style={{ padding: '0.75rem' }}>Mobile</th>
                        <th style={{ padding: '0.75rem' }}>Class / Course</th>
                        <th style={{ padding: '0.75rem' }}>Branch</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.slice(0, 5).map(e => (
                        <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.75rem', fontWeight: '700', color: '#0F172A' }}>{e.studentName}</td>
                          <td style={{ padding: '0.75rem', color: '#059669', fontWeight: '700' }}>+91 {e.mobile}</td>
                          <td style={{ padding: '0.75rem' }}>{e.courseTitle} ({e.classLevel})</td>
                          <td style={{ padding: '0.75rem' }}>{e.branchName}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.25rem 0.6rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              background: e.status === 'NEW' ? '#EFF6FF' : e.status === 'CONVERTED' ? '#ECFDF5' : '#FEF3C7',
                              color: e.status === 'NEW' ? '#1E40AF' : e.status === 'CONVERTED' ? '#065F46' : '#92400E'
                            }}>
                              {e.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ENQUIRY / LEAD MANAGEMENT */}
          {activeTab === 'enquiries' && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>Enquiry & Lead Management</h1>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Search, filter, update follow-up statuses, and manage customer leads.</p>
                </div>
                <button onClick={handleExportCSV} className="btn-emerald" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
                  <Download size={16} /> Export CSV Report
                </button>
              </div>

              {/* Search & Filters Bar */}
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    placeholder="Search by student, parent or mobile..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 0.85rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    <option value="ALL">Status: All Statuses</option>
                    <option value="NEW">Status: NEW</option>
                    <option value="CONTACTED">Status: CONTACTED</option>
                    <option value="FOLLOW-UP">Status: FOLLOW-UP</option>
                    <option value="CONVERTED">Status: CONVERTED</option>
                    <option value="NOT INTERESTED">Status: NOT INTERESTED</option>
                  </select>
                </div>

                <div>
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    <option value="ALL">Branch: All Bengaluru Branches</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', color: '#475569', textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '0.85rem' }}>Ref ID</th>
                        <th style={{ padding: '0.85rem' }}>Student & Parent</th>
                        <th style={{ padding: '0.85rem' }}>Contact Number</th>
                        <th style={{ padding: '0.85rem' }}>Class & Course</th>
                        <th style={{ padding: '0.85rem' }}>Branch Location</th>
                        <th style={{ padding: '0.85rem' }}>Lead Status</th>
                        <th style={{ padding: '0.85rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnquiries.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                            No enquiries found matching filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredEnquiries.map((e) => (
                          <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '0.85rem', fontWeight: '700', color: '#2563EB' }}>#{e.id}</td>
                            <td style={{ padding: '0.85rem' }}>
                              <div style={{ fontWeight: '700', color: '#0F172A' }}>{e.studentName}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Parent: {e.parentName}</div>
                            </td>
                            <td style={{ padding: '0.85rem', fontWeight: '700', color: '#059669' }}>
                              +91 {e.mobile}
                            </td>
                            <td style={{ padding: '0.85rem' }}>
                              <div style={{ fontWeight: '600' }}>{e.courseTitle}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{e.classLevel}</div>
                            </td>
                            <td style={{ padding: '0.85rem', fontWeight: '600', color: '#475569' }}>
                              {e.branchName}
                            </td>
                            <td style={{ padding: '0.85rem' }}>
                              <select
                                value={e.status}
                                onChange={(evt) => handleUpdateStatus(e.id, evt.target.value)}
                                style={{
                                  padding: '0.35rem 0.6rem',
                                  borderRadius: '8px',
                                  border: '1px solid #CBD5E1',
                                  fontSize: '0.78rem',
                                  fontWeight: '800',
                                  background: e.status === 'NEW' ? '#EFF6FF' : e.status === 'CONVERTED' ? '#ECFDF5' : '#FEF3C7',
                                  color: e.status === 'NEW' ? '#1E40AF' : e.status === 'CONVERTED' ? '#065F46' : '#92400E'
                                }}
                              >
                                <option value="NEW">NEW</option>
                                <option value="CONTACTED">CONTACTED</option>
                                <option value="FOLLOW-UP">FOLLOW-UP</option>
                                <option value="CONVERTED">CONVERTED</option>
                                <option value="NOT INTERESTED">NOT INTERESTED</option>
                              </select>
                            </td>
                            <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => setSelectedEnquiry(e)}
                                  className="btn-primary"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                >
                                  Details / Notes ({e.notes ? e.notes.length : 0})
                                </button>
                                <button
                                  onClick={() => handleDeleteEnquiry(e.id)}
                                  style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRANCHES CMS */}
          {activeTab === 'branches' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>Branches CMS Management</h1>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Add photos, addresses, map links, facilities, and contact details for campus locations.</p>
                </div>
                <button
                  onClick={() => {
                    setModalType('ADD_BRANCH');
                    setFormData({
                      name: '',
                      area: '',
                      address: '',
                      phone: '+91 ',
                      email: '',
                      timings: 'Mon - Sat: 7:00 AM - 8:30 PM',
                      facilities: 'AC Classrooms, Smart Boards, Science Lab, Library',
                      map_link: 'https://maps.google.com',
                      image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'
                    });
                  }}
                  className="btn-emerald"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add New Branch
                </button>
              </div>

              <div className="grid-responsive-3">
                {branches.map((b) => {
                  const img = b.image_url || b.image || 'https://images.unsplash.com/photo-1562774053-701939374585';
                  const mapUrl = b.map_link || b.mapLink || 'https://maps.google.com';
                  let facs = [];
                  if (Array.isArray(b.facilities)) facs = b.facilities;
                  else if (typeof b.facilities === 'string' && b.facilities) facs = b.facilities.split(',').map(f => f.trim());

                  return (
                    <div key={b.id} style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                          <img src={img} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <span className="badge-blue" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>{b.area}</span>
                        </div>

                        <div style={{ padding: '1.25rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.35rem' }}>{b.name}</h3>
                          <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                            <MapPin size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{b.address}</span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.35rem' }}>📞 {b.phone}</div>
                          {b.email && <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.5rem' }}>✉️ {b.email}</div>}
                          {b.timings && <div style={{ fontSize: '0.75rem', color: '#334155', background: '#F8FAFC', padding: '0.4rem 0.6rem', borderRadius: '8px', marginBottom: '0.75rem' }}>⏰ {b.timings}</div>}
                          
                          {facs.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
                              {facs.map((f, idx) => (
                                <span key={idx} style={{ background: '#ECFDF5', color: '#065F46', fontSize: '0.7rem', fontWeight: '700', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                                  ✓ {f}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setModalType('EDIT_BRANCH');
                            setFormData({
                              id: b.id,
                              name: b.name,
                              area: b.area,
                              address: b.address,
                              phone: b.phone,
                              email: b.email || '',
                              timings: b.timings || '',
                              facilities: Array.isArray(b.facilities) ? b.facilities.join(', ') : (b.facilities || ''),
                              map_link: b.map_link || b.mapLink || '',
                              image_url: b.image_url || b.image || ''
                            });
                          }}
                          style={{ flex: 1, background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                        >
                          <Edit size={14} /> Edit Branch
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete branch "${b.name}"?`)) {
                              store.deleteBranch(b.id);
                              loadAllData();
                            }
                          }}
                          style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: COURSES CMS */}
          {activeTab === 'courses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>Courses CMS</h1>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Add or edit academic courses.</p>
                </div>
                <button
                  onClick={() => { setModalType('ADD_COURSE'); setFormData({ title: '', category: 'Class 10', level: 'Class 10', description: '', duration: '1 Year', batchTimings: 'Evening', subjects: ['Maths', 'Science'], badge: 'Popular', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173' }); }}
                  className="btn-emerald"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add New Course
                </button>
              </div>

              <div className="grid-responsive-3">
                {courses.map((c) => (
                  <div key={c.id} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>{c.badge}</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A' }}>{c.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: '700', marginBottom: '0.5rem' }}>{c.level}</div>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.75rem' }}>{c.description}</p>
                    <div style={{ marginTop: '1rem' }}>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this course?')) {
                            store.deleteCourse(c.id);
                            loadAllData();
                          }
                        }}
                        style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TEACHERS CMS */}
          {activeTab === 'teachers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>Teachers CMS</h1>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage teacher profiles.</p>
                </div>
                <button
                  onClick={() => { setModalType('ADD_TEACHER'); setFormData({ name: '', qualification: 'M.Sc Physics (IISc)', subject: 'Physics & JEE', experience: '12+ Years', bio: 'Senior JEE Physics Faculty with 12+ years experience.', rating: '5.0 ★', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2' }); }}
                  className="btn-emerald"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add New Teacher Profile
                </button>
              </div>

              <div className="grid-responsive-3">
                {teachers.map((t) => (
                  <div key={t.id} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A' }}>{t.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: '700', marginBottom: '0.25rem' }}>{t.qualification}</div>
                    <div style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: '600', marginBottom: '0.5rem' }}>Subject: {t.subject}</div>
                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{t.bio}</p>
                    <div style={{ marginTop: '1rem' }}>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete teacher profile?')) {
                            store.deleteTeacher(t.id);
                            loadAllData();
                          }
                        }}
                        style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* LEAD DETAILS & NOTES DRAWER MODAL */}
      {selectedEnquiry && (
        <div className="modal-overlay">
          <div className="glass-card" style={{ maxWidth: '620px', width: '100%', background: '#FFFFFF', padding: '2rem', borderRadius: '24px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={() => setSelectedEnquiry(null)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <span className="badge-blue" style={{ marginBottom: '0.5rem' }}>Lead Ref #{selectedEnquiry.id}</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A' }}>{selectedEnquiry.studentName}</h2>
            <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.25rem' }}>Parent / Guardian: {selectedEnquiry.parentName}</div>

            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '1.25rem', fontSize: '0.88rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div><strong>Verified Mobile:</strong> +91 {selectedEnquiry.mobile}</div>
              <div><strong>Email:</strong> {selectedEnquiry.email || 'N/A'}</div>
              <div><strong>Class:</strong> {selectedEnquiry.classLevel}</div>
              <div><strong>Branch:</strong> {selectedEnquiry.branchName}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Interested Course:</strong> {selectedEnquiry.courseTitle}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Student Message:</strong> "{selectedEnquiry.message || 'No additional notes'}"</div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.35rem' }}>
                Update Lead Progress Status:
              </label>
              <select
                value={selectedEnquiry.status}
                onChange={(evt) => handleUpdateStatus(selectedEnquiry.id, evt.target.value)}
                style={{ padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontWeight: '700', fontSize: '0.85rem' }}
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="FOLLOW-UP">FOLLOW-UP</option>
                <option value="CONVERTED">CONVERTED</option>
                <option value="NOT INTERESTED">NOT INTERESTED</option>
              </select>
            </div>

            {/* Notes Section */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>
                Follow-up Notes & Admin History ({selectedEnquiry.notes ? selectedEnquiry.notes.length : 0})
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto', marginBottom: '1rem' }}>
                {(!selectedEnquiry.notes || selectedEnquiry.notes.length === 0) ? (
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>No internal notes added yet.</div>
                ) : (
                  selectedEnquiry.notes.map((n, idx) => (
                    <div key={idx} style={{ background: '#F1F5F9', padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '0.82rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '600' }}>{new Date(n.timestamp).toLocaleString()}</div>
                      <div style={{ color: '#0F172A', fontWeight: '600' }}>{n.text}</div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add a call note (e.g. Scheduled branch visit for Sat 10am)..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
                  Save Note
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CMS ADD / EDIT BRANCH MODAL */}
      {(modalType === 'ADD_BRANCH' || modalType === 'EDIT_BRANCH') && (
        <div className="modal-overlay">
          <div className="glass-card" style={{ maxWidth: '580px', width: '100%', background: '#FFFFFF', padding: '2rem', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.25rem', color: '#0F172A' }}>
              {modalType === 'EDIT_BRANCH' ? 'Edit Branch Location' : 'Add New Bengaluru Branch'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Fill in branch details, image photo, contact info, facilities, and Google Maps link.
            </p>

            <form onSubmit={handleSaveCMSBranch} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              
              {/* 1. Photo Image URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                  📷 Branch Image / Photo URL *
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/photo-1562774053-701939374585"
                  value={formData.image_url || formData.image || ''}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value, image: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              {/* 2. Branch Name & Area */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                    🏢 Branch Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Whitefield Academic Campus"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                    📍 Area / Locality *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Whitefield Main Road"
                    value={formData.area || ''}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* 3. Full Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                  📌 Full Street Address *
                </label>
                <textarea
                  placeholder="e.g. #54, ITPL Main Road, Whitefield, Bengaluru - 560066"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  rows={2}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              {/* 4. Phone & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                    📞 Phone Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98450 12345"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                    ✉️ Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. whitefield@growupclasses.in"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* 5. Timings & Facilities */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                    ⏰ Timings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mon - Sat: 7:00 AM - 8:30 PM"
                    value={formData.timings || ''}
                    onChange={(e) => setFormData({...formData, timings: e.target.value})}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                    🏫 Facilities (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AC Classrooms, Science Lab, Library, Smart Boards"
                    value={formData.facilities || ''}
                    onChange={(e) => setFormData({...formData, facilities: e.target.value})}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* 6. Google Maps Link */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '0.3rem' }}>
                  🗺️ Google Maps Location Link (Student Click Location) *
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://maps.google.com/?q=Whitefield+Bengaluru"
                  value={formData.map_link || formData.mapLink || ''}
                  onChange={(e) => setFormData({...formData, map_link: e.target.value, mapLink: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-emerald" style={{ flex: 1, padding: '0.75rem' }}>
                  Save Branch Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === 'ADD_COURSE' && (
        <div className="modal-overlay">
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', background: '#FFFFFF', padding: '2rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>Add New Course</h2>
            <form onSubmit={handleSaveCMSCourse} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="text" placeholder="Course Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="text" placeholder="Level (e.g. Class 10)" value={formData.level || ''} onChange={(e) => setFormData({...formData, level: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === 'ADD_TEACHER' && (
        <div className="modal-overlay">
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', background: '#FFFFFF', padding: '2rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>Add New Teacher Profile</h2>
            <form onSubmit={handleSaveCMSTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="text" placeholder="Teacher Full Name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="text" placeholder="Qualification (e.g. M.Sc Physics IISc)" value={formData.qualification || ''} onChange={(e) => setFormData({...formData, qualification: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="text" placeholder="Subject Taught" value={formData.subject || ''} onChange={(e) => setFormData({...formData, subject: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <textarea placeholder="Bio" value={formData.bio || ''} onChange={(e) => setFormData({...formData, bio: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>Save Teacher Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
