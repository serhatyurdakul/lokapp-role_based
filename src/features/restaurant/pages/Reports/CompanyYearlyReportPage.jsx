import { useParams, useNavigate, useLocation } from "react-router-dom";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import CustomDropdown from "@/components/common/CustomDropdown/CustomDropdown";
import ReportSummaryCard from "@/components/reporting/ReportSummaryCard/ReportSummaryCard";
import SummaryStatCard from "@/components/reporting/SummaryStatCard/SummaryStatCard";
import "./CompanyYearlyReportPage.scss";

/**
 * Restoran tarafı – Firma bazlı yıllık rapor sayfası
 * Firma kartına tıklanınca açılır. Yalnızca aylık özetleri gösterir.
 * Müşteri YearlyReportPage yapısını yeniden kullanır; sınıf isimleri aynıdır,
 * dolayısıyla mevcut SCSS kopyalanarak uyarlanmıştır.
 *
 * Şu an için mock veri kullanır. Gerçek API entegrasyonu yapılırken
 * companyId & year parametreleriyle istek atılmalıdır.
 */
const CompanyYearlyReportPage = () => {
  const { companyId, year } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Firma adı navigasyon state'inden gelir; yoksa yedek metin kullanılır.
  const companyName = location.state?.companyName || "Firma";

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

  // Yıl seçenekleri – sabit 2025 & 2024
  const availableYears = [
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
  ];

  const handleYearChange = (selectedYear) => {
    navigate(`/restaurant/reports/${companyId}/${selectedYear}`, {
      replace: true,
      state: { companyName },
    });
  };

  return (
    <>
      <DetailPageHeader title="Raporlar" />

      {/* Başlık + Yıl seçici */}
      <div className="summary-row">
        <h2 className="summary-title">{companyName}</h2>
        <div className="filter-controls">
          <CustomDropdown
            options={availableYears}
            selectedValue={year}
            onSelect={handleYearChange}
          />
        </div>
      </div>

      {/* Yıllık Özet Kartları */}
      <div className="period-summary">
        <div className="summary-grid">
          <SummaryStatCard
            value={yearlySummary.total}
            label="Toplam Tabldot"
            variant="total"
          />
          <SummaryStatCard
            value={yearlySummary.delivery}
            label="Siparişle Tabldot"
            variant="delivery"
          />
          <SummaryStatCard
            value={yearlySummary.dineIn}
            label="Restoranda Tabldot"
            variant="dine-in"
          />
        </div>
      </div>

      {/* Aylık Liste */}
      <div className="monthly-list">
        <div className="card-stack">
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
    </>
  );
};

export default CompanyYearlyReportPage;
