import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Loading from "@/components/common/Loading/Loading.jsx";
import NoticeBanner from "@/components/common/NoticeBanner/NoticeBanner";
import UpdateMealModal from "../../components/UpdateMealModal/UpdateMealModal";
import { fetchRestaurantMenuData } from "../../store/restaurantMenuSlice";
import { getStockStatus } from "../../utils/stockUtils";
import StockBadge from "@/components/common/StockBadge/StockBadge";
import "./DashboardPage.scss";

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { menuData, isLoading, error } = useSelector(
    (state) => state.restaurantMenu
  );
  const restaurantId = user?.restaurantId;

  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setShowBanner(!!error);
  }, [error]);

  // TODO: Replace with real API data once the backend is integrated
  const [dailyStats] = useState({
    pendingOrders: 32,
  });

  const loadRestaurantMenu = () => {
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  };

  // Fetch latest menu data on mount or when restaurantId changes
  useEffect(() => {
    loadRestaurantMenu();
  }, [restaurantId]);

  const lowStockMeals = useMemo(() => {
    if (!menuData || menuData.length === 0) {
      return [];
    }

    // 1. Flatten all meals and map to desired structure
    const allMeals = menuData.flatMap((categoryGroup) =>
      (categoryGroup.meals || []).map((meal) => ({
        ...meal, // Preserve all original data needed by the modal
        mealName: meal.name,
        currentStock: meal.remainingQuantity ?? 0,
        quantity: meal.quantity ?? 0,
        status: getStockStatus(meal.remainingQuantity ?? 0),
      }))
    );

    // 2. Keep only meals that are not in "good" stock status
    const criticalMeals = allMeals.filter((meal) => meal.status !== "good");

    // 3. Sort by remaining quantity ascending (most critical first)
    criticalMeals.sort((a, b) => a.currentStock - b.currentStock);

    return criticalMeals;
  }, [menuData]);

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
    <div className="dashboard-content">
      <PageHeader title="Özet" />
      {showBanner && error && (
        <NoticeBanner
          message={error}
          actionText="Yenile"
          onAction={loadRestaurantMenu}
          onClose={() => setShowBanner(false)}
        />
      )}

      <div className="critical-info">
        <div className="stat-card primary">
          <h3>Bekleyen Siparişler</h3>
          <p className="stat-value pending">{dailyStats.pendingOrders}</p>
          <button className="action-button" onClick={() => navigate("/orders")}>
            Siparişleri Yönet →
          </button>
        </div>
      </div>

      <div className="stock-alerts">
        <div className="dashboard-section-header">
          <h2>Az Kalanlar</h2>
          <button className="view-all-btn" onClick={() => navigate("/menu")}>
            Menü Yönetimi →
          </button>
        </div>
        <div className="alert-cards">
          {isLoading && lowStockMeals.length === 0 && (
            <Loading text="Kalan porsiyonlar yükleniyor..." />
          )}
          {lowStockMeals.length > 0 &&
            lowStockMeals.map((meal) => (
              <div
                key={meal.id}
                className={`alert-card ${meal.status}`}
                onClick={() => openStockModal(meal)}
              >
                <div className="alert-header">
                  <h4>{meal.mealName}</h4>
                  <StockBadge
                    remaining={meal.currentStock}
                    sold={meal.orderCount}
                  />
                </div>
              </div>
            ))}
          {!isLoading && lowStockMeals.length === 0 && (
            <div className="no-alerts">
              <p>Kritik porsiyon durumu bulunmuyor</p>
            </div>
          )}
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
