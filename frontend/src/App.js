import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        {
        /*<Route path="/about" element={<h2>esto</h2>} />
        <Route path="*" element={<h3>xd</h3>} />*/}
      </Routes>
    
    </Router>
  );}

export default App;
