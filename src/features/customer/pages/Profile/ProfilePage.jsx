import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout, setUser } from "@/features/auth/store/authSlice";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import MealHistoryCard from "@/features/customer/components/MealHistoryCard/MealHistoryCard";
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
  const contractedRestaurant =
    user?.contractedRestaurantName ||
    user?.restaurantName ||
    user?.restaurant?.name;

  // handle copy
  const handleCopyCode = () => {
    if (!companyCode) return;
    setToastMessage("Kopyalandı");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(String(companyCode)).catch(() => {});
    }
  };

  const handleFeedbackClick = () => {
    window.open("mailto:support@exaple.com?subject=Geri%20Bildirim", "_blank");
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
      type: "Restoranda",
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
      <PageHeader title='Hesap' />

      <div className='profile-content'>
        <div className='profile-header'>
          <div className='profile-avatar'>
            <span>
              {user?.name
                ? user.name.trim().charAt(0).toLocaleUpperCase("tr-TR")
                : ""}
            </span>
          </div>
          <div className='profile-text'>
            <h2>{user?.name}</h2>
            <p className='subtitle'>
              {user?.email ? (
                <a href={`mailto:${user.email}`}>{user.email}</a>
              ) : (
                "Belirtilmemiş"
              )}
            </p>
          </div>
        </div>

        <div className='profile-section'>
          <h3>Firma Bilgileri</h3>
          <div className='info-list'>
            <div className='info-item'>
              <span className='label'>Firma</span>
              <span className='value'>
                {user?.companyName || "Belirtilmemiş"}
              </span>
            </div>
            <div className='info-item'>
              <span className='label'>Firma Kodu</span>
              <div className='value-wrapper'>
                <span className='value'>{companyCode || "Belirtilmemiş"}</span>
                {companyCode && (
                  <button
                    type='button'
                    className='copy-button'
                    aria-label='Firma kodunu kopyala'
                    title='Kopyala'
                    onClick={handleCopyCode}
                  >
                    <CopyIcon width={16} height={16} className='icon' />
                  </button>
                )}
              </div>
            </div>
            <div className='info-item'>
              <span className='label'>Anlaşmalı Restoran</span>
              <span className='value'>
                {contractedRestaurant || "Belirtilmemiş"}
              </span>
            </div>
          </div>
        </div>

        <div className='profile-section'>
          <h3>Kullanıcı Bilgileri</h3>
          <div className='info-list'>
            <div className='info-item'>
              <span className='label'>Telefon</span>
              <span className='value'>
                {user?.phoneNumber ? (
                  <a href={`tel:${user.phoneNumber}`}>{user.phoneNumber}</a>
                ) : (
                  "Belirtilmemiş"
                )}
              </span>
            </div>
          </div>
        </div>

        <div className='profile-section'>
          <div className='section-header'>
            <h3>Yemek Geçmişi</h3>
            <button
              className='view-all-button'
              onClick={() => navigate("/reports")}
            >
              Tümünü Gör
            </button>
          </div>
          <div className='meal-history'>
            {mealHistory.map((meal, index) => (
              <MealHistoryCard key={index} meal={meal} />
            ))}
          </div>
        </div>

        <div className='profile-section'>
          <h3>Ayarlar</h3>
          <div className='settings-list'>
            <button className='settings-item'>
              <span>Profili Düzenle</span>
              <ChevronRightIcon className='icon' />
            </button>
            <button className='settings-item'>
              <span>Bildirim Tercihleri</span>
              <ChevronRightIcon className='icon' />
            </button>
            <button className='settings-item'>
              <span>Yardım & Destek</span>
              <ChevronRightIcon className='icon' />
            </button>
            <button className='settings-item' onClick={handleFeedbackClick}>
              <span>Geri Bildirim Gönder</span>
              <ChevronRightIcon className='icon' />
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
