import { Outlet } from "react-router-dom";
import CustomerNavbar from "../components/Navbar/CustomerNavbar";

const CustomerLayout = () => {
  return (
    <div className="layout">
      <CustomerNavbar />
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
