import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const words = ["CREATE.", "DESIGN.", "DEVELOP."];

const Hero = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
    <div
      ref={sectionRef}
      className="relative w-full flex flex-col justify-center px-6 sm:px-8 md:px-16 lg:px-24"
      style={{ height: "100vh", minHeight: "100svh" }}
    >
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="max-w-5xl"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground/60 font-display"
        >
          upward Solution
        </motion.p>

        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight text-primary font-display leading-[1.1]">
          {words.map((word, i) => (
            <span key={word} className="block">
              {displayedLines[i] || ""}
              {currentWord === i && !isComplete && (
                <span className="inline-block w-[2px] sm:w-[3px] h-[0.8em] bg-primary/50 ml-1 animate-pulse align-baseline" />
              )}
            </span>
          ))}
        </h1>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isComplete ? { opacity: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 sm:h-14 w-px bg-foreground/20"
        />
      </motion.div>
    </div>
  );
};

export default Hero;
