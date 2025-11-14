import { NavLink, useLocation } from "react-router-dom";
import "./RestaurantBottomBar.scss";

import { ReactComponent as LayoutOutline } from "../../../../assets/icons/layout-outline.svg";
import { ReactComponent as LayoutFilled } from "../../../../assets/icons/layout-filled.svg";
import { ReactComponent as ChefHatOutline } from "../../../../assets/icons/chef-hat-outline.svg";
import { ReactComponent as ChefHatFilled } from "../../../../assets/icons/chef-hat-filled.svg";
import { ReactComponent as ClipboardListOutline } from "../../../../assets/icons/clipboard-list-outline.svg";
import { ReactComponent as ClipboardListFilled } from "../../../../assets/icons/clipboard-list-filled.svg";
import { ReactComponent as UserOutline } from "../../../../assets/icons/user-outline.svg";
import { ReactComponent as UserFilled } from "../../../../assets/icons/user-filled.svg";

const RestaurantBottomBar = () => {
  const tabs = [
    {
      to: "/",
      label: "Bugün",
      Outline: LayoutOutline,
      Filled: LayoutFilled,
      end: true,
      matchPrefixes: ["/", "/qr-activity"],
    },
    {
      to: "/orders",
      label: "Siparişler",
      Outline: ClipboardListOutline,
      Filled: ClipboardListFilled,
      matchPrefixes: ["/orders"],
    },
    {
      to: "/menu",
      label: "Menü",
      Outline: ChefHatOutline,
      Filled: ChefHatFilled,
      matchPrefixes: ["/menu"],
    },
    {
      to: "/profile",
      label: "Hesap",
      Outline: UserOutline,
      Filled: UserFilled,
      matchPrefixes: ["/profile", "/reports", "/restaurant/reports", "/companies", "/settings"],
    },
  ];

  const { pathname } = useLocation();

  const doesPathMatch = (prefix) => {
    if (prefix === "/") {
      return pathname === "/";
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  };

  return (
    <nav
      className='restaurant-bottom-bar'
      role='navigation'
      aria-label='Alt gezinme'
    >
      <div className='bottom-bar-content'>
        {tabs.map(({ to, label, Outline, Filled, end, matchPrefixes }) => {
          const isTabActive = (matchPrefixes || [to]).some(doesPathMatch);

          return (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={() =>
              "bottom-bar-item" + (isTabActive ? " active" : "")
            }
          >
            <span className='icon-wrapper' aria-hidden='true'>
              <Outline className='icon icon-outline' />
              <Filled className='icon icon-filled' />
            </span>
            <span className='label'>{label}</span>
          </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default RestaurantBottomBar;
