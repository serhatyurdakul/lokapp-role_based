import BottomNav from "@/common/components/Navigation/BottomNav/BottomNav";
import { ReactComponent as LayoutOutline } from "@/assets/icons/layout-outline.svg";
import { ReactComponent as LayoutFilled } from "@/assets/icons/layout-filled.svg";
import { ReactComponent as ChefHatOutline } from "@/assets/icons/chef-hat-outline.svg";
import { ReactComponent as ChefHatFilled } from "@/assets/icons/chef-hat-filled.svg";
import { ReactComponent as ClipboardListOutline } from "@/assets/icons/clipboard-list-outline.svg";
import { ReactComponent as ClipboardListFilled } from "@/assets/icons/clipboard-list-filled.svg";
import { ReactComponent as UserOutline } from "@/assets/icons/user-outline.svg";
import { ReactComponent as UserFilled } from "@/assets/icons/user-filled.svg";

const tabs = [
  {
    to: "/",
    label: "Bugün",
    icon: LayoutOutline,
    activeIcon: LayoutFilled,
    end: true,
    matchPrefixes: ["/", "/qr-activity"],
  },
  {
    to: "/orders",
    label: "Siparişler",
    icon: ClipboardListOutline,
    activeIcon: ClipboardListFilled,
    matchPrefixes: ["/orders"],
  },
  {
    to: "/menu",
    label: "Menü",
    icon: ChefHatOutline,
    activeIcon: ChefHatFilled,
    matchPrefixes: ["/menu"],
  },
  {
    to: "/profile",
    label: "Hesap",
    icon: UserOutline,
    activeIcon: UserFilled,
    matchPrefixes: [
      "/profile",
      "/reports",
      "/restaurant/reports",
      "/companies",
      "/settings",
    ],
  },
];

const RestaurantBottomBar = ({ className = "" }) => (
  <BottomNav
    tabs={tabs}
    className={className}
    ariaLabel='Restoran alt gezinme'
  />
);

export default RestaurantBottomBar;
