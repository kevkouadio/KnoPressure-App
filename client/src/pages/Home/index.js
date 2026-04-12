import React from "react";
import { motion } from "framer-motion";
import Container from "../../components/Container";
import BPImage from "../../components/BPImage";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../utils/auth";
import SearchForm from "../../components/SearchForm";
import Row from "../../components/Row";
import Table from "../../components/Table";
import "./homestyle.css";

const easeOut = [0.22, 1, 0.36, 1];

function Home() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Container className="home-page">
        <motion.header
          className="home-hero"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          <div className="home-hero-text">
            <span className="home-eyebrow">Your dashboard</span>
            <h1 className="home-title">Welcome back, {user.username}</h1>
            <p className="home-sub">
              Log today&apos;s numbers, check your averages, and review your history, all
              in one place.
            </p>
          </div>
        </motion.header>

        <div className="home-bp-row">
          <Row className="home-bp-panels-row">
            <SearchForm />
            <BPImage />
          </Row>
        </div>

        <section
          className="home-readings"
          aria-labelledby="home-readings-title"
        >
          <div className="home-readings-header">
            <h2 id="home-readings-title" className="home-section-title">
              Reading history
            </h2>
            <p className="home-section-lead">
              View, edit, or delete entries. Export to Excel when you need a copy.
            </p>
          </div>
          <div className="home-table-shell">
            <Table />
          </div>
        </section>
      </Container>
      <Footer />
    </>
  );
}

export default Home;
