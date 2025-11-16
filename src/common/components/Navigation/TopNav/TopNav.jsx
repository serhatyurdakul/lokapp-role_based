import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./TopNav.scss";

const TopNav = ({ links, rightAction = null, className }) => {
  const location = useLocation();
  const navRef = useRef(null);
  const isActive = (link) => {
    const { to, end: endFlag, matchPrefixes } = link;
    const path = location.pathname;

    if (Array.isArray(matchPrefixes) && matchPrefixes.length > 0) {
      return matchPrefixes.some((prefix) => {
        if (prefix === "/") {
          return path === "/";
        }
        return path === prefix || path.startsWith(`${prefix}/`);
      });
    }

    if (endFlag) return path === to;
    if (to === "/") return path === "/";
    return path === to || path.startsWith(to + "/");
  };

  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    const activeIndex = Array.from(navElement.children).findIndex((child) =>
      child.classList.contains("active")
    );

    navElement.style.setProperty("--active-index", activeIndex);
    navElement.style.setProperty("--total-links", links.length);
  }, [location, links]);

  return (
    <nav className={className ? `navbar ${className}` : "navbar"}>
      <div className='navbar__menu' ref={navRef}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={`navbar__menu-item ${isActive(link) ? "active" : ""}`}
            end={link.end || undefined}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      {rightAction && rightAction}
    </nav>
  );
};

export default TopNav;
