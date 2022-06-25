import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useLoggedInUser } from "../../contex/contex_custom_hooks.js";
import axios from "axios";

const Navbar = () => {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();
  const onLogoutClick = async () => {
    try {
      await axios.post(
        "https://sh-bank-app.herokuapp.com/api/users/logout",
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
        <NavLink to="/api" className="nav-item">
          API
        </NavLink>
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
