import BottomNav from "@/common/components/Navigation/BottomNav/BottomNav";
import { ReactComponent as LayoutOutline } from "@/assets/icons/layout-outline.svg";
import { ReactComponent as LayoutFilled } from "@/assets/icons/layout-filled.svg";
import { ReactComponent as TakeawayOutline } from "@/assets/icons/bag-outline.svg";
import { ReactComponent as TakeawayFilled } from "@/assets/icons/bag-filled.svg";
import { ReactComponent as QrOutline } from "@/assets/icons/qr-outline.svg";
import { ReactComponent as QrFilled } from "@/assets/icons/qr-filled.svg";
import { ReactComponent as UserOutline } from "@/assets/icons/user-outline.svg";
import { ReactComponent as UserFilled } from "@/assets/icons/user-filled.svg";

const tabs = [
  {
    to: "/",
    label: "Bugün",
    icon: LayoutOutline,
    activeIcon: LayoutFilled,
    end: true,
    matchPrefixes: ["/"],
  },
  {
    to: "/orders/new",
    label: "Sipariş",
    icon: TakeawayOutline,
    activeIcon: TakeawayFilled,
    matchPrefixes: ["/orders"],
  },
  {
    to: "/qr",
    label: "QR",
    icon: QrOutline,
    activeIcon: QrFilled,
    matchPrefixes: ["/qr"],
  },
  {
    to: "/profile",
    label: "Hesap",
    icon: UserOutline,
    activeIcon: UserFilled,
    matchPrefixes: [
      "/profile",
      "/orders/history",
      "/orders/edit",
      "/reports",
    ],
  },
];

const CustomerBottomBar = () => (
  <BottomNav
    tabs={tabs}
    className='customer-bottom-bar'
    ariaLabel='Müşteri alt gezinme'
  />
);

export default CustomerBottomBar;
