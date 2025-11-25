import { useLocation, useParams } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import EmployeeMealCard from "@/common/components/ReportCards/EmployeeMealCard/EmployeeMealCard";
import "./OrderEmployeeListPage.scss";

// Not: Bu ekranda sadece 'Sipariş' türündeki kayıtlar listelenir
const MOCK_EMPLOYEE_MEALS = [
  {
    employee: "Ayşe Yılmaz",
    type: "Sipariş",
    time: "12:05",
    items: ["Mercimek Çorbası", "Izgara Köfte", "Pirinç Pilavı"],
  },
  {
    employee: "Zeynep Kaya",
    type: "Sipariş",
    time: "12:15",
    items: ["Ezogelin", "Tavuk Şiş", "Bulgur"],
  },
];

const OrderEmployeeListPage = () => {
  const { companyId } = useParams();
  const { state } = useLocation();
  const companyName = state?.companyName || "Firma";
  const count = MOCK_EMPLOYEE_MEALS.length;

  return (
    <div className='order-employees-page'>
      <DetailPageHeader title={companyName} backPath={`/orders/${companyId}`} />

      <h2 className='u-card-group__title'>{`Sipariş Verenler (${count})`}</h2>

      <div className='u-card-group__list'>
        {MOCK_EMPLOYEE_MEALS.map((meal, idx) => (
          <EmployeeMealCard key={`emp-${idx}`} meal={meal} showType={false} />
        ))}
      </div>
    </div>
  );
};

export default OrderEmployeeListPage;
