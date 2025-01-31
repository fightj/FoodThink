import { motion } from "framer-motion";

const PageSlide = ({ children }) => {
  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30, duration: 0.8 },
        opacity: { duration: 0.5 }
      }}
      style={{
        position: "relative", // fixed 대신 relative
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
        paddingBottom: "60px", // 네비게이션 바 공간 확보
      }}
    >
      {children}
    </motion.div>
  );
};


export default PageSlide;
