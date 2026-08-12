import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import EligibilityModal from './components/EligibilityModal';

import Home from './pages/Home';
import About from './pages/About';
import EducationLoans from './pages/EducationLoans';
import StudyDestinations from './pages/StudyDestinations';
import LoanOptions from './pages/LoanOptions';
import Resources from './pages/Resources';
import Contact from './pages/Contact';

import './styles/global.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      <main className={isHome ? 'main-content home-layout' : 'main-content internal-layout'}>
        <Routes>
          <Route path="/" element={<Home onOpenModal={() => setIsModalOpen(true)} />} />
          <Route path="/about" element={<About onOpenModal={() => setIsModalOpen(true)} />} />
          <Route path="/education-loans" element={<EducationLoans onOpenModal={() => setIsModalOpen(true)} />} />
          <Route path="/study-destinations" element={<StudyDestinations onOpenModal={() => setIsModalOpen(true)} />} />
          <Route path="/loan-options" element={<LoanOptions onOpenModal={() => setIsModalOpen(true)} />} />
          <Route path="/resources" element={<Resources onOpenModal={() => setIsModalOpen(true)} />} />
          <Route path="/contact" element={<Contact onOpenModal={() => setIsModalOpen(true)} />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppButton />
      <EligibilityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
