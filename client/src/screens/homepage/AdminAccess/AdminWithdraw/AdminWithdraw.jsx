import { useState } from "react";
import { useLoggedInUser } from "../../../../contex/contex_custom_hooks.js";
import "./AdminWithdraw.css";
import axios from "axios";

const AdminWithdraw = () => {
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
        `https://sh-bank-app.herokuapp.com/api/users/${fromUserId}/withdraw`,
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
      <h4>Withdraw</h4>
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
          Withdraw
        </button>
      </form>
      {error && <div>{error}</div>}
    </>
  );
};
export default AdminWithdraw;
