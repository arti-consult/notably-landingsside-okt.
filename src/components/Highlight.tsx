import { cn } from "../utils/cn";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.span
      ref={ref}
      initial={{
        backgroundSize: "0% 100%",
      }}
      animate={{
        backgroundSize: isInView ? "100% 100%" : "0% 100%",
      }}
      transition={{
        duration: 2,
        ease: "linear",
        delay: 0.3,
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        `relative inline-block pb-0.5 px-0.5 rounded-lg bg-gradient-to-r from-blue-200 to-blue-300`,
        className
      )}
    >
      {children}
    </motion.span>
  );
};
