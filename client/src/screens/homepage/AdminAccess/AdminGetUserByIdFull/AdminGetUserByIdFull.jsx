import axios from "axios";
import { useState } from "react";
import { useLoggedInUser } from "../../../../contex/contex_custom_hooks.js";

const AdminGetUserByIdFull = ({ setInfo }) => {
  const [fromUserId, setFromUserId] = useState("");
  const [error, setError] = useState("");
  const { loggedInUser } = useLoggedInUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!loggedInUser) throw new Error("Must Log in");
      const { data } = await axios.get(
        `https://bank-api-j30a.onrender.com/api/users/${fromUserId}/full`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
      setInfo(data);
      setFromUserId("");
      setError("");
    } catch (e) {
      setError(e.response?.data || e.message);
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="User ID"
          name={"fromUserId"}
          value={fromUserId}
          onChange={({ target }) => setFromUserId(target.value)}
          required
        />
        <button className="btn" type="submit">
          get user
        </button>
      </form>
      {error && <div>{error}</div>}
    </>
  );
};
export default AdminGetUserByIdFull;
