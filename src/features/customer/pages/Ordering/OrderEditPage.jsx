import { useLocation } from "react-router-dom";
import OrderScreen from "./OrderScreen";

const OrderEditPage = () => {
  const location = useLocation();
  const selectedPairs = location?.state?.selectedPairs || null;
  return <OrderScreen mode='edit' selectedPairs={selectedPairs} />;
};

export default OrderEditPage;
