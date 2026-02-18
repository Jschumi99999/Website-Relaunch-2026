import { motion } from "framer-motion";
import { ShoppingBag, Megaphone, Code, Palette } from "lucide-react";

const services = [
  { icon: ShoppingBag, title: "E-Commerce", description: "Maßgeschneiderte Shopify-Shops, die deine Marke authentisch widerspiegeln und Kunden begeistern." },
  { icon: Megaphone, title: "Marketing", description: "Strategische Kampagnen, die deine Zielgruppe erreichen und nachhaltiges Wachstum ermöglichen." },
  { icon: Code, title: "Entwicklung", description: "Technisch exzellente Lösungen mit modernen Technologien für optimale Performance." },
  { icon: Palette, title: "Design", description: "Visuelle Identitäten, die im Gedächtnis bleiben und deine Markengeschichte erzählen." },
];

const Services = () => {
  return (
    <div className="relative min-h-screen py-20 sm:py-32 md:py-40 px-6 sm:px-8 md:px-16 lg:px-24 flex items-center">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground/60 mb-4 font-display">Was wir bieten</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-foreground font-display">Unsere Leistungen</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {services.map((service) => (
            <motion.div
              key={service.title}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group p-6 sm:p-8 rounded-sm border border-foreground/[0.06] bg-foreground/[0.03] backdrop-blur-sm hover:bg-foreground/[0.06] transition-colors duration-700 cursor-default"
            >
              <service.icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent/70 mb-4 sm:mb-5 group-hover:text-accent transition-colors duration-500" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 font-display text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
