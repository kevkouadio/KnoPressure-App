import React from "react";
import CardList from "../../components/CardList";
import Navbar from "../../components/Navbar";
import Container from "../../components/Container";
import Footer from "../../components/Footer";
import "./style.css";

function Tips() {
  return (
    <>
      <Navbar />
      <Container className="tips-page">
        <div className="tips-emergency" role="alert">
          <strong>Emergency:</strong> If your blood pressure is 180/120 or higher and you
          have symptoms such as chest pain or shortness of breath, call 911 immediately.
        </div>
        <h2 className="tips-page-title">Heart-healthy tips</h2>
        <p className="tips-page-lead">
          Evidence-based habits that support healthy blood pressure. Tap a card to learn
          more.
        </p>
        <div className="row tips-card-row">
          <CardList />
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default Tips;
