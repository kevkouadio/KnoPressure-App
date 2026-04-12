import React from "react";
import "./style.css";

function Footer() {
  return (
    <footer className="footer">
      <span>&copy; {new Date().getFullYear()} KnoPressure</span>
    </footer>
  );
}

export default Footer;
