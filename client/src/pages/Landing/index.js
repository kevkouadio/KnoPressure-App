import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Container from "../../components/Container";
import Row from "../../components/Row";
import Col from "../../components/Col";
import Footer from "../../components/Footer";
import { publicUrl } from "../../utils/publicUrl";
import "./landingstyle.css";

const easeOut = [0.22, 1, 0.36, 1];

function Landing() {
  return (
    <div className="landing-root">
      <Container>
        <motion.header
          className="landing-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOut }}
        >
          <span className="landing-eyebrow">Heart health · Made simple</span>
          <h1 className="landing-title">
            <span className="landing-title-main">KnoPressure</span>
          </h1>
          <p className="landing-tagline">
            Track your blood pressure, spot trends early, and build habits that protect
            your heart without the overwhelm.
          </p>
          <div className="landing-hero-visual">
            <div className="landing-heart-ring" aria-hidden="true" />
            <img
              id="heart"
              src={publicUrl("/assets/images/heart-799138__340.webp")}
              alt="Illustration of a heart"
              className="landing-heart-img img-fluid"
            />
          </div>
        </motion.header>

        <ul className="landing-features" aria-label="What you can do">
          <li className="landing-feature">
            <span className="landing-feature-icon" aria-hidden="true">
              ◎
            </span>
            <span className="landing-feature-text">
              <strong>Log readings</strong>
              <span>Quick systolic &amp; diastolic entry</span>
            </span>
          </li>
          <li className="landing-feature">
            <span className="landing-feature-icon" aria-hidden="true">
              〰
            </span>
            <span className="landing-feature-text">
              <strong>See trends</strong>
              <span>Charts &amp; averages over time</span>
            </span>
          </li>
          <li className="landing-feature">
            <span className="landing-feature-icon" aria-hidden="true">
              ✦
            </span>
            <span className="landing-feature-text">
              <strong>Learn &amp; improve</strong>
              <span>Tips grounded in real guidance</span>
            </span>
          </li>
        </ul>

        <Row>
          <Col size="12" className="landing-story-col">
            <motion.article
              className="landing-story"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: easeOut }}
            >
              <p className="landing-lead">
                Hypertension is still called the &quot;silent killer&quot; for a reason. You
                can feel fine today and still be at risk. The good news: you can lower
                that risk with awareness and steady habits.
              </p>
              <p>
                When blood pressure stays high, it strains your vessels, heart, brain,
                kidneys, and eyes. Over time that raises the chance of heart disease,
                stroke, and other serious problems. Tracking your numbers and making
                small, consistent changes can make a real difference.
              </p>
              <p className="landing-highlight">
                Heart health starts with knowing your numbers.
              </p>
            </motion.article>
          </Col>
        </Row>

        <Row>
          <Col size="lg-12">
            <div className="landing-pulse-wrap">
              <div className="landing-pulse-frame">
                <img
                  src="https://i.pinimg.com/originals/b3/70/5c/b3705cc2edf8f527789e6e2be29f6267.gif"
                  width="220"
                  height="220"
                  alt=""
                  className="landing-gif"
                />
              </div>
              <p className="landing-pulse-caption">Every beat counts. Stay in rhythm.</p>
            </div>

            <motion.div
              className="landing-cta"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
            >
              <div className="landing-cta-inner">
                <h2 className="landing-cta-title">Start tracking today</h2>
                <p className="landing-cta-sub">
                  Already a member? Sign in. New here? Create a free account in minutes.
                </p>
                <ul className="landing-actions">
                  <li>
                    <Link to="/login" className="btn btn-primary landing-btn landing-btn--primary">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="btn landing-btn landing-btn--outline">
                      Create account
                    </Link>
                  </li>
                </ul>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Landing;
