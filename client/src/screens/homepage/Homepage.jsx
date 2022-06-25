import "./Homepage.css";
import UserAccess from "./UserAccess/UserAccess";
import AdminAccess from "./AdminAccess/AdminAccess";

const Homepage = () => {
  return (
    <main>
      <section>
        <UserAccess />
      </section>
      <section>
        <AdminAccess />
      </section>
    </main>
  );
};
export default Homepage;
