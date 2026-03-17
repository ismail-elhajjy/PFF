import Contact from "./Pages/Contact";
// import Footer from "./Components/Footer.jsx";
import { BrowserRouter } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import { Route, Routes } from "react-router-dom";
// import Register from "./Pages/Register.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<Login />} />
        
       
        <Route path="/contact" element={<Contact />} />
        
      
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
