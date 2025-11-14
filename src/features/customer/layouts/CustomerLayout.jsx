import { Outlet, useLocation } from "react-router-dom";
import CustomerNavbar from "../components/Navbar/CustomerNavbar";
import CustomerBottomBar from "../components/BottomBar/CustomerBottomBar.jsx";
import "./CustomerLayout.scss";

const CustomerLayout = () => {
  const location = useLocation();
  const hideBars = location.pathname === "/orders/edit";
  const bottomBarOffset = hideBars ? "0px" : "64px";
  return (
    <div
      className='layout customer-layout'
      style={{ "--bottom-bar-offset": bottomBarOffset }}
    >
      {!hideBars && <CustomerNavbar />}
      <main className='container'>
        <Outlet />
      </main>
      {!hideBars && <CustomerBottomBar />}
    </div>
  );
};

export default CustomerLayout;
