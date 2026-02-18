import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  parallaxOffset?: number;
  scaleRange?: [number, number];
  opacityRange?: [number, number];
}

const ScrollSection = ({
  children,
  className = "",
  parallaxOffset = 80,
  scaleRange = [0.92, 1],
  opacityRange = [0.3, 1],
}: ScrollSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.5], [parallaxOffset, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], scaleRange);
  const opacity = useTransform(scrollYProgress, [0, 0.35], opacityRange);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, scale, opacity }}>
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollSection;
