import { useState } from "react";
import { motion } from "framer-motion";
import ContactDialog from "./ContactDialog";

const CTA = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-24 md:py-32 px-8 md:px-16 lg:px-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl text-center">
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
          <button
            onClick={() => setOpen(true)}
            className="inline-block border border-primary-foreground/40 px-10 py-4 text-sm tracking-[0.2em] uppercase font-display hover:bg-primary-foreground hover:text-primary transition-all duration-500"
          >
            Kontakt aufnehmen
          </button>
        </motion.div>
      </div>
      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
};

export default CTA;
