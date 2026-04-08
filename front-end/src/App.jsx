import { BrowserRouter,Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer.jsx";
import Contact from "./Pages/Contact";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import NavBar from "./Components/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import Billboards from "./Pages/Billboards.jsx";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/billboards" element={<Billboards />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
      
    </BrowserRouter>
  );
}

export default App;
