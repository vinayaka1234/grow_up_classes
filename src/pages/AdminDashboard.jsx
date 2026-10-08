import React, { useState, useEffect } from 'react';
import { store } from '../services/store';
import {
  LayoutDashboard, Users, Building2, BookOpen, Award, Image as ImageIcon,
  CheckCircle2, Clock, Phone, Mail, Search, Filter, Plus, Trash2, Edit,
  LogOut, Lock, Download, MessageSquare, ChevronRight, X, AlertCircle, RefreshCw
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
  const [modalType, setModalType] = useState(null); // 'ADD_BRANCH' | 'ADD_COURSE' | 'ADD_TEACHER' | 'ADD_ACHIEVEMENT' | 'ADD_GALLERY'
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
    const headers = ['Enquiry ID', 'Student Name', 'Parent Name', 'Mobile', 'Email', 'Class', 'Course', 'Branch', 'Status', 'Created At'];
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
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        color: '#FFFFFF'
      }}>
        <div 
          className="glass-card" 
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '2.5rem',
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            position: 'relative',
            color: '#0F172A'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B'
            }}
            title="Return to Public Website"
          >
            <X size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
              borderRadius: '16px',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
              boxShadow: '0 8px 16px rgba(15,23,42,0.2)'
            }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A' }}>
              Grow Up Classes Admin
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>
              Dedicated Administrator Portal
            </p>
          </div>

          {loginError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '1rem' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                Username
              </label>
              <input
                type="text"
                placeholder="admin"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: '600' }}
                required
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                required
              />
            </div>

            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E', padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.78rem', marginBottom: '1.25rem', fontWeight: '600' }}>
              🔑 Default Credentials: Username: <code>admin</code> | Password: <code>admin123</code>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
              Login to Admin Portal <ChevronRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                ← Return to Public Website
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Top Navbar */}
      <header style={{
        background: '#0F172A',
        color: '#FFFFFF',
        height: '70px',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', background: '#2563EB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.01em' }}>
              Grow Up Classes <span style={{ color: '#60A5FA', fontSize: '0.8rem', fontWeight: '700' }}>[ADMIN PANEL]</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            Back to Website
          </button>

          <button onClick={handleAdminLogout} style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Sidebar Navigation */}
        <aside style={{
          width: '240px',
          background: '#1E293B',
          color: '#CBD5E1',
          padding: '1.5rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          borderRight: '1px solid #334155'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'enquiries', label: `Lead Enquiries (${totalLeads})`, icon: Users, badge: newLeads > 0 ? `${newLeads} NEW` : null },
            { id: 'branches', label: 'Branches CMS', icon: Building2 },
            { id: 'courses', label: 'Courses CMS', icon: BookOpen },
            { id: 'teachers', label: 'Teachers CMS', icon: Users },
            { id: 'achievements', label: 'Achievements CMS', icon: Award },
            { id: 'gallery', label: 'Gallery CMS', icon: ImageIcon }
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: active ? '#2563EB' : 'transparent',
                  color: active ? '#FFFFFF' : '#94A3B8',
                  fontWeight: active ? '700' : '600',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{ background: '#EF4444', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: '800', padding: '0.15rem 0.4rem', borderRadius: '9999px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Workspace Content Area */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>Executive Lead Dashboard</h1>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Real-time business summary of customer enquiries across Bengaluru branches.</p>
                </div>
                <button onClick={() => setActiveTab('enquiries')} className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
                  Manage All Leads ({totalLeads})
                </button>
              </div>

              {/* Metrics Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Total Enquiries</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0F172A', marginTop: '0.25rem' }}>{totalLeads}</div>
                  <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: '600' }}>Customer Leads Stored</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2563EB', textTransform: 'uppercase' }}>New Leads</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#2563EB', marginTop: '0.25rem' }}>{newLeads}</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>Requires Immediate Contact</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#D97706', textTransform: 'uppercase' }}>Follow-ups Pending</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#D97706', marginTop: '0.25rem' }}>{followUpLeads}</div>
                  <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: '600' }}>Active Pipeline</div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#059669', textTransform: 'uppercase' }}>Converted Admissions</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#059669', marginTop: '0.25rem' }}>{convertedLeads}</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>Enrolled Students</div>
                </div>
              </div>

              {/* Branch Wise Lead Breakdown */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginBottom: '1rem' }}>
                  Branch-wise Lead Breakdown
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {branches.map((b) => {
                    const count = enquiries.filter(e => e.branchId === b.id).length;
                    return (
                      <div key={b.id} style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A' }}>{b.name}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2563EB', marginTop: '0.25rem' }}>{count} Leads</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Enquiries Preview */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>Recent Incoming Enquiries</h3>
                  <button onClick={() => setActiveTab('enquiries')} style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                    View All →
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', color: '#475569', textAlign: 'left', borderBottom: '1px solid #E2E8F0' }}>
                        <th style={{ padding: '0.75rem' }}>Ref ID</th>
                        <th style={{ padding: '0.75rem' }}>Student & Parent</th>
                        <th style={{ padding: '0.75rem' }}>Mobile</th>
                        <th style={{ padding: '0.75rem' }}>Course & Branch</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.slice(0, 5).map((e) => (
                        <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '0.75rem', fontWeight: '700', color: '#2563EB' }}>#{e.id}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ fontWeight: '700', color: '#0F172A' }}>{e.studentName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>P: {e.parentName}</div>
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: '600' }}>+91 {e.mobile}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ fontWeight: '600' }}>{e.courseTitle}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{e.branchName}</div>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.25rem 0.6rem',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
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
                              <div style={{ fontWeight: '600' }}>{e.classLevel}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{e.courseTitle}</div>
                            </td>
                            <td style={{ padding: '0.85rem', fontWeight: '600' }}>{e.branchName}</td>
                            <td style={{ padding: '0.85rem' }}>
                              <select
                                value={e.status}
                                onChange={(evt) => handleUpdateStatus(e.id, evt.target.value)}
                                style={{
                                  padding: '0.35rem 0.6rem',
                                  borderRadius: '8px',
                                  fontSize: '0.75rem',
                                  fontWeight: '800',
                                  border: '1px solid #CBD5E1',
                                  background: e.status === 'NEW' ? '#EFF6FF' : e.status === 'CONVERTED' ? '#ECFDF5' : '#FEF3C7',
                                  color: e.status === 'NEW' ? '#1E40AF' : e.status === 'CONVERTED' ? '#065F46' : '#92400E',
                                  cursor: 'pointer'
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
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => setSelectedEnquiry(e)}
                                  style={{ background: '#EFF6FF', color: '#2563EB', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}
                                >
                                  Notes & Details
                                </button>
                                <button
                                  onClick={() => handleDeleteEnquiry(e.id)}
                                  style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                                  title="Delete Lead"
                                >
                                  <Trash2 size={14} />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>Branches CMS</h1>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Add or edit Bengaluru branch locations.</p>
                </div>
                <button
                  onClick={() => { setModalType('ADD_BRANCH'); setFormData({ name: '', area: '', address: '', phone: '', email: '', timings: 'Mon - Sat: 7:00 AM - 8:30 PM', mapLink: 'https://maps.google.com', image: 'https://images.unsplash.com/photo-1562774053-701939374585' }); }}
                  className="btn-emerald"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add New Branch
                </button>
              </div>

              <div className="grid-responsive-3">
                {branches.map((b) => (
                  <div key={b.id} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A' }}>{b.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: '700', marginBottom: '0.5rem' }}>{b.area}</div>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.75rem' }}>{b.address}</p>
                    <div style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: '600' }}>📞 {b.phone}</div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this branch?')) {
                            store.deleteBranch(b.id);
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
                  onClick={() => { setModalType('ADD_TEACHER'); setFormData({ name: '', qualification: '', subject: '', experience: '10+ Years', bio: '', rating: '5.0 ★', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' }); }}
                  className="btn-emerald"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add Teacher Profile
                </button>
              </div>

              <div className="grid-responsive-3">
                {teachers.map((t) => (
                  <div key={t.id} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A' }}>{t.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: '700' }}>{t.qualification}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>{t.subject}</div>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete teacher profile?')) {
                          store.deleteTeacher(t.id);
                          loadAllData();
                        }
                      }}
                      style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '0.45rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.5rem' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ACHIEVEMENTS CMS */}
          {activeTab === 'achievements' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>Achievements & Toppers CMS</h1>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Add board results and toppers.</p>
                </div>
                <button
                  onClick={() => { setModalType('ADD_ACHIEVEMENT'); setFormData({ title: '', statistic: '625/625', studentName: '', year: '2025', description: '', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644' }); }}
                  className="btn-emerald"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add Achievement Record
                </button>
              </div>

              <div className="grid-responsive-3">
                {achievements.map((a) => (
                  <div key={a.id} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>{a.statistic}</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A' }}>{a.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: '700' }}>{a.studentName} ({a.year})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GALLERY CMS */}
          {activeTab === 'gallery' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>Gallery CMS</h1>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Add photos to gallery.</p>
                </div>
              </div>

              <div className="grid-responsive-3">
                {gallery.map((g) => (
                  <div key={g.id} style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <img src={g.image} alt={g.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', marginTop: '0.5rem' }}>{g.title}</div>
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

      {/* CMS ADD MODALS */}
      {modalType === 'ADD_BRANCH' && (
        <div className="modal-overlay">
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', background: '#FFFFFF', padding: '2rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>Add New Bengaluru Branch</h2>
            <form onSubmit={handleSaveCMSBranch} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="text" placeholder="Branch Name (e.g. Whitefield Branch)" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="text" placeholder="Area (e.g. Whitefield)" value={formData.area || ''} onChange={(e) => setFormData({...formData, area: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="text" placeholder="Full Address" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="text" placeholder="Phone Number" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>Save Branch</button>
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>Add Teacher Profile</h2>
            <form onSubmit={handleSaveCMSTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="text" placeholder="Faculty Name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="text" placeholder="Qualification" value={formData.qualification || ''} onChange={(e) => setFormData({...formData, qualification: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="text" placeholder="Subject" value={formData.subject || ''} onChange={(e) => setFormData({...formData, subject: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>Save Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === 'ADD_ACHIEVEMENT' && (
        <div className="modal-overlay">
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', background: '#FFFFFF', padding: '2rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>Add Achievement Record</h2>
            <form onSubmit={handleSaveCMSAchievement} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="text" placeholder="Title (e.g. SSLC State Rank)" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="text" placeholder="Statistic (e.g. 625/625)" value={formData.statistic || ''} onChange={(e) => setFormData({...formData, statistic: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <input type="text" placeholder="Student Name" value={formData.studentName || ''} onChange={(e) => setFormData({...formData, studentName: e.target.value})} required style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalType(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
