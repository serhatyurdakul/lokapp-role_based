
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import SummaryStatCard from "@/components/reporting/SummaryStatCard/SummaryStatCard";
import EmployeeMealCard from "@/components/reporting/EmployeeMealCard/EmployeeMealCard";
import "./CompanyDailyReportPage.scss";

const CompanyDailyReportPage = () => {
  const { companyId, year, month, day } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const companyName = state?.companyName || "Firma";

  const dateObj = new Date(`${year}-${month}-${day}`);
  const formattedDate = dateObj.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ---- Mock veriler ---- //
  // Günlük toplam metrikler
  const totalMeals = 23;
  const delivery = 15;
  const dineIn = 8;

  // Çalışan listesi (mock) – saat ters kronolojik
  const employeesMeals = [
    {
      employee: "Ayşe Yılmaz",
      type: "Sipariş",
      time: "12:05",
      items: ["Mercimek Çorbası", "Izgara Köfte", "Pirinç Pilavı"],
    },
    {
      employee: "Mehmet Demir",
      type: "Restoranda",
      time: "12:10",
    },
    {
      employee: "Zeynep Kaya",
      type: "Sipariş",
      time: "12:15",
      items: ["Ezogelin", "Tavuk Şiş", "Bulgur"],
    },
    {
      employee: "Ali Çelik",
      type: "Restoranda",
      time: "12:20",
    },
  ];

  const deliveryMeals = employeesMeals.filter(
    (meal) => meal.type === "Sipariş"
  );
  const dineInMeals = employeesMeals.filter(
    (meal) => meal.type === "Restoranda"
  );

  return (
    <>
      <DetailPageHeader title="Günlük Rapor" />

      {/* Başlık + geri */}
      <div className="period-navigation">
        <h2 className="current-period">
          {companyName} · {formattedDate}
        </h2>
      </div>

      {/* Günlük İstatistikler */}
      <div className="period-summary">
        <div className="summary-grid">
          <SummaryStatCard value={totalMeals} label="Toplam Tabldot" variant="total" />
          <SummaryStatCard value={delivery} label="Siparişle Tabldot" variant="delivery" />
          <SummaryStatCard value={dineIn} label="Restoranda Tabldot" variant="dine-in" />
        </div>
      </div>

      {/* Çalışan Kartları */}
      <div className="order-cards-groups">
        {deliveryMeals.length > 0 && (
          <section>
            <h2 className="group-title">
              Siparişler ({deliveryMeals.length})
            </h2>
            <div className="order-cards-list">
              {deliveryMeals.map((meal, idx) => (
                <EmployeeMealCard key={`delivery-${idx}`} meal={meal} />
              ))}
            </div>
          </section>
        )}

        {dineInMeals.length > 0 && (
          <section>
            <h2 className="group-title">Restoranda ({dineInMeals.length})</h2>
            <div className="order-cards-list">
              {dineInMeals.map((meal, idx) => (
                <EmployeeMealCard key={`dinein-${idx}`} meal={meal} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default CompanyDailyReportPage;
