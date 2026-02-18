import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, Suspense } from "react";
import { ShoppingBag, Megaphone, Code, Palette } from "lucide-react";
import { ServicesScene } from "./HeroScene";

const services = [
  { icon: ShoppingBag, title: "E-Commerce", description: "Maßgeschneiderte Shopify-Shops, die deine Marke authentisch widerspiegeln und Kunden begeistern." },
  { icon: Megaphone, title: "Marketing", description: "Strategische Kampagnen, die deine Zielgruppe erreichen und nachhaltiges Wachstum ermöglichen." },
  { icon: Code, title: "Entwicklung", description: "Technisch exzellente Lösungen mit modernen Technologien für optimale Performance." },
  { icon: Palette, title: "Design", description: "Visuelle Identitäten, die im Gedächtnis bleiben und deine Markengeschichte erzählen." },
];

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 md:py-32 px-6 sm:px-8 md:px-16 lg:px-24 bg-card overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={null}><ServicesScene /></Suspense>

      <motion.div className="absolute inset-0 opacity-30" style={{ y: bgY, background: "radial-gradient(ellipse at 70% 50%, hsl(25 30% 50% / 0.15) 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-7xl" style={{ zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-display">Was wir bieten</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-foreground font-display">Unsere Leistungen</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.12, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
              className="group p-6 sm:p-8 lg:p-10 border border-border rounded-sm bg-background/80 backdrop-blur-sm hover:bg-secondary/50 transition-colors duration-500 cursor-default"
              style={{ perspective: 800 }}
            >
              <motion.div whileHover={{ rotateY: 10, scale: 1.2 }} transition={{ duration: 0.3 }}>
                <service.icon className="h-6 w-6 sm:h-8 sm:w-8 text-accent mb-4 sm:mb-6 transition-transform duration-300" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-display text-foreground">{service.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
