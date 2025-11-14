import BaseNavbar from "@/components/common/Navbar/BaseNavbar.jsx";
import ProfileButton from "@/components/common/ProfileButton/ProfileButton.jsx";
import { useSelector } from "react-redux";

const RestaurantNavbar = () => {
  const { user } = useSelector((state) => state.auth);

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toLocaleUpperCase("tr-TR") ?? "";

  const links = [
    { to: "/", label: "Bugün", end: true, matchPrefixes: ["/", "/qr-activity"] },
    { to: "/orders", label: "Siparişler" },
    { to: "/menu", label: "Menü" },
  ];

  const rightAction = <ProfileButton userInitial={userInitial} />;

  return <BaseNavbar links={links} rightAction={rightAction} />;
};

export default RestaurantNavbar;
