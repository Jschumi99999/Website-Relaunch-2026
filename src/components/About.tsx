import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import julianImg from "@/assets/julian.jpeg";

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div ref={ref} className="relative min-h-screen py-20 sm:py-32 md:py-40 px-6 sm:px-8 md:px-16 lg:px-24 flex items-center">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div style={{ y: imgY }}>
            <img src={julianImg} alt="Julian Schumacher" className="w-full max-w-sm mx-auto lg:mx-0 grayscale hover:grayscale-0 transition-all duration-1000" />
          </motion.div>
          <motion.div style={{ y: textY }}>
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground/60 mb-4 font-display">Dein Ansprechpartner für</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 sm:mb-8 font-display text-foreground leading-[1.15]">E-COMMERCE.<br />MARKETING.<br />SHOPIFY.</h2>
            <p className="text-muted-foreground/80 leading-relaxed text-sm sm:text-base lg:text-lg">Bei upward Solution verbinden wir Design, Technologie und Markenidentität, um Onlineshops zu kreieren, die weit mehr tun als nur Produkte zu verkaufen – sie erzählen eine Geschichte.</p>
            <p className="text-muted-foreground/80 leading-relaxed text-sm sm:text-base lg:text-lg mt-4">Unser Ansatz geht über standardisierte Lösungen hinaus, indem wir Shops erschaffen, die ein einzigartiges Erlebnis bieten und deine Kunden nachhaltig begeistern.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
