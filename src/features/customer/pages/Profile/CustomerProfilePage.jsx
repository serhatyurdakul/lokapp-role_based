import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout, setUser } from "@/features/auth/store/authSlice";
import PageHeader from "@/common/components/PageHeader/PageHeader";
import MealCard from "@/features/customer/components/MealCard/MealCard";
import LogoutButton from "@/common/components/LogoutButton/LogoutButton";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import { ReactComponent as CopyIcon } from "@/assets/icons/copy-icon.svg";
import Toast from "@/common/components/Toast/Toast.jsx";
import ProfileLayout, {
  ProfileHeader,
  ProfileSection,
  ProfileInfoList,
  ProfileInfoItem,
  ProfileSettingsList,
  ProfileSettingsItem,
} from "@/common/components/ProfileLayout/ProfileLayout";
import { api } from "@/utils/api";

const CustomerProfilePage = () => {
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

      <ProfileLayout>
        <ProfileHeader
          avatarText={
            user?.name
              ? user.name.trim().charAt(0).toLocaleUpperCase("tr-TR")
              : ""
          }
          title={user?.name || "Belirtilmemiş"}
          subtitle={
            user?.email ? (
              <a href={`mailto:${user.email}`}>{user.email}</a>
            ) : (
              "Belirtilmemiş"
            )
          }
        />

        <ProfileSection title='Firma Bilgileri'>
          <ProfileInfoList>
            <ProfileInfoItem label='Firma'>
              {user?.companyName || "Belirtilmemiş"}
            </ProfileInfoItem>
            <ProfileInfoItem label='Firma Kodu'>
              <div className='profile__value-wrapper'>
                <span>{companyCode || "Belirtilmemiş"}</span>
                {companyCode && (
                  <button
                    type='button'
                    className='profile__copy-button'
                    aria-label='Firma kodunu kopyala'
                    title='Kopyala'
                    onClick={handleCopyCode}
                  >
                    <CopyIcon className='icon' />
                  </button>
                )}
              </div>
            </ProfileInfoItem>
            <ProfileInfoItem label='Anlaşmalı Restoran'>
              {contractedRestaurant || "Belirtilmemiş"}
            </ProfileInfoItem>
          </ProfileInfoList>
        </ProfileSection>

        <ProfileSection title='Kullanıcı Bilgileri'>
          <ProfileInfoList>
            <ProfileInfoItem label='Telefon'>
              {user?.phoneNumber ? (
                <a href={`tel:${user.phoneNumber}`}>{user.phoneNumber}</a>
              ) : (
                "Belirtilmemiş"
              )}
            </ProfileInfoItem>
          </ProfileInfoList>
        </ProfileSection>

        <ProfileSection
          title='Yemek Geçmişi'
          action={
            <button
              className='profile__view-all-button'
              onClick={() => navigate("/reports")}
            >
              Tümünü Gör
            </button>
          }
        >
          <div className='u-card-group__list'>
            {mealHistory.map((meal, index) => (
              <MealCard key={index} meal={meal} />
            ))}
          </div>
        </ProfileSection>

        <ProfileSection title='Ayarlar'>
          <ProfileSettingsList>
            <ProfileSettingsItem
              label='Profili Düzenle'
              icon={<ChevronRightIcon />}
            />
            <ProfileSettingsItem
              label='Bildirim Tercihleri'
              icon={<ChevronRightIcon />}
            />
            <ProfileSettingsItem
              label='Yardım & Destek'
              icon={<ChevronRightIcon />}
            />
            <ProfileSettingsItem
              label='Geri Bildirim Gönder'
              icon={<ChevronRightIcon />}
              onClick={handleFeedbackClick}
            />
          </ProfileSettingsList>
        </ProfileSection>

        <LogoutButton onClick={handleLogout} />
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </ProfileLayout>
    </>
  );
};

export default CustomerProfilePage;
