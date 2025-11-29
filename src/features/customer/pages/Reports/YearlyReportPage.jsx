import { useParams, useNavigate } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import CustomDropdown from "@/common/components/CustomDropdown/CustomDropdown";
import ReportHeader from "@/common/components/ReportHeader/ReportHeader";
import ReportSummaryCard from "@/common/components/ReportCards/ReportSummaryCard/ReportSummaryCard";
import StatCard from "@/common/components/Stats/StatCard/StatCard";
import StatsGrid from "@/common/components/Stats/StatsGrid/StatsGrid";
import "./YearlyReportPage.scss";

const YearlyReportPage = () => {
  const { year } = useParams();
  const navigate = useNavigate();

  // Mock Data
  const yearlySummary = { total: 250, delivery: 180, dineIn: 70 };
  const monthlyData = [
    {
      month: "Temmuz",
      monthNumber: "07",
      summary: { total: 23, delivery: 15, dineIn: 8 },
    },
    {
      month: "Haziran",
      monthNumber: "06",
      summary: { total: 19, delivery: 10, dineIn: 9 },
    },
    {
      month: "Mayıs",
      monthNumber: "05",
      summary: { total: 30, delivery: 25, dineIn: 5 },
    },
    {
      month: "Nisan",
      monthNumber: "04",
      summary: { total: 28, delivery: 20, dineIn: 8 },
    },
  ];
  const availableYears = [
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
  ];

  const handleMonthClick = (monthNumber) => {
    const monthStr = String(monthNumber).padStart(2, "0");
    navigate(`/reports/${year}/${monthStr}`);
  };

  const handleYearChange = (selectedYear) => {
    navigate(`/reports/${selectedYear}`);
  };

  return (
    <>
      <DetailPageHeader title="Raporlar" />

      <ReportHeader title={`${year} Özeti`}>
        <CustomDropdown
          options={availableYears}
          selectedValue={year}
          onSelect={handleYearChange}
        />
      </ReportHeader>

      {/* 2. Yearly Summary Cards */}
      <div className='u-stats-block'>
        <StatsGrid>
          <StatCard value={yearlySummary.total} label='Toplam Tabldot' variant='total' />
          <StatCard value={yearlySummary.delivery} label='Siparişle Tabldot' variant='delivery' />
          <StatCard value={yearlySummary.dineIn} label='Restoranda Tabldot' variant='dine-in' />
        </StatsGrid>
      </div>

      {/* 3. Monthly List */}
      <div className='monthly-list'>
        <div className='card-stack'>
          {monthlyData.map((data) => (
            <ReportSummaryCard
              key={data.month}
              title={`${data.month} ${year}`}
              total={data.summary.total}
              delivery={data.summary.delivery}
              dineIn={data.summary.dineIn}
              onClick={() => handleMonthClick(data.monthNumber)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default YearlyReportPage;
