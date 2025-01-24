import { motion } from "framer-motion"

const PageSlide = ({ children }) => {
  return (
    <motion.div
      className="page"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.5 }}
      style={{
        position: "absolute", // 페이지가 절대적으로 위치하도록 설정
        top: "0",
        left: "0",
        width: "100%", // 페이지가 전체 화면을 차지하게 설정
        height: "100%", // 페이지가 전체 화면을 차지하게 설정
      }}
    >
      {children}
    </motion.div>
  )
}

export default PageSlide
