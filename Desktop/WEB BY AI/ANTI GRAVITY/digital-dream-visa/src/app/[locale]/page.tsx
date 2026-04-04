import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import VisaTabs from '@/components/VisaTabs';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import FindUs from '@/components/FindUs';
import ConsultationForm from '@/components/ConsultationForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <VisaTabs />
        <HowItWorks />
        <Testimonials />
        <FindUs />
        <ConsultationForm />
      </main>
      <Footer />
    </>
  );
}
