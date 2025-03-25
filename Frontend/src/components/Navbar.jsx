import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css"; // Custom CSS for navbar styling
import img1 from "../../public/logo.gif";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  return ( 
    <nav className="navbar">
      {/* <h1 className="navbar-logo">Dog Services</h1> */}
      <a href="http://127.0.0.1:5173/"><img src={img1} className="navbar-logo" alt="Logo" /></a>
      <a style={{textDecoration: "none"}} href="http://127.0.0.1:5173/"><h1 className="navbar-logo-text">AZ Dog Care</h1></a>
      <ul className={isMobile ? "nav-links-mobile" : "nav-links"}
          onClick={() => setIsMobile(false)}>

        <li><Link to="/public-services">Public Services</Link></li>
        
        <li><Link to="/private-hospitals">Private Sector</Link></li>
        
        <li><a href="http://127.0.0.1:8001/know-your-breed" target="_blank">Breed Finder!</a></li>

        <li><Link to="/complain">Complain</Link></li>

        <li><Link to="/adoption-house">Adoption House</Link></li>
        
        <li><a href="http://localhost:3000/" target="_blank">E-commerce</a></li>
        
        
        
        <li className="dropdown">
          <Link to="#">Services</Link>
          <div className="dropdown-content">
            <Link to="/grooming">Grooming</Link>
            <Link to="/dog-friendly-places">Dog Friendly Places</Link>
            <Link to="/training">Training</Link>
            <Link to="/daycare">Daycare</Link>
           </div>
        </li>

        <li><Link to="/contact">Contact Us</Link></li>


      </ul>
      
      <button className="mobile-menu-icon" onClick={() => setIsMobile(!isMobile)}>
        {isMobile ? (
          <i className="fas fa-times"></i> // FontAwesome for close icon
        ) : (
          <i className="fas fa-bars"></i>  // FontAwesome for hamburger icon
        )}
      </button>
    </nav>
  );
};

export default Navbar;