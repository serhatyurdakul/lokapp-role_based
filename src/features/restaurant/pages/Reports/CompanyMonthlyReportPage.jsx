import { useNavigate, useParams, useLocation } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import ReportSummaryCard from "@/common/components/ReportCards/ReportSummaryCard/ReportSummaryCard";
import StatCard from "@/common/components/Stats/StatCard/StatCard";
import StatsGrid from "@/common/components/Stats/StatsGrid/StatsGrid";
import ReportSectionHeader from "@/common/components/ReportSectionHeader/ReportSectionHeader";
import "./CompanyMonthlyReportPage.scss";

/**
 * Restoran tarafı – Firma aylık rapor sayfası
 * Günlük kartları ters kronolojik listeler.
 */
const CompanyMonthlyReportPage = () => {
  const { companyId, year, month } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const companyName = state?.companyName || "Firma";

  // ---- Mock veriler ---- //
  // Aylık özet (örnek)
  const monthSummary = { total: 95, delivery: 60, dineIn: 35 };

  // Günlük listesi (son 5 gün örnek)
  const dailyData = [1, 2, 3, 4, 5].map((offset) => {
    const date = new Date(`${year}-${month}-01`);
    date.setDate(date.getDate() + (30 - offset));
    const dateStr = date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return {
      dateStr,
      summary: {
        total: Math.floor(Math.random() * 15) + 5,
        delivery: Math.floor(Math.random() * 10) + 2,
        dineIn: Math.floor(Math.random() * 8) + 1,
      },
    };
  });

  const monthName = new Date(`${year}-${month}-01`).toLocaleDateString(
    "tr-TR",
    { month: "long" }
  );

  return (
    <>
      <DetailPageHeader title="Aylık Rapor" />

      {/* Period Navigation */}
      <ReportSectionHeader title={`${companyName} · ${monthName} ${year}`} align="start" />

      {/* Aylık İstatistikler */}
      <div className="u-stats-block">
        <StatsGrid>
          <StatCard value={monthSummary.total} label="Toplam Tabldot" variant="total" />
          <StatCard value={monthSummary.delivery} label="Siparişle Tabldot" variant="delivery" />
          <StatCard value={monthSummary.dineIn} label="Restoranda Tabldot" variant="dine-in" />
        </StatsGrid>
      </div>

      {/* Günlük Kartlar */}
      <div className="u-card-group__grid">
        {dailyData.map((day) => (
          <ReportSummaryCard
            key={day.dateStr}
            title={day.dateStr}
            total={day.summary.total}
            delivery={day.summary.delivery}
            dineIn={day.summary.dineIn}
            onClick={() =>
              navigate(
                `/restaurant/reports/${companyId}/${year}/${month}/${String(31 - dailyData.indexOf(day)).padStart(2, "0")}`,
                { state: { companyName } }
              )
            }
          />
        ))}
      </div>
    </>
  );
};

export default CompanyMonthlyReportPage;
