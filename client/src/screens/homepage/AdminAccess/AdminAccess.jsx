import { useState } from "react";
import "./AdminAccess.css";
import axios from "axios";
import { useLoggedInUser } from "../../../contex/contex_custom_hooks";

const AdminAccess = () => {
  const [info, setInfo] = useState("");
  const [action, setAction] = useState("");
  const [error, setError] = useState("");
  const { loggedInUser } = useLoggedInUser();

  const onGetAllUserClick = async () => {
    try {
      if (!loggedInUser) throw new Error("Must log in");
      const { data } = await axios.get(
        "https://sh-bank-app.herokuapp.com/api/users",
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setInfo(data);
    } catch (e) {
      setError(e.response?.data || e.message);
    }
  };

  const onGetAllAccountsClick = async () => {
    try {
      const { data } = await axios.get(
        "https://sh-bank-app.herokuapp.com/api/accounts",
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setInfo(data);
    } catch (e) {
      setError(e.response.data);
    }
  };
  return (
    <>
      <h2>Admin Access</h2>
      <p>email: itamarshmaya@gmail.com</p>
      <p>password: 123456</p>
      <hr />
      <div className="wrapper">
        <div className="menu">
          <div onClick={() => setAction("getAllUsers")}>get all users</div>
          <div onClick={() => setAction("getAllAccounts")}>
            get all accounts
          </div>
        </div>
        <div className="action">
          {action === "getAllUsers" && (
            <button onClick={onGetAllUserClick}>Get All Users</button>
          )}
          {action === "getAllAccounts" && (
            <button onClick={onGetAllAccountsClick}>Get All Accounts</button>
          )}
        </div>
        <div className="user-info">
          <div className="code-container">
            <pre>
              <code>{JSON.stringify(info, null, 1)}</code>
            </pre>
          </div>
          {error && <div>{error}</div>}
        </div>
      </div>
    </>
  );
};
export default AdminAccess;
