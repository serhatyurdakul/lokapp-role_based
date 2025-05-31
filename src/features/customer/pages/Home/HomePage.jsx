import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeals, clearSelection } from '../../store/customerMenuSlice'; 
import CategoryRow from "../../components/CategoryRow/CategoryRow.jsx";
import GenericModal from "@/components/common/GenericModal/GenericModal.jsx";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import "./HomePage.scss"; // SCSS importu güncellendi

const HomePage = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, error, selectedItems } = useSelector((state) => state.customerMenu);
  const [showWarning, setShowWarning] = useState(false);

  // Kullanıcı girişi yapıldığında localStorage'dan user bilgisini al
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    // localStorage'dan user bilgisini al
    const userJson = localStorage.getItem("user");

    if (userJson) {
      try {
        const user = JSON.parse(userJson);

        // Eğer kullanıcı bir restoran çalışanı ise, restoran ID'sini kullan
        if (user.restaurantId) {
          setRestaurantId(user.restaurantId);

          // Kullanıcının restoranına ait yemekleri getir
          dispatch(fetchMeals(user.restaurantId));
        } else {
          // Kullanıcı restoran çalışanı değilse, test amaçlı default bir restoran ID kullan
          const defaultRestaurantId = 1; // Test için default ID
          setRestaurantId(defaultRestaurantId);

          // Default restoran yemeklerini getir
          dispatch(fetchMeals(defaultRestaurantId));
        }
      } catch (error) {
        console.error("Kullanıcı bilgisi parse edilemedi:", error);
      }
    } else {
      // Kullanıcı girişi yoksa, test amaçlı default bir restoran ID kullan
      const defaultRestaurantId = 1; // Test için default ID
      setRestaurantId(defaultRestaurantId);

      // Default restoran yemeklerini getir
      dispatch(fetchMeals(defaultRestaurantId));
    }
  }, [dispatch]);

  const handleOrder = () => {
    const missingCategories = categories
      .filter((cat) => !selectedItems[cat.id])
      .map((cat) => cat.title);

    if (missingCategories.length > 0) {
      setShowWarning(true);
    } else {
      // Siparişi tamamla
      console.log("Sipariş tamamlandı:", selectedItems);
    }
  };

  const handleConfirmOrder = () => {
    console.log("Sipariş tamamlandı:", selectedItems);
    setShowWarning(false);
  };

  // Yükleme durumunu göster
  if (isLoading) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'></div>
        <p>Yemekler yükleniyor...</p>
      </div>
    );
  }

  // Hata durumunu göster
  if (error) {
    return (
      <div className='error-container'>
        <div className='error-message'>
          <h2>Hata!</h2>
          <p>{error}</p>
          <button onClick={() => dispatch(fetchMeals(restaurantId))}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Kategori yoksa veya boşsa
  if (!categories || categories.length === 0) {
    return (
      <div className='empty-container'>
        <div className='empty-message'>
          <h2>Yemek Menüsü Bulunamadı</h2>
          <p>
            Bu restoran için henüz yemek menüsü oluşturulmamış veya API'den veri
            getirirken bir sorun oluştu.
          </p>
          <button onClick={() => dispatch(fetchMeals(restaurantId))}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='has-order-button'>
      <PageHeader title='Sipariş Ekranı' />
      {categories.map((category) => (
        <CategoryRow
          key={category.id}
          categoryId={category.id}
          title={category.title}
          items={category.items}
        />
      ))}

      {showWarning && (
        <GenericModal
          isOpen={showWarning}
          onClose={() => setShowWarning(false)}
          title="Eksik Seçimler"
          primaryButtonText="Devam Et"
          onPrimaryAction={handleConfirmOrder}
          secondaryButtonText="Seçimlere Dön"
          // onSecondaryAction is implicitly handled by onClose here,
          // or could be explicitly set to: onSecondaryAction={() => setShowWarning(false)}
        >
          <p>Aşağıdaki kategorilerden seçim yapmadınız:</p>
          <ul className="modal-items-list">
            {categories
              .filter((cat) => !selectedItems[cat.id])
              .map((cat) => cat.title)
              .map((item, index) => (
                <li key={index}>{item}</li>
              ))}
          </ul>
          <p>Bu şekilde devam etmek istiyor musunuz?</p>
        </GenericModal>
      )}

      <button className='order-button' onClick={handleOrder}>
        Siparişi Onayla
      </button>
    </div>
  );
};

export default HomePage;
