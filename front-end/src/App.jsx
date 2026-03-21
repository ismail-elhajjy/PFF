import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
// import Footer from "./Components/Footer.jsx";
import Contact from "./Pages/Contact";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={<Login />} />
        
       
        <Route path="/contact" element={<Contact />} />
        
      
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
