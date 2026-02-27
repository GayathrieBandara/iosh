import { Link } from "react-router-dom";
import logo from "../assets/Images/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="IOSH Logo" className="logo" />
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/login" className="btn">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
