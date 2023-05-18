import { useState } from "react";
import { useLoggedInUser } from "../../../../contex/contex_custom_hooks.js";
import "./AdminTransfer.css";
import axios from "axios";

const AdminTransfer = () => {
  const [fromUserId, setFromUserId] = useState("");
  const [fromAccountId, setFromAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [error, setError] = useState("");
  const { loggedInUser } = useLoggedInUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    const body = {
      fromAccountId,
      amount: +amount,
      toUserId,
      toAccountId,
    };
    try {
      if (!loggedInUser) throw new Error("Must Log in");
      await axios.patch(
        `https://bank-api-j30a.onrender.com/api/users/${fromUserId}/transfer`,
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
          placeholder="From Account"
          name={"fromAccountId"}
          value={fromAccountId}
          onChange={({ target }) => setFromAccountId(target.value)}
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
        <input
          type="text"
          placeholder="To User"
          name="toUserId"
          value={toUserId}
          onChange={({ target }) => setToUserId(target.value)}
          required
        />
        <input
          type="text"
          placeholder="To Account"
          name="toAccountId"
          value={toAccountId}
          onChange={({ target }) => setToAccountId(target.value)}
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
export default AdminTransfer;
