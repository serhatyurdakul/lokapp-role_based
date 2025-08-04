import { Outlet } from "react-router-dom";
import RestaurantNavbar from "../components/Navbar/RestaurantNavbar.jsx";

const RestaurantLayout = () => {
  return (
    <div className="layout">
      <RestaurantNavbar />
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
};

export default RestaurantLayout;
