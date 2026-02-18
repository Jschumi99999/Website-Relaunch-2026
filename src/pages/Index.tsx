import { Suspense, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import GlobalScene from "@/components/GlobalScene";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Fade out 3D scene in the last 25% of the page (CTA area)
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.3, 0.45], [1, 1, 0]);

  return (
    <>
      {/* Fixed 3D backdrop — fades out near CTA */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: sceneOpacity,
          zIndex: 0,
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      >
        <Suspense fallback={null}>
          <GlobalScene />
        </Suspense>
      </motion.div>

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px bg-accent/40 origin-left"
        style={{ scaleX, zIndex: 50 }}
      />

      {/* Content layer */}
      <main className="relative overflow-x-hidden" style={{ zIndex: 1 }}>
        <Hero />
        <About />
        <Services />
        <Process />
        <CTA />
        <Footer />
      </main>
    </>
  );
};

export default Index;
