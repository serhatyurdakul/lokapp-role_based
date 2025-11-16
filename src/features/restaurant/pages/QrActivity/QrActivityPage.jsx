import { useMemo, useState } from "react";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import SearchBar from "@/common/components/SearchBar/SearchBar";
import EmptyState from "@/common/components/StateMessage/EmptyState";
import EmployeeMealCard from "@/common/components/ReportCards/EmployeeMealCard/EmployeeMealCard";
import "./QrActivityPage.scss";

const mockQrScans = [
  {
    id: "qr-1",
    employee: "Ayşe Yılmaz",
    company: "Mono Metal",
    scannedAt: "2024-09-08T12:05:00+03:00",
  },
  {
    id: "qr-2",
    employee: "Mehmet Demir",
    company: "Katık Metal",
    scannedAt: "2024-09-08T12:03:00+03:00",
  },
  {
    id: "qr-3",
    employee: "Zeynep Kaya",
    company: "Lokman Yazılım A.Ş.",
    scannedAt: "2024-09-08T12:01:00+03:00",
  },
  {
    id: "qr-4",
    employee: "Ali Çelik",
    company: "Hekimoğlu CNC",
    scannedAt: "2024-09-08T11:58:00+03:00",
  },
  {
    id: "qr-5",
    employee: "Eda Gür",
    company: "Denge Kalıp",
    scannedAt: "2024-09-08T11:55:00+03:00",
  },
  {
    id: "qr-6",
    employee: "Serkan Usta",
    company: "İleri Döküm",
    scannedAt: "2024-09-08T11:52:00+03:00",
  },
  {
    id: "qr-7",
    employee: "Gizem Şahin",
    company: "Cihan Kalıp",
    scannedAt: "2024-09-08T11:50:00+03:00",
  },
  {
    id: "qr-8",
    employee: "Emre Korkmaz",
    company: "Mono Metal",
    scannedAt: "2024-09-08T12:02:00+03:00",
  },
  {
    id: "qr-9",
    employee: "Sevgi Er",
    company: "Katık Metal",
    scannedAt: "2024-09-08T11:59:00+03:00",
  },
  {
    id: "qr-10",
    employee: "Onur Baş",
    company: "Lokman Yazılım A.Ş.",
    scannedAt: "2024-09-08T11:53:00+03:00",
  },
  {
    id: "qr-11",
    employee: "Derya Koç",
    company: "Hekimoğlu CNC",
    scannedAt: "2024-09-08T12:18:00+03:00",
  },
  {
    id: "qr-12",
    employee: "Ufuk Tan",
    company: "Denge Kalıp",
    scannedAt: "2024-09-08T12:08:00+03:00",
  },
  {
    id: "qr-13",
    employee: "Aslı Tunç",
    company: "İleri Döküm",
    scannedAt: "2024-09-08T11:56:00+03:00",
  },
  {
    id: "qr-14",
    employee: "Kerem Yurt",
    company: "Cihan Kalıp",
    scannedAt: "2024-09-08T11:47:00+03:00",
  },
];

const formatTime = (isoString) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (_error) {
    return "";
  }
};

const QrActivityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const orderedScans = useMemo(() => {
    return [...mockQrScans]
      .map((scan) => ({
        ...scan,
        time: formatTime(scan.scannedAt),
      }))
      .sort(
        (a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
      );
  }, []);

  const filteredScans = useMemo(() => {
    if (!searchTerm.trim()) {
      return orderedScans;
    }
    const lower = searchTerm.toLocaleLowerCase("tr-TR");
    return orderedScans.filter((scan) => {
      const employeeMatch = scan.employee.toLocaleLowerCase("tr-TR").includes(lower);
      const companyMatch = scan.company.toLocaleLowerCase("tr-TR").includes(lower);
      return employeeMatch || companyMatch;
    });
  }, [orderedScans, searchTerm]);

  const hasScans = orderedScans.length > 0;
  const hasResults = filteredScans.length > 0;

  return (
    <div className='qr-activity-page'>
      <DetailPageHeader title='QR Okutanlar' />

      <div className='qr-activity-meta'>
        <span className='qr-activity-count'>
          Bugün {orderedScans.length} kişi QR okuttu.
        </span>
      </div>

      <div className='qr-activity-search'>
        <SearchBar
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onClear={() => setSearchTerm("")}
          placeholder='Kişi veya firma ara...'
        />
      </div>

      {!hasScans ? (
        <EmptyState message='Henüz kimse QR okutmadı.' />
      ) : hasResults ? (
        <div className='qr-activity-list'>
          {filteredScans.map((scan) => (
            <EmployeeMealCard
              key={scan.id}
              meal={{
                employee: scan.employee,
                company: scan.company,
                type: "Restoranda",
                time: scan.time,
              }}
              showType={false}
            />
          ))}
        </div>
      ) : (
        <div className='u-empty-state'>Aramanıza uygun kişi veya firma kaydı bulunamadı.</div>
      )}
    </div>
  );
};

export default QrActivityPage;
