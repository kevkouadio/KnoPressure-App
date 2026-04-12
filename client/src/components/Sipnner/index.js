import React from "react";
import "./style.css";

function Spinner({ label = "Loading…" }) {
  return (
    <div
      className="spinner-root"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="spinner__track" aria-hidden="true">
        <div className="spinner__ring" />
        <div className="spinner__ring spinner__ring--delayed" />
      </div>
      <span className="spinner__sr-only">{label}</span>
    </div>
  );
}

export default Spinner;
