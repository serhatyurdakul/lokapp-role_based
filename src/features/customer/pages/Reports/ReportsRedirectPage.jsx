import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/common/components/Loading/Loading";

/**
 * Kullanıcıyı /reports ve /reports/:year yolundan ilgili yılın
 * güncel ayına yönlendirir.
 * Örn: /reports -> /reports/2024/07, /reports/2024 -> /reports/2024/07
 */
const ReportsRedirectPage = () => {
  const navigate = useNavigate();
  const { year: yearParam } = useParams();

  useEffect(() => {
    const today = new Date();
    const year = yearParam || today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Ay 0'dan başladığı için +1 ve 2 haneli format

    navigate(`/reports/${year}/${month}`, { replace: true });
  }, [navigate, yearParam]);

  // Yönlendirme olurken kullanıcıya bir yüklenme durumu gösterilir.
  return <Loading />;
};

export default ReportsRedirectPage;
