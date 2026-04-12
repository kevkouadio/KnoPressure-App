import decode from "jwt-decode";
import axios from "axios";

export default class AuthService {
  login = async (email, password, username) => {
    try {
      const res = await axios.post("/api/login", { email, password, username });
      this.setToken(res.data.token);
      return res;
    } catch (error) {
      throw error;
    }
  };

  googleLogin = async (token) => {
    try {
      this.setToken(token);
      return true;
    } catch (error) {
      throw error;
    }
  };

  getProfile = () => {
    try {
      return decode(this.getToken());
    } catch (error) {
      throw error;
    }
  };

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }

  setToken(idToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;
    localStorage.setItem("id_token", idToken);
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  logout() {
    axios.defaults.headers.common.Authorization = null;
    localStorage.removeItem("id_token");
    window.location.reload("/");
  }
}
