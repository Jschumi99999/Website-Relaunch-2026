import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  { number: "01", title: "Analyse", description: "Wir verstehen deine Marke, deine Ziele und deine Zielgruppe." },
  { number: "02", title: "Konzept", description: "Wir entwickeln eine maßgeschneiderte Strategie für deinen Erfolg." },
  { number: "03", title: "Umsetzung", description: "Design und Entwicklung deines individuellen Onlineshops." },
  { number: "04", title: "Launch", description: "Go-Live mit kontinuierlicher Optimierung und Support." },
];

const Process = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const progressLine = useTransform(scrollYProgress, [0.1, 0.7], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24 bg-background overflow-hidden">
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

        {/* Progress line on desktop */}
        <div className="hidden lg:block relative mb-4">
          <div className="absolute top-0 left-0 w-full h-px bg-border" />
          <motion.div
            className="absolute top-0 left-0 h-px bg-accent"
            style={{ width: progressLine }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative pt-8"
            >
              <motion.span
                className="text-7xl font-bold text-border font-display block"
                whileInView={{
                  color: ["hsl(30 8% 88%)", "hsl(25 30% 50%)", "hsl(30 8% 88%)"],
                }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
              >
                {step.number}
              </motion.span>
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
