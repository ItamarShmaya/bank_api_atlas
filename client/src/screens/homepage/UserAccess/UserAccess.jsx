import { useState } from "react";
import "./UserAccess.css";
import Withdraw from "./Withdraw/Withdraw";
import Deposite from "./Deposite/Deposite";
import Transfer from "./Transfer/Transfer";
import { useLoggedInUser } from "../../../contex/contex_custom_hooks.js";
import axios from "axios";

const UserAccess = () => {
  const [action, setAction] = useState("");
  const { loggedInUser } = useLoggedInUser();
  const [userFullInfo, setUserFullInfo] = useState(null);
  const [error, setError] = useState("");

  const onGetUserInfoClick = async () => {
    try {
      if (!loggedInUser) throw new Error("Must log in");
      const { data: user } = await axios.get(
        "https://bank-api-j30a.onrender.com/api/users/me/full",
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setUserFullInfo(user);
      setError("");
    } catch (e) {
      console.log(e);
      setError(e.response?.data || e.message);
    }
  };
  return (
    <>
      <h2>User Access</h2>
      <p>email: itamarsh@gmail.com</p>
      <p>password: 123456</p>
      <hr />
      <div className="wrapper">
        <div className="menu">
          <div onClick={() => setAction("withdraw")}>Withdraw</div>
          <div onClick={() => setAction("deposite")}>Deposite</div>
          <div onClick={() => setAction("transfer")}>Transfer</div>
        </div>
        <div className="action">
          {action === "withdraw" && <Withdraw />}
          {action === "deposite" && <Deposite />}
          {action === "transfer" && <Transfer />}
        </div>
        <div className="user-info">
          <div className="code-container">
            <pre>
              <code>{JSON.stringify(userFullInfo, null, 1)}</code>
            </pre>
          </div>
          <button onClick={onGetUserInfoClick}>get user info</button>
          {error && <div>{error}</div>}
        </div>
      </div>
    </>
  );
};
export default UserAccess;
