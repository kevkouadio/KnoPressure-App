import React, { useState, useEffect, useCallback } from "react";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import { Form, Input } from "../../components/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../components/Sipnner";
import GoogleButton from "../../components/GoogleButton";
import googleAuthStartUrl from "../../utils/googleAuthUrl";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, login, googleLogin } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const notify = () => toast.error("Incorrect email and/or password!", {
    position: "top-center",
    autoClose: 6000,
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
        toast.error("Error during Google login", {
          position: "top-center",
          autoClose: 6000,
        });
      } finally {
        setLoading(false);
      }
    },
    [googleLogin, history]
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
    setLoading(true);
    try {
      await login(email, password);
      history.push("/home");
    } catch (err) {
      notify(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    window.location.href = googleAuthStartUrl();
  };

  if (isLoggedIn) {
    return <Redirect to="/home" />;
  }

  return (
    <div className="auth-page">
    <div className="card login-sign-Card">
      <h1>Login</h1>
      <br />
      {isLoading && <Spinner />}
      <Form onSubmit={handleFormSubmit}>
        <div>
          <label>Email:</label>
          <Input
            id="email"
            labelText="Email"
            placeholder="name@email.com"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <div className="input-with-toggle">
            <Input
              id="password"
              labelText="Password"
              placeholder="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
        <ToastContainer />
      </Form>
      <div className="divider">
        <span>OR</span>
      </div>
      <GoogleButton onClick={handleGoogleClick} />
      <br />
      <Link className="login-sign-link" to="/forgotPassword"> Forgot Password</Link>
      <br />
      Don&apos;t have an account? <Link className="login-sign-link" to="/signup">Sign up</Link>
    </div>
    </div>
  );
}

export default Login;
