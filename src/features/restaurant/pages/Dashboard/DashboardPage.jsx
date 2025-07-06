import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import UpdateMealModal from "../../components/UpdateMealModal/UpdateMealModal";
import { fetchRestaurantMenuData } from "../../store/restaurantMenuSlice";
import "./DashboardPage.scss";

// Kalan stok (remainingQuantity) toplam stoğa (quantity) oranla kritik mi?
const isStockCritical = (remaining, total) => {
  if (typeof total !== "number" || total === 0) return false;
  const percentage = (remaining / total) * 100;
  return percentage <= 35; // %35 ve altı kritik kabul edilir
};

// Aciliyet seviyesi belirleyici
const getUrgencyLevel = (remaining, total) => {
  if (typeof total !== "number" || total === 0) return "normal";
  const percentage = (remaining / total) * 100;
  if (percentage <= 20) return "critical";
  if (percentage <= 35) return "warning";
  return "normal";
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state'lerini alma
  const { user } = useSelector((state) => state.auth);
  const { menuData, isLoading } = useSelector((state) => state.restaurantMenu);
  const restaurantId = user?.restaurantId;

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);

  // mock veriler (Daha sonra api den gelecek)
  const [dailyStats] = useState({
    totalOrders: 140,
    pendingOrders: 32,
    completedOrders: 108,
    totalRevenue: 8400,
  });

  const loadRestaurantMenu = () => {
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  };

  // Dashboard sayfası her ziyaret edildiğinde güncel menü verisini çeker.
  useEffect(() => {
    loadRestaurantMenu();
  }, [restaurantId]);

  const lowStockMeals = useMemo(() => {
    if (!menuData || menuData.length === 0) {
      return [];
    }

    // 1. flatMap ile tüm yemekleri tek bir diziye indirge ve ihtiyacımız olan formata dönüştür
    const allMeals = menuData.flatMap((categoryGroup) =>
      (categoryGroup.meals || []).map((meal) => ({
        ...meal, // Modal'ın ihtiyacı olan tüm orijinal veriyi koru
        mealName: meal.name,
        currentStock: meal.remainingQuantity ?? 0,
        quantity: meal.quantity ?? 0,
      }))
    );

    // 2. Sadece kritik stoktakileri filtrele
    const criticalMeals = allMeals.filter((meal) =>
      isStockCritical(meal.currentStock, meal.quantity)
    );

    // 3. En acil olanı (stok yüzdesi en düşük) en üste gelecek şekilde sırala
    criticalMeals.sort(
      (a, b) => a.currentStock / a.quantity - b.currentStock / b.quantity
    );

    return criticalMeals;
  }, [menuData]); // Bu hesaplama sadece menuData değiştiğinde yeniden yapılır

  const openStockModal = (meal) => {
    setSelectedMeal(meal);
    setShowStockModal(true);
  };

  const closeStockModal = () => {
    setShowStockModal(false);
    setSelectedMeal(null);
  };

  const handleMealUpdated = () => {
    loadRestaurantMenu();
  };

  return (
    <div className='dashboard-content'>
      <PageHeader title='Özet' />

      <div className='critical-info'>
        <div className='stat-card primary'>
          <h3>Bekleyen Siparişler</h3>
          <p className='stat-value pending'>{dailyStats.pendingOrders}</p>
          <button className='action-button' onClick={() => navigate("/orders")}>
            Siparişleri Yönet →
          </button>
        </div>
      </div>

      <div className='stock-alerts'>
        <div className='section-header'>
          <h2>Kritik Stok Durumu</h2>
          <button className='view-all-btn' onClick={() => navigate("/menu")}>
            Menü Yönetimi →
          </button>
        </div>
        <div className='alert-cards'>
          {isLoading && <p>Stok durumu yükleniyor...</p>}
          {!isLoading &&
            lowStockMeals.length > 0 &&
            lowStockMeals.slice(0, 5).map((meal) => (
              <div
                key={meal.id}
                className={`alert-card ${getUrgencyLevel(
                  meal.currentStock,
                  meal.quantity
                )}`}
                onClick={() => openStockModal(meal)}
              >
                <div className='alert-header'>
                  <h4>{meal.mealName}</h4>
                  <span className='stock-badge'>
                    {meal.currentStock} / {meal.quantity}
                  </span>
                </div>
                <div className='stock-bar'>
                  <div
                    className={`stock-progress ${getUrgencyLevel(
                      meal.currentStock,
                      meal.quantity
                    )}`}
                    style={{
                      width: `${
                        meal.quantity
                          ? (meal.currentStock / meal.quantity) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          {!isLoading && lowStockMeals.length === 0 && (
            <div className='no-alerts'>
              <p>Kritik stok durumu bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      <div className='daily-summary'>
        <h2>Günlük Özet</h2>
        <div className='summary-chart'>
          <div className='chart-placeholder'>
            <p>Saatlik sipariş ve gelir grafiği burada görüntülenecek</p>
          </div>
        </div>
      </div>

      <UpdateMealModal
        isOpen={showStockModal}
        onClose={closeStockModal}
        selectedMeal={selectedMeal}
        restaurantId={restaurantId}
        onMealUpdated={handleMealUpdated}
      />
    </div>
  );
};

export default DashboardPage;
