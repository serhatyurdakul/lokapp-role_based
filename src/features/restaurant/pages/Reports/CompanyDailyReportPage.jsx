
import { useNavigate, useParams, useLocation } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import StatCard from "@/common/components/Stats/StatCard/StatCard";
import StatsGrid from "@/common/components/Stats/StatsGrid/StatsGrid";
import EmployeeMealCard from "@/common/components/ReportCards/EmployeeMealCard/EmployeeMealCard";
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
    <div className="company-daily-report">
      <DetailPageHeader title="Günlük Rapor" />

      <div className="company-daily-report__period-nav">
        <h2 className="company-daily-report__period-title">
          {companyName} · {formattedDate}
        </h2>
      </div>

      <div className="company-daily-report__summary">
        <StatsGrid className="company-daily-report__summary-grid">
          <StatCard value={totalMeals} label="Toplam Tabldot" variant="total" />
          <StatCard value={delivery} label="Siparişle Tabldot" variant="delivery" />
          <StatCard value={dineIn} label="Restoranda Tabldot" variant="dine-in" />
        </StatsGrid>
      </div>

      <div className="company-daily-report__groups u-card-group__grid">
        {deliveryMeals.length > 0 && (
          <section className="company-daily-report__section">
            <h2 className="u-card-group__title">
              Siparişler ({deliveryMeals.length})
            </h2>
            <div className="company-daily-report__card-list u-card-group__list">
              {deliveryMeals.map((meal, idx) => (
                <EmployeeMealCard key={`delivery-${idx}`} meal={meal} />
              ))}
            </div>
          </section>
        )}

        {dineInMeals.length > 0 && (
          <section className="company-daily-report__section">
            <h2 className="u-card-group__title">Restoranda ({dineInMeals.length})</h2>
            <div className="company-daily-report__card-list u-card-group__list">
              {dineInMeals.map((meal, idx) => (
                <EmployeeMealCard key={`dinein-${idx}`} meal={meal} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CompanyDailyReportPage;
