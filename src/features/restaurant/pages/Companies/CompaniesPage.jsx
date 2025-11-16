import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import CustomDropdown from "@/common/components/CustomDropdown/CustomDropdown";
import SearchBar from "@/common/components/SearchBar/SearchBar";
import Badge from "@/common/components/Badge/Badge";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import "./CompaniesPage.scss";

// MVP Mock: Firms derived from ReportsPage mock shape
const mockCompanies = [
  {
    id: 1,
    companyName: "Hekimoğlu CNC",
    siteId: 3,
    siteName: "Mermerciler Sanayi Sitesi",
  },
  {
    id: 2,
    companyName: "Lokman Yazılım A.Ş.",
    siteId: 2,
    siteName: "Eskoop Sanayi Sitesi",
  },
  {
    id: 3,
    companyName: "Deneme Yazılım A.Ş.",
    siteId: 1,
    siteName: "Sefaköy Sanayi Sitesi",
  },
  {
    id: 4,
    companyName: "İsin Bulamadım A.Ş.",
    siteId: 1,
    siteName: "Sefaköy Sanayi Sitesi",
  },
  {
    id: 5,
    companyName: "Yeni Firma A.Ş.",
    siteId: 2,
    siteName: "Eskoop Sanayi Sitesi",
  },
  {
    id: 6,
    companyName: "Katık Metal",
    siteId: 3,
    siteName: "Mermerciler Sanayi Sitesi",
  },
  {
    id: 7,
    companyName: "Kestane Yazılım",
    siteId: 2,
    siteName: "Eskoop Sanayi Sitesi",
  },
];

const siteOptions = [
  { value: "all", label: "Tüm Siteler" },
  { value: "1", label: "Sefaköy Sanayi Sitesi" },
  { value: "2", label: "Eskoop Sanayi Sitesi" },
  { value: "3", label: "Mermerciler Sanayi Sitesi" },
];

const CompaniesPage = () => {
  const [selectedSite, setSelectedSite] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const currentYear = String(new Date().getFullYear());

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase("tr-TR");
    return mockCompanies
      .filter((c) =>
        selectedSite === "all"
          ? true
          : String(c.siteId) === String(selectedSite)
      )
      .filter((c) => c.companyName.toLocaleLowerCase("tr-TR").includes(term))
      .sort((a, b) => a.companyName.localeCompare(b.companyName, "tr"));
  }, [selectedSite, searchTerm]);

  return (
    <>
      <DetailPageHeader title='Tüm Firmalar' />

      <div className='companies-content'>
        <div className='filters'>
          <CustomDropdown
            className='site-filter'
            options={siteOptions}
            selectedValue={selectedSite}
            onSelect={setSelectedSite}
            placeholder='Sanayi sitesi seçiniz'
          />
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder='Firma adı ara...'
          />
        </div>

        <div className='companies-list' role='list'>
          {filtered.map((c) => (
            <button
              key={c.id}
              className='company-item'
              type='button'
              onClick={() =>
                navigate(`/restaurant/reports/${c.id}/${currentYear}`, {
                  state: { companyName: c.companyName },
                })
              }
            >
              <div className='content'>
                <span className='name'>{c.companyName}</span>
                <Badge className='site-badge' tone='neutral'>
                  {c.siteName}
                </Badge>
              </div>
              <ChevronRightIcon className='chevron' />
            </button>
          ))}

          {filtered.length === 0 && (
            <div className='u-empty-state'>Arama sonucuna uygun firma bulunamadı.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompaniesPage;
