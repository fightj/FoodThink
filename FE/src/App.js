import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import BottomNav from "./components/BottomNav";

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <Routes>
          <Route path="/" element={<h1>홈페이지</h1>} />
          <Route path="/category" element={<h1>카테고리 페이지</h1>} />
          <Route path="/sns" element={<h1>SNS 페이지</h1>} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

const styles = {
  container: {
    paddingBottom: "50px", // BottomNav 높이만큼 여백 추가
  },
};

export default App;
