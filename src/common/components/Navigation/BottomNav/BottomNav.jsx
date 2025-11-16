import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import "./BottomNav.scss";

const BottomNav = ({ tabs = [], className = "", ariaLabel = "Alt gezinme" }) => {
  const { pathname } = useLocation();
  const navClassName = ["bottom-nav", className].filter(Boolean).join(" ");

  const doesPathMatch = (prefix) => {
    if (!prefix) return false;
    if (prefix === "/") {
      return pathname === "/";
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  };

  const getIsActive = (tab) => {
    const matchers = tab.matchPrefixes?.length ? tab.matchPrefixes : [tab.to];
    return matchers.some(doesPathMatch);
  };

  return (
    <nav className={navClassName} role='navigation' aria-label={ariaLabel}>
      <div className='bottom-nav__content'>
        {tabs.map((tab) => {
          const {
            to,
            label,
            icon: Icon,
            activeIcon: ActiveIcon,
            end,
          } = tab;
          const isActive = getIsActive(tab);
          const itemClass = `bottom-nav__item${
            isActive ? " bottom-nav__item--active" : ""
          }`;

          return (
            <NavLink key={to} to={to} end={end} className={itemClass}>
              <span className='bottom-nav__iconWrapper' aria-hidden='true'>
                {ActiveIcon ? (
                  <>
                    {Icon && (
                      <Icon className='bottom-nav__icon bottom-nav__icon--outline' />
                    )}
                    <ActiveIcon className='bottom-nav__icon bottom-nav__icon--filled' />
                  </>
                ) : (
                  Icon && <Icon className='bottom-nav__icon' />
                )}
              </span>
              <span className='bottom-nav__label'>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

const iconShape = PropTypes.elementType;

BottomNav.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: iconShape,
      activeIcon: iconShape,
      matchPrefixes: PropTypes.arrayOf(PropTypes.string),
      end: PropTypes.bool,
    })
  ).isRequired,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default BottomNav;
