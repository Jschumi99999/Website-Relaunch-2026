import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <About />
      <Services />
      <Process />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
