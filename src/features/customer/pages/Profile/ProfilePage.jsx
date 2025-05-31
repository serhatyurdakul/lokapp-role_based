import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/store/authSlice";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import "./ProfilePage.scss"; // SCSS importu güncellendi

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Örnek yemek geçmişi verisi
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
      <DetailPageHeader title='Profil' backPath={-1} />

      {/* Profil içeriği */}
      <div className='profile-content'>
        {/* Profil başlığı */}
        <div className='profile-header'>
          <div className='profile-avatar'>
            <span>{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <h2>
            {user?.name} {user?.surname}
          </h2>
          <p className='subtitle'>{user?.email}</p>
        </div>

        {/* Hesap bilgileri */}
        <div className='profile-section'>
          <h3>Şirket Bilgileri</h3>
          <div className='info-list'>
            <div className='info-item'>
              <span className='label'>Şirket</span>
              <span className='value'>
                {user?.company?.name || "Belirtilmemiş"}
              </span>
            </div>
            <div className='info-item'>
              <span className='label'>Departman</span>
              <span className='value'>
                {user?.department || "Belirtilmemiş"}
              </span>
            </div>
            <div className='info-item'>
              <span className='label'>Çalışan ID</span>
              <span className='value'>
                {user?.employeeId || "Belirtilmemiş"}
              </span>
            </div>
          </div>
        </div>

        <div className='profile-section'>
          <h3>İletişim Bilgileri</h3>
          <div className='info-list'>
            <div className='info-item'>
              <span className='label'>Ad Soyad</span>
              <span className='value'>
                {user?.name} {user?.surname}
              </span>
            </div>
            <div className='info-item'>
              <span className='label'>E-posta</span>
              <span className='value'>{user?.email}</span>
            </div>
            <div className='info-item'>
              <span className='label'>Telefon</span>
              <span className='value'>{user?.phone || "Belirtilmemiş"}</span>
            </div>
          </div>
        </div>

        <div className='profile-section'>
          <div className='section-header'>
            <h3>Yemek Geçmişi</h3>
            <button className='view-all-button'>Tümünü Gör</button>
          </div>
          <div className='meal-history'>
            {mealHistory.map((meal, index) => (
              <div key={index} className='meal-item'>
                <div className='meal-date'>
                  <div className='date-time'>
                    <span className='date'>
                      {new Date(meal.date).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    <span className='time'>{meal.time}</span>
                  </div>
                  <span className='type' data-type={meal.type}>
                    {meal.type}
                  </span>
                </div>
                <div className='meal-details'>
                  <span className='restaurant'>{meal.restaurant}</span>
                  {meal.items && (
                    <span className='items'>{meal.items.join(" • ")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ayarlar */}
        <div className='profile-section'>
          <h3>Ayarlar</h3>
          <div className='settings-list'>
            <button className='settings-item'>
              <span>Profili Düzenle</span>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path
                  d='M7.5 15L12.5 10L7.5 5'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
            <button className='settings-item'>
              <span>Bildirim Tercihleri</span>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                <path
                  d='M7.5 15L12.5 10L7.5 5'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Çıkış yap butonu */}
        <button
          className='logout-button'
          onClick={handleLogout}
          aria-label='Çıkış Yap'
        >
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
              d='M8 20H5C4.46957 20 3.96086 19.7893 3.58579 19.4142C3.21071 19.0391 3 18.5304 3 18V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H8'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M16 16L20 12L16 8'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M20 12H8'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          Çıkış Yap
        </button>
      </div>
    </>
  );
};

export default ProfilePage;
