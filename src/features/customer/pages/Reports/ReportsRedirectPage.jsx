import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/common/Loading/Loading";

/**
 * Kullanıcıyı /reports yolundan mevcut yıl ve ayın
 * detaylı rapor sayfasına yönlendirir.
 * Örn: /reports -> /reports/2024/07
 */
const ReportsRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Ay 0'dan başladığı için +1 ve 2 haneli format

    navigate(`/reports/${year}/${month}`, { replace: true });
  }, [navigate]);

  // Yönlendirme olurken kullanıcıya bir yüklenme durumu gösterilir.
  return <Loading />;
};

export default ReportsRedirectPage;
