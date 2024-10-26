import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Resumes: React.FC = () => {
  const location = useLocation();

  return (
    <div className="container mx-auto p-4">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Resumes;
