import BaseNavbar from "@/components/common/Navbar/BaseNavbar.jsx";
import ProfileButton from "@/components/common/ProfileButton/ProfileButton.jsx";
import { useSelector } from "react-redux";

const RestaurantNavbar = () => {
  const { user } = useSelector((state) => state.auth);

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toLocaleUpperCase("tr-TR") ?? "";

  const links = [
    { to: "/", label: "Özet", end: true },
    { to: "/menu", label: "Menü" },
    { to: "/orders", label: "Siparişler" },
  ];

  const rightAction = <ProfileButton userInitial={userInitial} />;

  return <BaseNavbar links={links} rightAction={rightAction} />;
};

export default RestaurantNavbar;
