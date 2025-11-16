import TopNav from "@/common/components/Navigation/TopNav/TopNav";
import ProfileButton from "@/common/components/ProfileButton/ProfileButton";
import { useSelector } from "react-redux";

const CustomerNavbar = () => {
  const { user } = useSelector((state) => state.auth);

  const userInitial = user?.name
    ? user.name.trim().charAt(0).toLocaleUpperCase("tr-TR")
    : "";

  const links = [
    { to: "/", label: "Bugün", end: true },
    { to: "/orders/new", label: "Sipariş" },
  ];

  const rightAction = <ProfileButton userInitial={userInitial} />;

  return <TopNav links={links} rightAction={rightAction} />;
};

export default CustomerNavbar;
