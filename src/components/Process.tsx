import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Analyse", description: "Wir verstehen deine Marke, deine Ziele und deine Zielgruppe." },
  { number: "02", title: "Konzept", description: "Wir entwickeln eine maßgeschneiderte Strategie für deinen Erfolg." },
  { number: "03", title: "Umsetzung", description: "Design und Entwicklung deines individuellen Onlineshops." },
  { number: "04", title: "Launch", description: "Go-Live mit kontinuierlicher Optimierung und Support." },
];

const Process = () => {
  return (
    <section className="py-24 md:py-32 px-8 md:px-16 lg:px-24 bg-background">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-display">
            Wie wir arbeiten
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-display">
            Unser Prozess
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <span className="text-7xl font-bold text-border font-display">
                {step.number}
              </span>
              <h3 className="text-xl font-semibold mt-2 mb-2 font-display text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
