import { useState } from "react";
import { useLoggedInUser } from "../../../../contex/contex_custom_hooks.js";
import "./AdminDeposite.css";
import axios from "axios";

const AdminDeposite = () => {
  const [fromUserId, setFromUserId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { loggedInUser } = useLoggedInUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = {
      accountId,
      amount: +amount,
    };
    try {
      if (!loggedInUser) throw new Error("Must Log in");
      await axios.patch(
        `https://bank-api-j30a.onrender.com/api/users/${fromUserId}/deposite`,
        body,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setAmount("");
      setError("");
    } catch (e) {
      setError(e.response?.data || e.message);
    }
  };
  return (
    <>
      <h4>Deposite</h4>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="User ID"
          name={"fromUserId"}
          value={fromUserId}
          onChange={({ target }) => setFromUserId(target.value)}
          required
        />
        <input
          type="text"
          placeholder="Account"
          name={"accountId"}
          value={accountId}
          onChange={({ target }) => setAccountId(target.value)}
          required
        />
        <input
          type="text"
          placeholder="Amount"
          name="amount"
          value={amount}
          onChange={({ target }) => setAmount(target.value)}
          required
        />
        <button className="btn" type="submit">
          Deposite
        </button>
      </form>
      {error && <div>{error}</div>}
    </>
  );
};
export default AdminDeposite;
