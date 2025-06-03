import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./BaseNavbar.scss";

const BaseNavbar = ({
  links, 
  rightAction, 
  className,
}) => {
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    const mainPaths = links.map((link) => link.to);
    const currentPath = location.pathname;

    const activeIndex = mainPaths.includes(currentPath)
      ? Array.from(navElement.children).findIndex((child) =>
          child.classList.contains("active")
        )
      : -1;

    navElement.style.setProperty("--active-index", activeIndex);
    navElement.style.setProperty("--total-links", links.length);
  }, [location, links]);

  return (
    <nav className={`navbar ${className || ""}`}>
      <div className='navbar-menu' ref={navRef}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={`navbar-menu-item ${
              location.pathname === link.to ? "active" : ""
            }`}
            end={link.end}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      {rightAction}
    </nav>
  );
};

export default BaseNavbar;
