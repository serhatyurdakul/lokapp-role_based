import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/store/authSlice";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import { ReactComponent as LogoutIcon } from "@/assets/icons/logout.svg";
import { ReactComponent as ChevronRightIcon } from "@/assets/icons/chevron-right.svg";
import "./ProfilePage.scss";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

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
      {/* Üst başlık */}
      <DetailPageHeader title="Profil" backPath={-1} />

      {/* Profil içeriği */}
      <div className="profile-content">
        {/* Profil başlığı */}
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

        {/* Hesap bilgileri */}
        <div className="profile-section">
          <h3>Şirket Bilgileri</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Şirket</span>
              <span className="value">
                {user?.company?.name || "Belirtilmemiş"}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Departman</span>
              <span className="value">
                {user?.department || "Belirtilmemiş"}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Çalışan ID</span>
              <span className="value">
                {user?.employeeId || "Belirtilmemiş"}
              </span>
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
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Telefon</span>
              <span className="value">{user?.phone || "Belirtilmemiş"}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3>Yemek Geçmişi</h3>
            <button className="view-all-button">Tümünü Gör</button>
          </div>
          <div className="meal-history">
            {mealHistory.map((meal, index) => (
              <div key={index} className="meal-item">
                <div className="meal-date">
                  <div className="date-time">
                    <span className="date">
                      {new Date(meal.date).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    <span className="time">{meal.time}</span>
                  </div>
                  <span className="type" data-type={meal.type}>
                    {meal.type}
                  </span>
                </div>
                <div className="meal-details">
                  <span className="restaurant">{meal.restaurant}</span>
                  {meal.items && (
                    <span className="items">{meal.items.join(" • ")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ayarlar */}
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
          </div>
        </div>

        {/* Çıkış yap butonu */}
        <button
          className="logout-button"
          onClick={handleLogout}
          aria-label="Çıkış Yap"
        >
          <LogoutIcon width={20} height={20} className="icon" />
          Çıkış Yap
        </button>
      </div>
    </>
  );
};

export default ProfilePage;
