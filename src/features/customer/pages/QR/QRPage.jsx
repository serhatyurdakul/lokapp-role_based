import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "@/common/components/PageHeader/PageHeader";
import "./QRPage.scss";
import { ReactComponent as QrIcon } from "@/assets/icons/qr-outline.svg";
import { useNavigate } from "react-router-dom";

const QRPage = () => {
  const [scanStatus, setScanStatus] = useState("waiting"); // waiting, scanning, success, error
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const isCompanyEmp = Number(user?.isCompanyEmployee) === 1;
  const restaurantId = user ? (isCompanyEmp ? user?.contractedRestaurantId : user?.restaurantId) : null;
  const companyId = user ? user.companyId : null;
  const userId = user ? user.id : null;
  const storageKey =
    userId && restaurantId && companyId
      ? `lokapp:lastOrders:${userId}:${restaurantId}:${companyId}`
      : null;

  const restaurantName =
    user?.restaurantName || user?.restaurant?.name || user?.contractedRestaurantName;

  // On successful scan, persist a "Restoranda" card and navigate to Home with toast
  useEffect(() => {
    if (scanStatus !== "success") return;

    try {
      if (storageKey && restaurantName) {
        const now = new Date();
        const time = now.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const newCard = {
          date: now.toISOString(),
          type: "Restoranda",
          restaurant: restaurantName,
          time,
        };
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : [];
        const next = Array.isArray(parsed) ? [newCard, ...parsed] : [newCard];
        localStorage.setItem(storageKey, JSON.stringify(next));
      }
    } catch (_e) {}

    try {
      navigate("/", {
        state: { toast: "Restoranda kaydınız alındı" },
        replace: true,
      });
    } catch (_e) {}
  }, [scanStatus, storageKey, restaurantName, navigate]);

  return (
    <div>
      <PageHeader title='QR Okut' />

      <div className='qr-content'>
        <div className='qr-steps'>
          <div className='step'>
            <span className='step-number'>1</span>
            <p>QR kodu kameraya gösterin</p>
          </div>
          <div className='step'>
            <span className='step-number'>2</span>
            <p>Onay mesajını bekleyin</p>
          </div>
        </div>

        <div className={`qr-scanner-container ${scanStatus}`}>
          <div className='qr-scanner'>
            {/* TODO: QR scanner component goes here */}
            <div className='qr-placeholder'>
              <QrIcon />
              <p>QR Tarayıcı Hazırlanıyor...</p>
            </div>
          </div>

          <div className='scan-status'>
            {scanStatus === "waiting" && (
              <p className='status-message'>Kamera hazırlanıyor...</p>
            )}
            {scanStatus === "scanning" && (
              <p className='status-message'>QR kodu taranıyor...</p>
            )}
            {scanStatus === "success" && (
              <div className='status-success'>
                <svg viewBox='0 0 24 24' width='24' height='24'>
                  <path
                    d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'
                    fill='currentColor'
                  />
                </svg>
                <p>Yemek kaydınız alındı</p>
              </div>
            )}
            {scanStatus === "error" && (
              <div className='status-error'>
                <svg viewBox='0 0 24 24' width='24' height='24'>
                  <path
                    d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z'
                    fill='currentColor'
                  />
                </svg>
                <p>Bir hata oluştu. Tekrar deneyin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPage;
