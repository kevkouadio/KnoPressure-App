import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import { Modal, Button } from "react-bootstrap";
import "./navstyle.css";


function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleConfirmLogout = () => {
    logout();
    setShowModal(false);
  };

  if (isLoggedIn) {
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/home">
              KnoPressure
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link
                    to="/home"
                    className={
                      location.pathname === "/home" ? "nav-link active" : "nav-link"
                    }
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/Chart"
                    className={
                      location.pathname === "/Chart" ? "nav-link active" : "nav-link"
                    }
                  >
                    Chart
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/tips"
                    className={
                      location.pathname === "/tips" ? "nav-link active" : "nav-link"
                    }
                  >
                    Tips
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/about"
                    className={
                      location.pathname === "/about" ? "nav-link active" : "nav-link"
                    }
                  >
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn nav-link"
                    onClick={handleShowModal}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Logout Confirmation Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to log out?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmLogout}>
              Logout
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  return null;
}

export default Navbar;
