import { Outlet, useLocation } from "react-router-dom";
import RestaurantNavbar from "../components/Navbar/RestaurantNavbar.jsx";
import RestaurantBottomBar from "../components/BottomBar/RestaurantBottomBar.jsx";
import "./RestaurantLayout.scss";

const RestaurantLayout = () => {
  const location = useLocation();
  const bottomBarHiddenPaths = ["/menu/new", "/settings/order-cutoff"];
  const navbarHiddenPaths = ["/menu/new", "/settings/order-cutoff"]; // Bu sayfada tam odak: navbar tamamen gizli
  const hideBottomBar = bottomBarHiddenPaths.includes(location.pathname);
  const hideNavbar = navbarHiddenPaths.includes(location.pathname);
  const bottomBarOffset = hideBottomBar ? "0px" : "64px";
  return (
    <div
      className='layout restaurant-layout'
      style={{ "--bottom-bar-offset": bottomBarOffset }}
    >
      {!hideNavbar && <RestaurantNavbar />}
      <main className='container'>
        <Outlet />
      </main>
      {!hideBottomBar && <RestaurantBottomBar />}
    </div>
  );
};

export default RestaurantLayout;
