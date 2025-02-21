import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/base/SearchBar.css";

function Logo({ imageSrc = "/images/메인로고.png" }) {
  const navigate = useNavigate();

  return (
    <div className="header-all" onClick={() => navigate("/")}>
      <img src={imageSrc} className="main-logo" alt="Logo" />
    </div>
  );
}

export default Logo;
