import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/store/authSlice";
import { fetchRestaurantInfo } from "@/features/restaurant/store/restaurantInfoSlice";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import LogoutButton from "@/components/common/LogoutButton/LogoutButton";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import { ReactComponent as ChartBarIcon } from "@/assets/icons/chart-bar.svg";
import { ReactComponent as AddressBookIcon } from "@/assets/icons/address-book.svg";
import { ReactComponent as CopyIcon } from "@/assets/icons/copy-icon.svg";
import Toast from "@/components/common/Toast/Toast.jsx";
import "./ProfilePage.scss";

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
            <h2>
              {user?.name} {user?.surname}
            </h2>
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
          <h3>Restoran Bilgileri</h3>
          <div className='info-list'>
            <div className='info-item'>
              <span className='label'>Restoran Adı</span>
              <span className='value'>
                {restaurantInfo?.name ||
                  user?.restaurant?.name ||
                  "Belirtilmemiş"}
              </span>
            </div>
            <div className='info-item'>
              <span className='label'>Telefon</span>
              <span className='value'>
                {restaurantInfo?.phoneNumber ? (
                  <a href={`tel:${restaurantInfo.phoneNumber}`}>
                    {restaurantInfo.phoneNumber}
                  </a>
                ) : (
                  "Belirtilmemiş"
                )}
              </span>
            </div>
            <div className='info-item'>
              <span className='label'>Adres</span>
              <span className='value'>
                {restaurantInfo?.address ||
                  user?.restaurant?.address ||
                  "Belirtilmemiş"}
              </span>
            </div>
            <div className='info-item'>
              <span className='label'>Restoran Kodu</span>
              <div className='value-wrapper'>
                <span className='value'>{codeValue || "Belirtilmemiş"}</span>
                <button
                  type='button'
                  className='copy-button'
                  aria-label='Restoran kodunu kopyala'
                  title='Kopyala'
                  onClick={handleCopyCode}
                >
                  <CopyIcon width={16} height={16} className='icon' />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='profile-section'>
          <h3>Kullanıcı Bilgileri</h3>
          <div className='info-list'>
            <div className='info-item'>
              <span className='label'>Telefon</span>
              <span className='value'>
                {user?.phone ? (
                  <a href={`tel:${user.phone}`}>{user.phone}</a>
                ) : (
                  "Belirtilmemiş"
                )}
              </span>
            </div>
          </div>
        </div>

        <div className='profile-section'>
          <h3>Raporlama</h3>
          <div className='settings-list'>
            <button className='settings-item' onClick={handleReportsClick}>
              <span>Dönem Raporları</span>
              <ChevronRightIcon className='icon' />
            </button>
            <button className='settings-item' onClick={handleCompaniesClick}>
              <span>Tüm Firmalar</span>
              <ChevronRightIcon className='icon' />
            </button>
          </div>
        </div>

        <div className='profile-section'>
          <h3>Ayarlar</h3>
          <div className='settings-list'>
            <button className='settings-item' onClick={handleOrderSettingsClick}>
              <span className='settings-item__label'>
                Sipariş Kapanış Saati
                <span className='settings-item__secondary'>{orderCutoffTime}</span>
              </span>
              <ChevronRightIcon className='icon' />
            </button>
            <button className='settings-item'>
              <span>Profili Düzenle</span>
              <ChevronRightIcon className='icon' />
            </button>
            <button className='settings-item'>
              <span>Bildirim Tercihleri</span>
              <ChevronRightIcon className='icon' />
            </button>
            <button className='settings-item'>
              <span>Çalışan Yetkilendirmeleri</span>
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

export default RestaurantProfilePage;
