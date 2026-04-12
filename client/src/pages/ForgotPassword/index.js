import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../../components/Form';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Sipnner";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setLoading] = useState(false);

    const notify = () => toast.success("Reset password link sent!", {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            const response = await axios.post('/requestPasswordReset', { email });
            setMessage(response.data);
            notify();
        } catch (error) {
            setMessage(error.response?.data || "An error occurred");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="auth-page">
        <div className="card login-sign-Card">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <br/>
                    <label className="form-label">Email</label>
                    <Input
                        id="email"
                        labelText="Email"
                        placeholder="name@email.com"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Request Reset Link'}
                </button>
                <ToastContainer />
            </form>
            <p className="forgot-password-login-link">
                <Link to="/login" className="login-sign-link">
                    Go to login
                </Link>
            </p>
            {isLoading && <Spinner/>} {/* Display Spinner while loading */}
            {message && <p className="auth-feedback">{message}</p>}
        </div>
        </div>
    );
};

export default ForgotPassword;
