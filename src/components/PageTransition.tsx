import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 18, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -12, scale: 0.98 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

export default PageTransition;
