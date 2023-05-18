import { useState } from "react";
import axios from "axios";
import "./Loginpage.css";
import { useNavigate } from "react-router-dom";
import { useLoggedInUser } from "../../contex/contex_custom_hooks.js";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLoggedInUser } = useLoggedInUser();
  const [error, setError] = useState("");

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email,
      password,
    };
    try {
      const response = await axios.post(
        "https://bank-api-j30a.onrender.com/api/users/login",
        body
      );
      setLoggedInUser({ ...response.data.user, token: response.data.token });
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          ...response.data.user,
          token: response.data.token,
        })
      );

      navigate("../");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="formWrapper">
      <form onSubmit={onLoginSubmit}>
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};
export default Loginpage;
