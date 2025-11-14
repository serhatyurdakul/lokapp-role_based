import { NavLink, useLocation } from "react-router-dom";
import "./CustomerBottomBar.scss";

import { ReactComponent as LayoutOutline } from "@/assets/icons/layout-outline.svg";
import { ReactComponent as LayoutFilled } from "@/assets/icons/layout-filled.svg";
import { ReactComponent as TakeawayOutline } from "@/assets/icons/bag-outline.svg";
import { ReactComponent as TakeawayFilled } from "@/assets/icons/bag-filled.svg";
import { ReactComponent as QrOutline } from "@/assets/icons/qr-outline.svg";
import { ReactComponent as QrFilled } from "@/assets/icons/qr-filled.svg";
import { ReactComponent as UserOutline } from "@/assets/icons/user-outline.svg";
import { ReactComponent as UserFilled } from "@/assets/icons/user-filled.svg";

const CustomerBottomBar = () => {
  const tabs = [
    {
      to: "/",
      label: "Bugün",
      type: "dual",
      Outline: LayoutOutline,
      Filled: LayoutFilled,
      end: true,
      matchPrefixes: ["/"],
    },
    {
      to: "/orders/new",
      label: "Sipariş",
      type: "dual",
      Outline: TakeawayOutline,
      Filled: TakeawayFilled,
      matchPrefixes: ["/orders"],
    },
    {
      to: "/qr",
      label: "QR",
      type: "dual",
      Outline: QrOutline,
      Filled: QrFilled,
      matchPrefixes: ["/qr"],
    },
    {
      to: "/profile",
      label: "Hesap",
      type: "dual",
      Outline: UserOutline,
      Filled: UserFilled,
      matchPrefixes: ["/profile", "/orders/history", "/orders/edit", "/reports"],
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
      className='customer-bottom-bar'
      role='navigation'
      aria-label='Alt gezinme'
    >
      <div className='bottom-bar-content'>
        {tabs.map((tab) => {
          const isTabActive = (tab.matchPrefixes || [tab.to]).some(doesPathMatch);

          return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={() => "bottom-bar-item" + (isTabActive ? " active" : "")}
          >
            <span className='icon-wrapper' aria-hidden='true'>
              {tab.type === "dual" ? (
                <>
                  <tab.Outline className='icon icon-outline' />
                  <tab.Filled className='icon icon-filled' />
                </>
              ) : (
                <tab.Icon className='icon' />
              )}
            </span>
            <span className='label'>{tab.label}</span>
          </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default CustomerBottomBar;
