import React from 'react';
import Hero from '../sections/Hero';
import LoanCategories from '../sections/LoanCategories';
import WhyChooseGSF from '../sections/WhyChooseGSF';
import StudyDestinations from '../sections/StudyDestinations';
import LoanProcess from '../sections/LoanProcess';
import Testimonials from '../sections/Testimonials';
import CallbackForm from '../sections/CallbackForm';
import WhatsAppSection from '../sections/WhatsAppSection';

const Home = ({ onOpenModal }) => {
  return (
    <main>
      <Hero onOpenModal={onOpenModal} />
      <LoanCategories />
      <WhyChooseGSF />
      <StudyDestinations />
      <LoanProcess />
      <Testimonials />
      <CallbackForm />
      <WhatsAppSection />
    </main>
  );
};

export default Home;
