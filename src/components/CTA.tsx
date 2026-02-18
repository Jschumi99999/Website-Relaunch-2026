import { useState } from "react";
import { motion } from "framer-motion";
import ContactDialog from "./ContactDialog";
import ScrollReveal from "./ScrollReveal";

const CTA = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative py-24 sm:py-36 md:py-48 px-6 sm:px-8 md:px-16 lg:px-24">
      <div className="mx-auto max-w-3xl text-center">
        <ScrollReveal distance={50}>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 font-display text-foreground leading-[1.1]">
            Bereit für deinen
            <br />
            nächsten Schritt?
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="text-muted-foreground/60 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Lass uns gemeinsam eine E-Commerce-Plattform schaffen, die deine
            Marke auf das nächste Level hebt.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.35}>
          <motion.button
            onClick={() => setOpen(true)}
            className="inline-block border border-foreground/20 px-8 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm tracking-[0.2em] uppercase font-display text-foreground hover:bg-foreground hover:text-background transition-all duration-700"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Kontakt aufnehmen
          </motion.button>
        </ScrollReveal>
      </div>
      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default CTA;
