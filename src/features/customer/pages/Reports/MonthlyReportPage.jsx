import { useNavigate, useParams } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import CustomDropdown from "@/common/components/CustomDropdown/CustomDropdown";
import MealCard from "@/features/customer/components/MealCard/MealCard";
import StatCard from "@/common/components/Stats/StatCard/StatCard";
import StatsGrid from "@/common/components/Stats/StatsGrid/StatsGrid";
import "./MonthlyReportPage.scss";

const MonthlyReportPage = () => {
  const navigate = useNavigate();
  const { year: yearParam, month: monthParam } = useParams();

  const currentDate = new Date();
  const currentYearStr = currentDate.getFullYear().toString();
  const currentMonthStr = (currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0");

  const selectedYear = yearParam || currentYearStr;
  const selectedMonth = monthParam || currentMonthStr;

  // Mock data - Bu kısım selectedMonth/selectedYear değerlerine göre filtrelenmeli.
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

  const monthOptions = [
    { value: "01", label: "Ocak" },
    { value: "02", label: "Şubat" },
    { value: "03", label: "Mart" },
    { value: "04", label: "Nisan" },
    { value: "05", label: "Mayıs" },
    { value: "06", label: "Haziran" },
    { value: "07", label: "Temmuz" },
    { value: "08", label: "Ağustos" },
    { value: "09", label: "Eylül" },
    { value: "10", label: "Ekim" },
    { value: "11", label: "Kasım" },
    { value: "12", label: "Aralık" },
  ];

  const yearOptions = [
    { value: "2026", label: "2026" },
    { value: "2025", label: "2025" },
  ];

  const handleMonthChange = (value) => {
    navigate(`/reports/${selectedYear}/${value}`);
  };

  const handleYearChange = (value) => {
    navigate(`/reports/${value}/${selectedMonth}`);
  };

  return (
    <>
      <DetailPageHeader title='Yemek Geçmişi' />
      <div className='monthly-report__controls'>
        <div className='monthly-report__periods'>
          <CustomDropdown
            options={monthOptions}
            selectedValue={selectedMonth}
            onSelect={handleMonthChange}
          />
          <CustomDropdown
            options={yearOptions}
            selectedValue={selectedYear}
            onSelect={handleYearChange}
          />
        </div>
      </div>

      {/* Period Summary */}
      <div className='monthly-report__stats'>
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
