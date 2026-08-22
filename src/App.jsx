import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import EligibilityModal from './components/EligibilityModal';
import BranchSelectionModal from './components/BranchSelectionModal';

import Home from './pages/Home';
import About from './pages/About';
import EducationLoans from './pages/EducationLoans';
import StudyDestinations from './pages/StudyDestinations';
import LoanOptions from './pages/LoanOptions';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import CountryLoanPage from './pages/CountryLoanPage';
import AdminLogin from './pages/AdminLogin';

// Student Panel Components
import StudentLogin from './pages/student/StudentLogin';
import StudentDashboard from './pages/student/StudentDashboard';

import './styles/global.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isStudentRoute = location.pathname.startsWith('/student');

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Auto-display lead capture popup once per session when visitor opens homepage
  React.useEffect(() => {
    if (isHome) {
      const hasShown = sessionStorage.getItem('gsfLeadPopupShown');
      if (!hasShown) {
        const timer = setTimeout(() => {
          setIsModalOpen(true);
          sessionStorage.setItem('gsfLeadPopupShown', 'true');
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [isHome]);

  if (isStudentRoute) {
    return (
      <Routes>
        <Route path="/student" element={<Navigate to="/student/login" replace />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Navbar
        onOpenModal={() => setIsModalOpen(true)}
        onOpenBranchModal={() => setIsBranchModalOpen(true)}
      />

      <main className={isHome ? 'main-content home-layout' : 'main-content internal-layout'}>
        <Routes>
          <Route path="/" element={<Home onOpenModal={() => setIsModalOpen(true)} onOpenBranchModal={() => setIsBranchModalOpen(true)} />} />
          <Route path="/about" element={<About onOpenModal={() => setIsModalOpen(true)} onOpenBranchModal={() => setIsBranchModalOpen(true)} />} />
          <Route path="/education-loans" element={<EducationLoans onOpenModal={() => setIsModalOpen(true)} onOpenBranchModal={() => setIsBranchModalOpen(true)} />} />
          <Route path="/study-destinations" element={<StudyDestinations onOpenModal={() => setIsModalOpen(true)} onOpenBranchModal={() => setIsBranchModalOpen(true)} />} />
          <Route path="/country/:countryId" element={<CountryLoanPage onOpenModal={() => setIsModalOpen(true)} onOpenBranchModal={() => setIsBranchModalOpen(true)} />} />
          <Route path="/loan-options" element={<LoanOptions onOpenModal={() => setIsModalOpen(true)} onOpenBranchModal={() => setIsBranchModalOpen(true)} />} />
          <Route path="/resources" element={<Resources onOpenModal={() => setIsModalOpen(true)} onOpenBranchModal={() => setIsBranchModalOpen(true)} />} />
          <Route path="/contact" element={<Contact onOpenModal={() => setIsModalOpen(true)} onOpenBranchModal={() => setIsBranchModalOpen(true)} />} />
          <Route path="/admin" element={<AdminLogin />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppButton />
      <EligibilityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <BranchSelectionModal isOpen={isBranchModalOpen} onClose={() => setIsBranchModalOpen(false)} />
    </div>
  );
}

export default App;
