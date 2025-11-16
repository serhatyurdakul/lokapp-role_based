import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/store/authSlice";
import { fetchRestaurantInfo } from "@/features/restaurant/store/restaurantInfoSlice";
import PageHeader from "@/common/components/PageHeader/PageHeader";
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

const RestaurantProfilePage = () => {
  const [toastMessage, setToastMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const { info: restaurantInfo, isLoading: infoLoading } = useSelector(
    (state) => state.restaurantInfo
  );

  useEffect(() => {
    if (user?.restaurantId && !restaurantInfo && !infoLoading) {
      dispatch(fetchRestaurantInfo(user.restaurantId));
    }
  }, [dispatch, user?.restaurantId, restaurantInfo, infoLoading]);

  useEffect(() => {
    const stateToast = location.state?.toast;
    if (stateToast) {
      setToastMessage(stateToast);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const codeValue =
    restaurantInfo?.id || user?.restaurant?.code || user?.restaurant?.id;

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

  const handleCompaniesClick = () => {
    navigate("/companies");
  };

  const orderCutoffTime =
    restaurantInfo?.orderCutoffTime || user?.restaurant?.orderCutoffTime || "11:00";

  const handleFeedbackClick = () => {
    window.open("mailto:support@exaple.com?subject=Geri%20Bildirim", "_blank");
  };

  const handleOrderSettingsClick = () => {
    navigate("/settings/order-cutoff");
  };

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
          title={`${user?.name || ""} ${user?.surname || ""}`.trim()}
          subtitle={
            user?.email ? (
              <a href={`mailto:${user.email}`}>{user.email}</a>
            ) : (
              "Belirtilmemiş"
            )
          }
        />

        <ProfileSection title='Restoran Bilgileri'>
          <ProfileInfoList>
            <ProfileInfoItem label='Restoran Adı'>
              {restaurantInfo?.name ||
                user?.restaurant?.name ||
                "Belirtilmemiş"}
            </ProfileInfoItem>
            <ProfileInfoItem label='Telefon'>
              {restaurantInfo?.phoneNumber ? (
                <a href={`tel:${restaurantInfo.phoneNumber}`}>
                  {restaurantInfo.phoneNumber}
                </a>
              ) : (
                "Belirtilmemiş"
              )}
            </ProfileInfoItem>
            <ProfileInfoItem label='Adres'>
              {restaurantInfo?.address ||
                user?.restaurant?.address ||
                "Belirtilmemiş"}
            </ProfileInfoItem>
            <ProfileInfoItem label='Restoran Kodu'>
              <div className='profile__valueWrapper'>
                <span>{codeValue || "Belirtilmemiş"}</span>
                <button
                  type='button'
                  className='profile__copyButton'
                  aria-label='Restoran kodunu kopyala'
                  title='Kopyala'
                  onClick={handleCopyCode}
                >
                  <CopyIcon className='icon' />
                </button>
              </div>
            </ProfileInfoItem>
          </ProfileInfoList>
        </ProfileSection>

        <ProfileSection title='Kullanıcı Bilgileri'>
          <ProfileInfoList>
            <ProfileInfoItem label='Telefon'>
              {user?.phone ? (
                <a href={`tel:${user.phone}`}>{user.phone}</a>
              ) : (
                "Belirtilmemiş"
              )}
            </ProfileInfoItem>
          </ProfileInfoList>
        </ProfileSection>

        <ProfileSection title='Raporlama'>
          <ProfileSettingsList>
            <ProfileSettingsItem
              label='Dönem Raporları'
              icon={<ChevronRightIcon />}
              onClick={handleReportsClick}
            />
            <ProfileSettingsItem
              label='Tüm Firmalar'
              icon={<ChevronRightIcon />}
              onClick={handleCompaniesClick}
            />
          </ProfileSettingsList>
        </ProfileSection>

        <ProfileSection title='Ayarlar'>
          <ProfileSettingsList>
            <ProfileSettingsItem
              label='Sipariş Kapanış Saati'
              secondary={orderCutoffTime}
              icon={<ChevronRightIcon />}
              onClick={handleOrderSettingsClick}
            />
            <ProfileSettingsItem
              label='Profili Düzenle'
              icon={<ChevronRightIcon />}
            />
            <ProfileSettingsItem
              label='Bildirim Tercihleri'
              icon={<ChevronRightIcon />}
            />
            <ProfileSettingsItem
              label='Çalışan Yetkilendirmeleri'
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

export default RestaurantProfilePage;
