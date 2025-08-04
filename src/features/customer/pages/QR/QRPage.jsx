import { useState } from "react";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import "./QRPage.scss";
import { ReactComponent as QrIcon } from "@/assets/icons/qr.svg";

const QRPage = () => {
  const [scanStatus, setScanStatus] = useState("waiting"); // waiting, scanning, success, error

  return (
    <div>
      <PageHeader title="QR Doğrulama" />

      <div className="qr-content">
        <div className="qr-steps">
          <div className="step">
            <span className="step-number">1</span>
            <p>QR kodu kameraya gösterin</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <p>Onay mesajını bekleyin</p>
          </div>
        </div>

        <div className={`qr-scanner-container ${scanStatus}`}>
          <div className="qr-scanner">
            {/* TODO: QR scanner component goes here */}
            <div className="qr-placeholder">
              <QrIcon />
              <p>QR Tarayıcı Hazırlanıyor...</p>
            </div>
          </div>

          <div className="scan-status">
            {scanStatus === "waiting" && (
              <p className="status-message">Kamera hazırlanıyor...</p>
            )}
            {scanStatus === "scanning" && (
              <p className="status-message">QR kodu taranıyor...</p>
            )}
            {scanStatus === "success" && (
              <div className="status-success">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
                <p>Yemek kaydınız alındı</p>
              </div>
            )}
            {scanStatus === "error" && (
              <div className="status-error">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                    fill="currentColor"
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
