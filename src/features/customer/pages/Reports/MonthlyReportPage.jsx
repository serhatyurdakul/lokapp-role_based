import { useNavigate, useParams } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import MealCard from "@/features/customer/components/MealCard/MealCard";
import StatCard from "@/common/components/Stats/StatCard/StatCard";
import StatsGrid from "@/common/components/Stats/StatsGrid/StatsGrid";
import Button from "@/common/components/Button/Button";
import ReportSectionHeader from "@/common/components/ReportSectionHeader/ReportSectionHeader";
import { ReactComponent as ArrowRightIcon } from "@/assets/icons/arrow-right.svg";
import "./MonthlyReportPage.scss";

const MonthlyReportPage = () => {
  const navigate = useNavigate();
  const { year, month } = useParams();

  // Mock data - Bu kısım artık `useParams`'tan gelen aya göre filtrelenmeli.
  // Şimdilik temsili olarak bırakıyorum.
  const dailyMealHistory = [
    {
      date: "2025-07-25",
      type: "Sipariş",
      restaurant: "Bereket Sofrası",
      time: "12:00",
      items: [
        "Mercimek Çorbası",
        "Izgara Köfte",
        "Pirinç Pilavı",
        "Mevsim Salata",
      ],
    },
    {
      date: "2025-07-24",
      type: "Restoranda",
      restaurant: "Bereket Sofrası",
      time: "12:30",
    },
    {
      date: "2025-07-23",
      type: "Sipariş",
      restaurant: "Bereket Sofrası",
      time: "12:00",
      items: ["Ezogelin Çorbası", "Tavuk Şiş", "Bulgur Pilavı", "Cacık"],
    },
    {
      date: "2025-07-22",
      type: "Restoranda",
      restaurant: "Bereket Sofrası",
      time: "12:15",
    },
    {
      date: "2025-07-21",
      type: "Sipariş",
      restaurant: "Bereket Sofrası",
      time: "12:00",
      items: ["Domates Çorbası", "Karnıyarık", "Makarna", "Turşu"],
    },
  ];

  const currentMonthName = new Date(`${year}-${month}-01`).toLocaleDateString(
    "tr-TR",
    { month: "long" }
  );

  return (
    <>
      <DetailPageHeader title='Yemek Geçmişi' />

      {/* Period Navigation */}
      <ReportSectionHeader title={`${currentMonthName} ${year}`}>
        <Button
          variant='outline-primary'
          className='btn-with-icon'
          onClick={() => navigate(`/reports/${year}`)}
        >
          Tüm Aylar
          <ArrowRightIcon aria-hidden='true' />
        </Button>
      </ReportSectionHeader>

      {/* Period Summary */}
      <div className='u-stats-block'>
        <StatsGrid>
          <StatCard value={23} label='Toplam Tabldot' variant='total' />
          <StatCard value={15} label='Siparişle Tabldot' variant='delivery' />
          <StatCard value={8} label='Restoranda Tabldot' variant='dine-in' />
        </StatsGrid>
      </div>

      {/* Daily Cards */}
      <div className='u-card-group__list'>
        {dailyMealHistory.map((meal, index) => (
          <MealCard key={index} meal={meal} />
        ))}
      </div>
    </>
  );
};

export default MonthlyReportPage;
