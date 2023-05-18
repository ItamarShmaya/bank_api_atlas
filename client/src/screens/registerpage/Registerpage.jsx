import { useState } from "react";
import axios from "axios";
import { useLoggedInUser } from "../../contex/contex_custom_hooks";
import { useNavigate } from "react-router-dom";
import "../loginpage/Loginpage.css";

const Registerpage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setLoggedInUser } = useLoggedInUser();
  const navigate = useNavigate();

  const onRegisterSubmit = async (e) => {
    e.preventDefault();
    const body = {
      firstName,
      lastName,
      email,
      password,
    };
    try {
      const response = await axios.post(
        "https://bank-api-j30a.onrender.com/api/users/register",
        body
      );
      setLoggedInUser({
        ...response.data.user,
        token: response.data.token,
      });
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
      <form onSubmit={onRegisterSubmit}>
        <input
          type="text"
          placeholder="First Name"
          name="firstName"
          value={firstName}
          onChange={({ target }) => setFirstName(target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={lastName}
          onChange={({ target }) => setLastName(target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};
export default Registerpage;
