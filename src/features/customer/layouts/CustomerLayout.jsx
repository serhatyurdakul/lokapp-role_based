import CustomerNavbar from "../components/Navbar/CustomerNavbar";

const CustomerLayout = ({ children }) => {
  return (
    <div className='layout'>
      <CustomerNavbar />
      <main className='container'>{children}</main>
    </div>
  );
};

export default CustomerLayout;
