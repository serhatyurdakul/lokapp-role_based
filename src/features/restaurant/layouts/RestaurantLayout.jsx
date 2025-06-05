import RestaurantNavbar from "../components/Navbar/RestaurantNavbar.jsx";

const RestaurantLayout = ({ children }) => {
  return (
    <div className='layout'>
      <RestaurantNavbar />
      <main className='container'>{children}</main>
    </div>
  );
};

export default RestaurantLayout;
