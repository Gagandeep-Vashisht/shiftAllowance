import React, { useState } from "react";
import classes from "./Navbar.module.css";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  return (
    <>
      <nav className={classes.mainNav}>
        {/* 1st logo part  */}
        <div className="logo">
          <h2>
            <span>T</span>hapa
            <span>T</span>echnical
          </h2>
        </div>

        {/* 2nd menu part  */}
        <div
          className={
            showMediaIcons ? `${classes.menuLink} ${classes.mobileMenuLink}` : classes.menuLink
          }>
          <ul>
            <li>
              <NavLink to="/userDetails">User Administration</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard">DashBoard</NavLink>
            </li>
            
          </ul>
        </div>

        {/* 3rd social media links */}
        <div className={classes.socialMedia}>
         

          {/* hamburget menu start  */}
          <div className={classes.ham}>
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <GiHamburgerMenu />
            </a>
          </div>
        </div>
      </nav>

      {/* hero section  */}
      {/* <section className="hero-section">
        <p>Welcome to </p>
        <h1>Thapa Technical</h1>
      </section> */}
    </>
  );
};

export default Navbar;