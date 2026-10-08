import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickContactBar from './components/QuickContactBar';
import OTPModal from './components/OTPModal';
import EnquiryModal from './components/EnquiryModal';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import BranchesPage from './pages/BranchesPage';
import TeachersPage from './pages/TeachersPage';
import AchievementsPage from './pages/AchievementsPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import { store } from './services/store';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  // Check customer session on initial load
  useEffect(() => {
    store.init();
    const session = store.getCustomerSession();
    // Mandatory initial visitor access gate
    if (!session) {
      setIsOTPModalOpen(true);
    }
  }, []);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiryWithCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedBranchId(null);
    setIsEnquiryModalOpen(true);
  };

  const handleOpenEnquiryWithBranch = (branchId) => {
    setSelectedBranchId(branchId);
    setSelectedCourseId(null);
    setIsEnquiryModalOpen(true);
  };

  const handleOpenGeneralEnquiry = () => {
    setSelectedCourseId(null);
    setSelectedBranchId(null);
    setIsEnquiryModalOpen(true);
  };

  // IF ADMIN PANEL IS OPEN -> Render dedicated full standalone Admin Page!
  if (isAdminPanelOpen) {
    return (
      <AdminDashboard onClose={() => setIsAdminPanelOpen(false)} />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Main Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenOTP={() => setIsOTPModalOpen(true)}
        onOpenEnquiry={handleOpenGeneralEnquiry}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
      />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {activeSection === 'home' && (
          <HomePage
            onOpenEnquiry={handleOpenGeneralEnquiry}
            onNavigate={handleNavigate}
            onSelectCourse={handleOpenEnquiryWithCourse}
            onSelectBranch={handleOpenEnquiryWithBranch}
          />
        )}

        {activeSection === 'courses' && (
          <CoursesPage
            onOpenEnquiry={handleOpenGeneralEnquiry}
            onSelectCourse={handleOpenEnquiryWithCourse}
          />
        )}

        {activeSection === 'branches' && (
          <BranchesPage onSelectBranch={handleOpenEnquiryWithBranch} />
        )}

        {activeSection === 'teachers' && (
          <TeachersPage onOpenEnquiry={handleOpenGeneralEnquiry} />
        )}

        {activeSection === 'achievements' && (
          <AchievementsPage onOpenEnquiry={handleOpenGeneralEnquiry} />
        )}

        {activeSection === 'gallery' && (
          <GalleryPage />
        )}

        {activeSection === 'contact' && (
          <ContactPage onOpenEnquiry={handleOpenGeneralEnquiry} />
        )}

        {activeSection === 'about' && (
          <AboutPage onOpenEnquiry={handleOpenGeneralEnquiry} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenEnquiry={handleOpenGeneralEnquiry}
      />

      {/* Mobile Floating Action Bar */}
      <QuickContactBar onOpenEnquiry={handleOpenGeneralEnquiry} />

      {/* Mandatory Visitor Access Gate Modal */}
      <OTPModal
        isOpen={isOTPModalOpen}
        isMandatory={!store.getCustomerSession()}
        onClose={() => setIsOTPModalOpen(false)}
        onVerified={(session) => {
          setIsOTPModalOpen(false);
        }}
      />

      {/* Interactive Admission Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        initialCourseId={selectedCourseId}
        initialBranchId={selectedBranchId}
      />
    </div>
  );
}
