import { NavLink } from "react-router-dom";
import BaseNavbar from "@/components/common/Navbar/BaseNavbar";
import ProfileButton from "@/components/common/ProfileButton/ProfileButton";
import { useSelector } from "react-redux";

const CustomerNavbar = () => {
  const { user } = useSelector((state) => state.auth);

  const userInitial = user?.name ? user.name.trim().charAt(0).toLocaleUpperCase("tr-TR") : "";

  const links = [
    { to: "/", label: "Sipariş", end: true },
    { to: "/qr", label: "QR" },
  ];

  const rightAction = <ProfileButton userInitial={userInitial} />;

  return <BaseNavbar links={links} rightAction={rightAction} />;
};

export default CustomerNavbar;
