import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const words = ["CREATE.", "DESIGN.", "DEVELOP."];

const Hero = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentWord >= words.length) {
      setIsComplete(true);
      return;
    }

    const word = words[currentWord];

    if (currentChar <= word.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentWord] = word.slice(0, currentChar);
          return updated;
        });

        if (currentChar === word.length) {
          setTimeout(() => {
            setCurrentWord((w) => w + 1);
            setCurrentChar(0);
          }, 200);
        } else {
          setCurrentChar((c) => c + 1);
        }
      }, 80);

      return () => clearTimeout(timeout);
    }
  }, [currentWord, currentChar]);

  return (
    <section
  className="relative w-full overflow-hidden"
  style={{ height: "calc(var(--vh, 1vh) * 100)" }}
>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/30" />

      {/* Content */}
      <div
  className="relative z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24"
  style={{
    height: "calc(var(--vh, 1vh) * 100)",
    paddingTop: "calc(env(safe-area-inset-top) + 2rem)",
    paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)",
  }}
>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-sm tracking-[0.3em] uppercase text-primary-foreground/70 font-display"
        >
          upward Solution
        </motion.p>

        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-primary-foreground font-display min-h-[3.6em]">
          {words.map((word, i) => (
            <span key={word} className="block">
              {displayedLines[i] || ""}
              {currentWord === i && !isComplete && (
                <span className="inline-block w-[3px] h-[0.85em] bg-primary-foreground/80 ml-1 animate-pulse align-baseline" />
              )}
            </span>
          ))}
        </h1>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isComplete ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 2rem)",
        }}
      >
        <div className="h-16 w-px bg-primary-foreground/40 animate-pulse" />
      </motion.div>
    </section>
  );
};

export default Hero;
