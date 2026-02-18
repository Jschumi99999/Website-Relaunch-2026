import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ContactDialog from "./ContactDialog";

const CTA = () => {
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24 bg-primary text-primary-foreground overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-primary"
        style={{ scale: bgScale }}
      />

      {/* Animated glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(25 30% 50% / 0.1) 0%, transparent 60%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div style={{ y: textY }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 font-display">
              Bereit für deinen
              <br />
              nächsten Schritt?
            </h2>
            <p className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Lass uns gemeinsam eine E-Commerce-Plattform schaffen, die deine
              Marke auf das nächste Level hebt.
            </p>
            <motion.button
              onClick={() => setOpen(true)}
              className="inline-block border border-primary-foreground/40 px-10 py-4 text-sm tracking-[0.2em] uppercase font-display hover:bg-primary-foreground hover:text-primary transition-all duration-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Kontakt aufnehmen
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
};

export default CTA;
