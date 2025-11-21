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
      {!hideBars && <CustomerNavbar className='customer-layout__navbar' />}
      <main className='container'>
        <Outlet />
      </main>
      {!hideBars && (
        <CustomerBottomBar className='customer-layout__bottom-bar' />
      )}
    </div>
  );
};

export default CustomerLayout;
