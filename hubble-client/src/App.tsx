import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./routes/home";
import Login from "./routes/(auth)/login";
import Register from "./routes/(auth)/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
