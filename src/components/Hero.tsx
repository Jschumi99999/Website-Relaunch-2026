import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef, Suspense } from "react";
import { HeroScene } from "./HeroScene";

const words = ["CREATE.", "DESIGN.", "DEVELOP."];

const Hero = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

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
          setTimeout(() => { setCurrentWord((w) => w + 1); setCurrentChar(0); }, 200);
        } else {
          setCurrentChar((c) => c + 1);
        }
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentWord, currentChar]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden" style={{ height: "calc(var(--vh, 1vh) * 100)" }}>
      <motion.div className="absolute inset-0" style={{ scale: sceneScale, opacity: sceneOpacity }}>
        <div className="absolute inset-0 bg-[#282624]" />
        <Suspense fallback={null}><HeroScene /></Suspense>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#282624]/80" style={{ zIndex: 2 }} />

      <motion.div
        className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-8 md:px-16 lg:px-24"
        style={{ y: textY, opacity: textOpacity, paddingTop: "calc(env(safe-area-inset-top) + 2rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
      >
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-4 text-xs sm:text-sm tracking-[0.3em] uppercase text-primary-foreground/70 font-display">
          upward Solution
        </motion.p>
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-primary-foreground font-display min-h-[3.6em]">
          {words.map((word, i) => (
            <span key={word} className="block">
              {displayedLines[i] || ""}
              {currentWord === i && !isComplete && (
                <span className="inline-block w-[2px] sm:w-[3px] h-[0.85em] bg-primary-foreground/80 ml-1 animate-pulse align-baseline" />
              )}
            </span>
          ))}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isComplete ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 2rem)", zIndex: 10 }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="h-12 sm:h-16 w-px bg-primary-foreground/40" />
      </motion.div>
    </section>
  );
};

export default Hero;
