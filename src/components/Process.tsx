import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const steps = [
  { number: "01", title: "Analyse", description: "Wir verstehen deine Marke, deine Ziele und deine Zielgruppe." },
  { number: "02", title: "Konzept", description: "Wir entwickeln eine maßgeschneiderte Strategie für deinen Erfolg." },
  { number: "03", title: "Umsetzung", description: "Design und Entwicklung deines individuellen Onlineshops." },
  { number: "04", title: "Launch", description: "Go-Live mit kontinuierlicher Optimierung und Support." },
];

const Process = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineWidth = useTransform(scrollYProgress, [0.15, 0.7], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative min-h-screen py-20 sm:py-32 md:py-40 px-6 sm:px-8 md:px-16 lg:px-24 flex items-center">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 sm:mb-16">
          <ScrollReveal>
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground/60 mb-4 font-display">Wie wir arbeiten</p>
          </ScrollReveal>
          <ScrollReveal delay={0.15} distance={50}>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-foreground font-display">Unser Prozess</h2>
          </ScrollReveal>
        </div>
        <div className="hidden lg:block relative mb-8">
          <div className="w-full h-px bg-foreground/[0.06]" />
          <motion.div className="absolute top-0 left-0 h-px bg-accent/30" style={{ width: lineWidth }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={0.1 + i * 0.15} distance={35}>
              <div className="relative">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground/[0.08] font-display block">{step.number}</span>
                <h3 className="text-base sm:text-lg font-semibold mt-1 mb-2 font-display text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground/70 leading-relaxed">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Process;
