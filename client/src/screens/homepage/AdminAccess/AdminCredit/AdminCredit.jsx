import { useState } from "react";
import { useLoggedInUser } from "../../../../contex/contex_custom_hooks.js";
import "./AdminCredit.css";
import axios from "axios";

const AdminCredit = () => {
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
        `https://sh-bank-app.herokuapp.com/api/users/${fromUserId}/credit`,
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
          placeholder="From User ID"
          name={"fromUserId"}
          value={fromUserId}
          onChange={({ target }) => setFromUserId(target.value)}
          required
        />
        <input
          type="text"
          placeholder="Account"
          name={"aAccountId"}
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
          Transfer
        </button>
      </form>
      {error && <div>{error}</div>}
    </>
  );
};
export default AdminCredit;
