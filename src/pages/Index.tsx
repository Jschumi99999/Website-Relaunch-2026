import { motion, useScroll, useSpring } from "framer-motion";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <main className="overflow-x-hidden">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-50"
        style={{ scaleX }}
      />
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
