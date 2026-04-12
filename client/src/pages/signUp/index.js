import React, { useState, useEffect, useCallback } from "react";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
import API from "../../utils/API";
import { useAuth } from "../../utils/auth";
import { Form, Input } from "../../components/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/Sipnner";
import GoogleButton from "../../components/GoogleButton";
import googleAuthStartUrl from "../../utils/googleAuthUrl";

function Signup() {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { isLoggedIn, googleLogin } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [isLoading, setLoading] = useState(false);

  const notifyError = (message) => toast.error(message, {
    position: "top-center",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const notifySuccess = () => toast.success("Congratulations! Your account has been created. Please log in and start using our service. Thank you for choosing our platform. 😊", {
    position: "top-center",
    autoClose: 7000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const handleGoogleLogin = useCallback(
    async (token) => {
      setLoading(true);
      try {
        await googleLogin(token);
        history.push("/home");
      } catch (err) {
        notifyError("Error during Google login");
      } finally {
        setLoading(false);
      }
    },
    [googleLogin, history, notifyError]
  );

  // Handle Google authentication callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      handleGoogleLogin(token);
    }
  }, [location, handleGoogleLogin]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (formState.password !== formState.confirmPassword) {
      return notifyError("Passwords do not match!");
    }
    setLoading(true);
    try {
      await API.signUpUser(formState.username, formState.email, formState.password);
      notifySuccess();
      setTimeout(() => history.replace("/login"), 7500);
    } catch (err) {
      notifyError("ERROR!!! Invalid input field or account already exists!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    window.location.href = googleAuthStartUrl();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  if (isLoggedIn) {
    return <Redirect to="/home" />;
  }

  return (
    <div className="auth-page">
    <div className="card login-sign-Card">
      <h1>Signup</h1>
      <br />
      {isLoading && <Spinner />}
      <Form onSubmit={handleFormSubmit}>
        <div>
          <label>Name:</label>
          <Input
            id="username"
            labelText="Username"
            placeholder="Your name"
            name="username"
            type="text"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <Input
            id="email"
            labelText="Email"
            placeholder="name@email.com"
            name="email"
            type="email"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <Input
            id="pwd"
            labelText="Password"
            placeholder="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPwd">Confirm Password:</label>
          <div className="input-with-toggle">
            <Input
              id="confirmPwd"
              labelText="Confirm Password"
              placeholder="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
        <ToastContainer />
      </Form>
      <div className="divider">
        <span>OR</span>
      </div>
      <GoogleButton onClick={handleGoogleClick} label="Sign up with Google" />
      <br />
      Already have an account? <Link className="login-sign-link" to="/login">Login</Link>
    </div>
    </div>
  );
}

export default Signup;
