import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout, setUser } from "@/features/auth/store/authSlice";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import MealHistoryCard from "../../components/MealHistoryCard/MealHistoryCard";
import LogoutButton from "@/components/common/LogoutButton/LogoutButton";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import { ReactComponent as CopyIcon } from "@/assets/icons/copy-icon.svg";
import Toast from "@/components/common/Toast/Toast.jsx";
import { api } from "@/utils/api";
import "./ProfilePage.scss";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [toastMessage, setToastMessage] = useState("");

  const handleLogout = () => {
    dispatch(logout());
  };

  // Derived values
  const companyCode = user?.companyCode || user?.company?.code;
  const contractedRestaurant = user?.restaurantName || user?.restaurant?.name;

  // handle copy
  const handleCopyCode = () => {
    if (!companyCode) return;
    setToastMessage("Kopyalandı");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(String(companyCode)).catch(() => {});
    }
  };

  const handleFeedbackClick = () => {
    window.open(
      "mailto:support@exaple.com?subject=Geri%20Bildirim",
      "_blank"
    );
  };

    // Eksik şirket bilgilerini API'den tamamlama
  useEffect(() => {
    if (!user?.companyCode || !user?.companyName) {
      (async () => {
        try {
          const response = await api.get("/getUserInfo");
          if (response.data && response.data.user) {
            dispatch(setUser(response.data.user));
          }
        } catch (err) {
          console.error("getUserInfo error:", err);
        }
      })();
    }
  }, [user, dispatch]);

  // mock meal history data
  const mealHistory = [
    {
      date: "2024-03-20",
      type: "Lokantada",
      restaurant: "Bereket Sofrası",
      time: "12:30",
    },
    {
      date: "2024-03-19",
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
      date: "2024-03-18",
      type: "Sipariş",
      restaurant: "Bereket Sofrası",
      time: "12:15",
      items: ["Ezogelin Çorbası", "Tavuk Şiş", "Bulgur Pilavı", "Cacık"],
    },
  ];

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
          <h2>{user?.name}</h2>
          <p className="subtitle">{user?.email}</p>
        </div>

        <div className="profile-section">
          <h3>Şirket Bilgileri</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Şirket</span>
              <span className="value">
                {user?.companyName || "Belirtilmemiş"}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Şirket Kodu</span>
              <div className="value-wrapper">
                <span className="value">{companyCode || "Belirtilmemiş"}</span>
                {companyCode && (
                  <button
                    type="button"
                    className="copy-button"
                    aria-label="Şirket kodunu kopyala"
                    title="Kopyala"
                    onClick={handleCopyCode}
                  >
                    <CopyIcon width={16} height={16} className="icon" />
                  </button>
                )}
              </div>
            </div>
            <div className="info-item">
              <span className="label">Anlaşmalı Restoran</span>
              <span className="value">
                {contractedRestaurant || "Belirtilmemiş"}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Kişisel Bilgiler</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Ad Soyad</span>
              <span className="value">
                {user?.name}
              </span>
            </div>
            <div className="info-item">
              <span className="label">E-posta</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Telefon</span>
              <span className="value">{user?.phoneNumber || "Belirtilmemiş"}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3>Yemek Geçmişi</h3>
            <button
              className="view-all-button"
              onClick={() => navigate("/reports")}
            >
              Tümünü Gör
            </button>
          </div>
          <div className="meal-history">
            {mealHistory.map((meal, index) => (
              <MealHistoryCard key={index} meal={meal} />
            ))}
          </div>
        </div>

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

export default ProfilePage;
