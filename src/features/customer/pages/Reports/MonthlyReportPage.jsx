import { useNavigate, useParams } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import MealCard from "@/features/customer/components/MealCard/MealCard";
import SummaryStatCard from "@/common/components/ReportCards/SummaryStatCard/SummaryStatCard";
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
      <div className='period-navigation'>
        <h2 className='current-period'>
          {currentMonthName} {year}
          <button
            className='period-action'
            onClick={() => navigate(`/reports/${year}`)}
          >
            Tüm Aylar →
          </button>
        </h2>
      </div>

      {/* Period Summary */}
      <div className='period-summary'>
        <div className='summary-grid'>
          <SummaryStatCard value={23} label='Toplam Tabldot' variant='total' />
          <SummaryStatCard value={15} label='Siparişle Tabldot' variant='delivery' />
          <SummaryStatCard value={8} label='Restoranda Tabldot' variant='dine-in' />
        </div>
      </div>

      {/* Daily Cards */}
      <div className='meal-history'>
        {dailyMealHistory.map((meal, index) => (
          <MealCard key={index} meal={meal} />
        ))}
      </div>
    </>
  );
};

export default MonthlyReportPage;
