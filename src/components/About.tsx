import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, Suspense } from "react";
import julianImg from "@/assets/julian.jpeg";
import { AboutScene } from "./HeroScene";

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 md:py-32 px-6 sm:px-8 md:px-16 lg:px-24 bg-background overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={null}><AboutScene /></Suspense>

      {/* Decorative line */}
      <motion.div className="absolute top-0 left-6 sm:left-8 md:left-16 lg:left-24 h-px bg-accent/30" style={{ width: lineWidth, zIndex: 2 }} />

      <div className="relative mx-auto max-w-7xl" style={{ zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center">
          <motion.div style={{ y: imgY }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ perspective: 1000 }}
            >
              <img src={julianImg} alt="Julian Schumacher" className="w-full max-w-sm sm:max-w-md mx-auto lg:mx-0 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" />
            </motion.div>
          </motion.div>

          <motion.div style={{ y: textY }}>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-display">
                Dein Ansprechpartner für
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 sm:mb-8 font-display text-foreground">
                <motion.span className="block" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>E-COMMERCE.</motion.span>
                <motion.span className="block" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.45 }}>MARKETING.</motion.span>
                <motion.span className="block" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }}>SHOPIFY.</motion.span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                Bei upward Solution verbinden wir Design, Technologie und Markenidentität, um Onlineshops zu kreieren, die weit mehr tun als nur Produkte zu verkaufen – sie erzählen eine Geschichte.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mt-4">
                Unser Ansatz geht über standardisierte Lösungen hinaus, indem wir Shops erschaffen, die ein einzigartiges Erlebnis bieten und deine Kunden nachhaltig begeistern.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
