import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import CustomDropdown from "@/common/components/CustomDropdown/CustomDropdown";
import SearchBar from "@/common/components/SearchBar/SearchBar";
import ReportSummaryCard from "@/common/components/ReportCards/ReportSummaryCard/ReportSummaryCard";
import StatCard from "@/common/components/Stats/StatCard/StatCard";
import StatsGrid from "@/common/components/Stats/StatsGrid/StatsGrid";
import "./ReportsPage.scss";

// Gerçek API verilerine göre oluşturulan mock veriler
const mockCompanies = [
  {
    id: 1,
    name: "Hekimoğlu CNC",
    site: "Mermerciler Sanayi Sitesi",
    siteId: 3,
    totalMeals: 150,
    dineIn: 90,
    delivery: 60,
  },
  {
    id: 2,
    name: "Lokman Yazılım A.Ş.",
    site: "Eskoop Sanayi Sitesi",
    siteId: 2,
    totalMeals: 95,
    dineIn: 40,
    delivery: 55,
  },
  {
    id: 3,
    name: "Deneme Yazılım A.Ş.",
    site: "Sefaköy Sanayi Sitesi",
    siteId: 1,
    totalMeals: 120,
    dineIn: 70,
    delivery: 50,
  },
  {
    id: 4,
    name: "İsin Bulamadım A.Ş.",
    site: "Sefaköy Sanayi Sitesi",
    siteId: 1,
    totalMeals: 90,
    dineIn: 55,
    delivery: 35,
  },
  {
    id: 5,
    name: "Yeni Firma A.Ş.",
    site: "Eskoop Sanayi Sitesi",
    siteId: 2,
    totalMeals: 75,
    dineIn: 30,
    delivery: 45,
  },
  {
    id: 6,
    name: "Katık Metal",
    site: "Mermerciler Sanayi Sitesi",
    siteId: 3,
    totalMeals: 0,
    dineIn: 0,
    delivery: 0,
  },
  {
    id: 7,
    name: "Kestane Yazılım",
    site: "Eskoop Sanayi Sitesi",
    siteId: 2,
    totalMeals: 0,
    dineIn: 0,
    delivery: 0,
  },
];

// Ters kronolojik yıl seçenekleri (2025-2020)
const yearOptions = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
];

// Ters kronolojik ay seçenekleri
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
].reverse();

// Gerçek API verilerine göre oluşturulan sanayi sitesi seçenekleri
const siteOptions = [
  { value: "all", label: "Tüm Siteler" },
  { value: "1", label: "Sefaköy Sanayi Sitesi" },
  { value: "2", label: "Eskoop Sanayi Sitesi" },
  { value: "3", label: "Mermerciler Sanayi Sitesi" },
];

// not: pasif firma mantığı kaldırıldı; yalnızca aktif şirketler listelenir

const RestaurantReportsPage = () => {
  // Ters kronolojik olarak içinde bulunulan yıl ve ay seçili olarak gelir
  const currentDate = new Date();
  const currentYearStr = currentDate.getFullYear().toString();
  const currentMonthStr = (currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0");

  const [selectedYear, setSelectedYear] = useState(currentYearStr);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [selectedSite, setSelectedSite] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Router
  const navigate = useNavigate();

  // Aylık özet istatistikler (mock veri)
  const monthlySummary = useMemo(() => {
    const filtered = mockCompanies.filter((company) => {
      const matchesSite =
        selectedSite === "all" || company.siteId.toString() === selectedSite;
      return matchesSite;
    });

    const totalMeals = filtered.reduce(
      (sum, company) => sum + company.totalMeals,
      0
    );
    const dineIn = filtered.reduce((sum, company) => sum + company.dineIn, 0);
    const delivery = filtered.reduce(
      (sum, company) => sum + company.delivery,
      0
    );
    const companyCount = filtered.length;

    return { totalMeals, dineIn, delivery, companyCount };
  }, [selectedSite]);

  // Aktif firmaları listeleyen dizi
  const activeCompanies = useMemo(() => {
    const filtered = mockCompanies.filter((company) => {
      const matchesSearch = company.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSite =
        selectedSite === "all" || company.siteId.toString() === selectedSite;
      return matchesSearch && matchesSite;
    });

    const active = filtered.filter((c) => c.totalMeals > 0);
    active.sort((a, b) => b.totalMeals - a.totalMeals);
    return active;
  }, [searchTerm, selectedSite]);

  const selectedMonthLabel = useMemo(() => {
    const monthOption = monthOptions.find(
      (option) => option.value === selectedMonth
    );
    return monthOption ? monthOption.label : "";
  }, [selectedMonth]);

  const selectedSiteLabel = useMemo(() => {
    const siteOption = siteOptions.find(
      (option) => option.value === selectedSite
    );
    return siteOption
      ? siteOption.label
      : siteOptions.find((option) => option.value === "all")?.label || "";
  }, [selectedSite]);

  const summaryContext = selectedMonthLabel
    ? `${selectedMonthLabel} ${selectedYear} · ${selectedSiteLabel}`
    : `${selectedYear} · ${selectedSiteLabel}`;

  return (
    <>
      <DetailPageHeader title='Firma Raporları' />
      <div className='reports-content'>
        {/* Aylık Özet İstatistikler */}
        <div className='reports-summary'>
          <div className='summary-controls'>
            <div className='period-dropdowns'>
              <CustomDropdown
                options={monthOptions}
                selectedValue={selectedMonth}
                onSelect={setSelectedMonth}
              />
              <CustomDropdown
                options={yearOptions}
                selectedValue={selectedYear}
                onSelect={setSelectedYear}
              />
            </div>
            <div className='site-dropdown'>
              <CustomDropdown
                className='site-filter'
                options={siteOptions}
                selectedValue={selectedSite}
                onSelect={setSelectedSite}
                placeholder='Sanayi sitesi seçiniz'
              />
            </div>
          </div>
          <p className='summary-context'>{summaryContext}</p>
          <StatsGrid>
            <StatCard
              value={monthlySummary.totalMeals}
              label='Toplam Tabldot'
              variant='total'
            />
            <StatCard
              value={monthlySummary.delivery}
              label='Siparişle Tabldot'
              variant='delivery'
            />
            <StatCard
              value={monthlySummary.dineIn}
              label='Restoranda Tabldot'
              variant='dine-in'
            />
            <StatCard
              value={monthlySummary.companyCount}
              label='Firma'
              variant='companies'
            />
          </StatsGrid>
        </div>
        <div className='search-bar-container'>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder='Firma adı ara...'
          />
        </div>

        {/* Firma Listesi */}
        <div className='reports-list'>
          {activeCompanies.length > 0 ? (
            <>
              {activeCompanies.map((company) => (
                <ReportSummaryCard
                  key={company.id}
                  title={company.name}
                  total={company.totalMeals}
                  delivery={company.delivery}
                  dineIn={company.dineIn}
                  siteName={company.site}
                  onClick={() =>
                    navigate(
                      `/restaurant/reports/${company.id}/${selectedYear}`,
                      { state: { companyName: company.name } }
                    )
                  }
                />
              ))}
            </>
          ) : (
            <div className='u-empty-state'>Arama sonucuna uygun firma bulunamadı.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default RestaurantReportsPage;
