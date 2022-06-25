import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./screens/homepage/Homepage";
import Loginpage from "./screens/loginpage/Loginpage";
import Registerpage from "./screens/registerpage/Registerpage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
