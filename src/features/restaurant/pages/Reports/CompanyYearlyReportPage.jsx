import { useParams, useNavigate, useLocation } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import CustomDropdown from "@/common/components/CustomDropdown/CustomDropdown";
import ReportSummaryCard from "@/common/components/ReportCards/ReportSummaryCard/ReportSummaryCard";
import StatCard from "@/common/components/Stats/StatCard/StatCard";
import StatsGrid from "@/common/components/Stats/StatsGrid/StatsGrid";
import ReportSectionHeader from "@/common/components/ReportSectionHeader/ReportSectionHeader";
import { companyNameById } from "@/features/restaurant/utils/mockCompanyData";
import "./CompanyYearlyReportPage.scss";

/**
 * Restoran tarafı – Firma bazlı yıllık rapor sayfası
 * Firma kartına tıklanınca açılır. Yalnızca aylık özetleri gösterir.
 * Müşteri rapor sayfası yapısını yeniden kullanır; sınıf isimleri aynıdır,
 * dolayısıyla mevcut SCSS kopyalanarak uyarlanmıştır.
 *
 * Şu an için mock veri kullanır. Gerçek API entegrasyonu yapılırken
 * companyId & year parametreleriyle istek atılmalıdır.
 */
const CompanyYearlyReportPage = () => {
  const { companyId, year } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Firma adı navigasyon state'inden gelir; yoksa mock map kullanılır.
  const companyName =
    location.state?.companyName || companyNameById[String(companyId)] || "Firma";

  // --- Mock veriler --- //
  // Yıllık özet (toplam / delivery / dine-in)
  const yearlySummary = { total: 250, delivery: 180, dineIn: 70 };

  // 12 ayı ters kronolojik diziye dönüştür (Aralık → Ocak)
  const monthLabels = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  const monthlyData = monthLabels
    .map((label, idx) => {
      const monthNumber = String(idx + 1).padStart(2, "0");
      return {
        month: label,
        monthNumber,
        summary: {
          total: Math.floor(Math.random() * 40) + 10, // mock
          delivery: Math.floor(Math.random() * 25) + 5,
          dineIn: Math.floor(Math.random() * 15) + 5,
        },
      };
    })
    .reverse(); // ters kronolojik

  const baseYears = ["2026", "2025"];
  const yearOptions = Array.from(new Set([year, ...baseYears].filter(Boolean)))
    .sort((a, b) => Number(b) - Number(a))
    .map((value) => ({ value, label: value }));

  const handleYearChange = (selectedYear) => {
    navigate(`/restaurant/reports/${companyId}/${selectedYear}`, {
      replace: true,
      state: { companyName },
    });
  };

  return (
    <div className="company-yearly-report-page">
      <DetailPageHeader title="Raporlar" />

      {/* Başlık + Yıl seçici */}
      <ReportSectionHeader title={companyName}>
        <CustomDropdown
          options={yearOptions}
          selectedValue={year}
          onSelect={handleYearChange}
        />
      </ReportSectionHeader>

      {/* Yıllık Özet Kartları */}
      <div className="company-yearly-report-page__stats">
        <StatsGrid>
          <StatCard
            value={yearlySummary.total}
            label="Toplam Tabldot"
            variant="total"
          />
          <StatCard
            value={yearlySummary.delivery}
            label="Siparişle Tabldot"
            variant="delivery"
          />
          <StatCard
            value={yearlySummary.dineIn}
            label="Restoranda Tabldot"
            variant="dine-in"
          />
        </StatsGrid>
      </div>

      {/* Aylık Liste */}
      <div className="u-card-group__list">
        {monthlyData.map((data) => (
          <ReportSummaryCard
            key={data.monthNumber}
            title={`${data.month} ${year}`}
            total={data.summary.total}
            delivery={data.summary.delivery}
            dineIn={data.summary.dineIn}
            onClick={() =>
              navigate(
                `/restaurant/reports/${companyId}/${year}/${data.monthNumber}`,
                { state: { companyName } }
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyYearlyReportPage;
