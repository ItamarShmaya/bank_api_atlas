import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useLoggedInUser } from "../../contex/contex_custom_hooks.js";
import axios from "axios";

const Navbar = () => {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();
  const onLogoutClick = async () => {
    try {
      await axios.post(
        "https://bank-api-j30a.onrender.com/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setLoggedInUser(null);
      localStorage.removeItem("loggedInUser");
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <nav>
      <div className="right">
        <NavLink to="/" className="nav-item">
          Home
        </NavLink>
        <a href="https://bank-api-j30a.onrender.com/api" className="nav-item">
          API
        </a>
      </div>
      {!loggedInUser && (
        <>
          <NavLink to="/login" className="nav-item">
            Login
          </NavLink>
          <NavLink to="/register" className="nav-item">
            Register
          </NavLink>
        </>
      )}
      {loggedInUser && (
        <NavLink to="/" className="nav-item" onClick={onLogoutClick}>
          Logout
        </NavLink>
      )}
    </nav>
  );
};
export default Navbar;
