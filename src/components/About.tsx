import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const labelY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div ref={ref} className="relative min-h-screen py-20 sm:py-32 md:py-40 px-6 sm:px-8 md:px-16 lg:px-24 flex items-center">
      <div className="mx-auto max-w-4xl">
        <motion.div style={{ y: labelY }}>
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground/60 mb-4 font-display">Dein Ansprechpartner für</p>
        </motion.div>
        <motion.div style={{ y: textY }}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8 sm:mb-10 font-display text-foreground leading-[1.1]">
            E-COMMERCE.<br />MARKETING.<br />SHOPIFY.
          </h2>
          <div className="max-w-2xl space-y-5">
            <p className="text-muted-foreground/80 leading-relaxed text-sm sm:text-base lg:text-lg">
              Bei upward Solution verbinden wir Design, Technologie und Markenidentität, um Onlineshops zu kreieren, die weit mehr tun als nur Produkte zu verkaufen – sie erzählen eine Geschichte.
            </p>
            <p className="text-muted-foreground/80 leading-relaxed text-sm sm:text-base lg:text-lg">
              Unser Ansatz geht über standardisierte Lösungen hinaus, indem wir Shops erschaffen, die ein einzigartiges Erlebnis bieten und deine Kunden nachhaltig begeistern.
            </p>
            <div className="pt-4 flex items-center gap-4">
              <div className="h-px w-12 bg-accent/40" />
              <p className="text-xs sm:text-sm tracking-[0.15em] uppercase text-accent/70 font-display">Julian Schumacher · Gründer</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
