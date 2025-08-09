import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/store/authSlice";
import { fetchRestaurantInfo } from "@/features/restaurant/store/restaurantInfoSlice";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import LogoutButton from "@/components/common/LogoutButton/LogoutButton";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import { ReactComponent as ChartBarIcon } from "@/assets/icons/chart-bar.svg";
import { ReactComponent as CopyIcon } from "@/assets/icons/copy-icon.svg";
import Toast from "@/components/common/Toast/Toast.jsx";
import "./ProfilePage.scss";

const RestaurantProfilePage = () => {
  const [toastMessage, setToastMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { info: restaurantInfo, isLoading: infoLoading } = useSelector(
    (state) => state.restaurantInfo
  );

  useEffect(() => {
    if (user?.restaurantId && !restaurantInfo && !infoLoading) {
      dispatch(fetchRestaurantInfo(user.restaurantId));
    }
  }, [dispatch, user?.restaurantId, restaurantInfo, infoLoading]);

    const codeValue =
    restaurantInfo?.id ||
    user?.restaurant?.code ||
    user?.restaurant?.id;

  const handleCopyCode = () => {
    if (!codeValue) return;
    setToastMessage("Kopyalandı");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(String(codeValue)).catch(() => {});
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleReportsClick = () => {
    navigate("/reports");
  };

  const handleFeedbackClick = () => {
    window.open("mailto:support@exaple.com?subject=Geri%20Bildirim", "_blank");
  };

  return (
    <>
      <DetailPageHeader title="Profil" backPath={-1} />

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>
              {user?.name
                ? user.name.trim().charAt(0).toLocaleUpperCase("tr-TR")
                : ""}
            </span>
          </div>
          <h2>
            {user?.name} {user?.surname}
          </h2>
          <p className="subtitle">{user?.email}</p>
        </div>

        <div className="profile-section">
          <h3>Restoran Bilgileri</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Restoran Adı</span>
              <span className="value">
                {restaurantInfo?.name || user?.restaurant?.name || "Belirtilmemiş"}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Telefon</span>
              <span className="value">{restaurantInfo?.phoneNumber || user?.phone || "Belirtilmemiş"}</span>
            </div>
            <div className="info-item">
              <span className="label">Adres</span>
              <span className="value">
                {restaurantInfo?.address || user?.restaurant?.address || "Belirtilmemiş"}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Restoran Kodu</span>
              <div className="value-wrapper">
                <span className="value">{codeValue || "Belirtilmemiş"}</span>
                <button
                  type="button"
                  className="copy-button"
                  aria-label="Restoran kodunu kopyala"
                  title="Kopyala"
                  onClick={handleCopyCode}
                >
                  <CopyIcon width={16} height={16} className="icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>İletişim Bilgileri</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Ad Soyad</span>
              <span className="value">
                {user?.name} {user?.surname}
              </span>
            </div>
            <div className="info-item">
              <span className="label">E-posta</span>
              <span className="value">{user?.email || restaurantInfo?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Telefon</span>
              <span className="value">{restaurantInfo?.phoneNumber || user?.phone || "Belirtilmemiş"}</span>
            </div>
          </div>
        </div>

        <button className="reports-button" onClick={handleReportsClick}>
          <div className="reports-button-content">
            <ChartBarIcon width={24} height={24} className="reports-icon" />
            <span>Raporlar</span>
          </div>
          <ChevronRightIcon width={20} height={20} className="icon" />
        </button>

        <div className="profile-section">
          <h3>Ayarlar</h3>
          <div className="settings-list">
            <button className="settings-item">
              <span>Profili Düzenle</span>
              <ChevronRightIcon width={20} height={20} className="icon" />
            </button>
            <button className="settings-item">
              <span>Bildirim Tercihleri</span>
              <ChevronRightIcon width={20} height={20} className="icon" />
            </button>
            <button className="settings-item">
              <span>Çalışan Yetkilendirmeleri</span>
              <ChevronRightIcon width={20} height={20} className="icon" />
            </button>
            <button className="settings-item">
              <span>Yardım & Destek</span>
              <ChevronRightIcon width={20} height={20} className="icon" />
            </button>
            <button className="settings-item" onClick={handleFeedbackClick}>
              <span>Geri Bildirim Gönder</span>
              <ChevronRightIcon width={20} height={20} className="icon" />
            </button>
          </div>
        </div>

        <LogoutButton onClick={handleLogout} />
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </>
  );
};

export default RestaurantProfilePage;
