import { motion } from "framer-motion";
import julianImg from "@/assets/julian.jpeg";

const About = () => {
  return (
    <section className="py-24 md:py-32 px-8 md:px-16 lg:px-24 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={julianImg}
              alt="Julian Schumacher"
              className="w-full max-w-md mx-auto lg:mx-0 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-display">
              Dein Ansprechpartner für
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8 font-display text-foreground">
              E-COMMERCE.
              <br />
              MARKETING.
              <br />
              SHOPIFY.
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Bei upward Solution verbinden wir Design, Technologie und
              Markenidentität, um Onlineshops zu kreieren, die weit mehr tun als
              nur Produkte zu verkaufen – sie erzählen eine Geschichte.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg mt-4">
              Unser Ansatz geht über standardisierte Lösungen hinaus, indem wir
              Shops erschaffen, die ein einzigartiges Erlebnis bieten und deine
              Kunden nachhaltig begeistern.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
