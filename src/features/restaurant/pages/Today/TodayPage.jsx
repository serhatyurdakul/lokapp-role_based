import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageHeader from "@/common/components/PageHeader/PageHeader";
import Loading from "@/common/components/Loading/Loading.jsx";
import NoticeBanner from "@/common/components/NoticeBanner/NoticeBanner";
import {
  fetchRestaurantMenuData,
  selectMenuMealsAndCategories,
} from "../../store/restaurantMenuSlice";
import { fetchRestaurantOrders } from "../../store/restaurantOrdersSlice";
import { getPortionStatus } from "../../utils/portionUtils";
import StatCard from "@/common/components/Stats/StatCard/StatCard";
import StatsGrid from "@/common/components/Stats/StatsGrid/StatsGrid";
import PortionCard from "../../components/PortionCard/PortionCard";
import UpdateMealModal from "../../components/UpdateMealModal/UpdateMealModal";
import Toast from "@/common/components/Toast/Toast.jsx";
import CustomDropdown from "@/common/components/CustomDropdown/CustomDropdown";
import ActionCard from "../../components/ActionCard/ActionCard";
import "./TodayPage.scss";

// Local sentinel value to indicate no category filter applied
const ALL_FILTER = "all";

const TodayPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { info: restaurantInfo } = useSelector((state) => state.restaurantInfo);
  const { orders: restaurantOrders = [] } = useSelector(
    (state) => state.restaurantOrders || {}
  );
  const { isLoading, error } = useSelector((state) => state.restaurantMenu);
  const { menuMeals, menuCategoryOptions } = useSelector(
    selectMenuMealsAndCategories
  );
  const hasAnyMeals = Array.isArray(menuMeals) && menuMeals.length > 0;
  const restaurantId = user?.restaurantId;
  const orderCutoffTime =
    restaurantInfo?.orderCutoffTime ||
    user?.restaurant?.orderCutoffTime ||
    "11:00";

  const [showBanner, setShowBanner] = useState(false);
  const [selectedMealForUpdate, setSelectedMealForUpdate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setShowBanner(!!error);
  }, [error]);

  const loadRestaurantMenu = () => {
    if (restaurantId) {
      dispatch(fetchRestaurantMenuData(restaurantId));
    }
  };

  // Fetch latest menu data on mount or when restaurantId changes
  useEffect(() => {
    loadRestaurantMenu();
  }, [restaurantId]);

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantOrders(restaurantId));
    }
  }, [dispatch, restaurantId]);

  // Apply category filter (if any) and sort by remaining quantity (ascending)
  const [selectedCategory, setSelectedCategory] = useState(ALL_FILTER);

  // Seçili kategori artık mevcut değilse ALL'a döndür
  useEffect(() => {
    if (
      selectedCategory !== ALL_FILTER &&
      !menuCategoryOptions.some((c) => c.id === selectedCategory)
    ) {
      setSelectedCategory(ALL_FILTER);
    }
  }, [menuCategoryOptions, selectedCategory]);

  const mealsByRemainingAsc = useMemo(() => {
    const baseMeals = Array.isArray(menuMeals) ? menuMeals : [];
    const filtered =
      selectedCategory === ALL_FILTER
        ? baseMeals
        : baseMeals.filter(
            (meal) => String(meal.categoryId) === String(selectedCategory)
          );

    const mapped = filtered.map((meal) => ({
      ...meal,
      mealName: meal.mealName || meal.name || "",
      remainingQuantity: meal.remainingQuantity ?? 0,
      quantity: meal.quantity ?? 0,
      status: getPortionStatus(meal.remainingQuantity ?? 0),
    }));

    mapped.sort((a, b) => a.remainingQuantity - b.remainingQuantity);
    return mapped;
  }, [menuMeals, selectedCategory]);

  const handleOpenUpdateModal = (meal) => {
    if (!meal?.id) {
      return;
    }

    setSelectedMealForUpdate({
      id: meal.id,
      mealName: meal.mealName || meal.name || "",
      quantity:
        typeof meal.remainingQuantity === "number"
          ? meal.remainingQuantity
          : meal.remainingQuantity ?? meal.quantity ?? 0,
    });
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedMealForUpdate(null);
  };

  const handleMealUpdated = () => {
    loadRestaurantMenu();
    setToastMessage("Porsiyon güncellendi");
  };

  const pendingOrdersCount = useMemo(() => {
    if (!Array.isArray(restaurantOrders)) return 0;
    return restaurantOrders.filter((order) => order.status === "pending")
      .length;
  }, [restaurantOrders]);

  const summaryStats = useMemo(
    () => ({
      totalMealsToday: 0,
      deliveryMealsToday: 0,
      dineInMealsToday: 0,
      companyCountToday: 0,
    }),
    []
  );

  // TODO: Replace mock value when backend provides real-time QR scan count
  const qrScansToday = 0;

  return (
    <div className='p-restaurant-today'>
      <PageHeader title='Bugün' />
      <div className='p-restaurant-today__cutoff'>
        <span className='p-restaurant-today__cutoff-text'>
          Sipariş alımı {orderCutoffTime}’da kapanır.
        </span>
        <button
          type='button'
          className='p-restaurant-today__cutoff-link'
          onClick={() => navigate("/settings/order-cutoff")}
        >
          Saati ayarla
        </button>
      </div>
      {showBanner && error && (
        <NoticeBanner
          message={error}
          actionText='Yenile'
          onAction={loadRestaurantMenu}
          onClose={() => setShowBanner(false)}
        />
      )}

      <div className='p-restaurant-today__action-cards'>
        <ActionCard
          variant='pending'
          title='Bekleyen Siparişler'
          value={pendingOrdersCount}
          unit='firma'
          onClick={() => navigate("/orders")}
        />
        <ActionCard
          title='QR Okutanlar'
          value={qrScansToday}
          unit='kişi'
          onClick={() => navigate("/qr-activity")}
        />
      </div>

      {/* Daily summary cards */}
      <div className='p-restaurant-today__summary'>
        <p className='p-restaurant-today__summary-label'>Günün Özeti</p>
        <StatsGrid>
          <StatCard
            value={summaryStats.totalMealsToday}
            label='Toplam Tabldot'
            variant='total'
          />
          <StatCard
            value={summaryStats.deliveryMealsToday}
            label='Siparişle Tabldot'
            variant='delivery'
          />
          <StatCard
            value={summaryStats.dineInMealsToday}
            label='Restoranda Tabldot'
            variant='dine-in'
          />
          <StatCard
            value={summaryStats.companyCountToday}
            label='Firma'
            variant='companies'
          />
        </StatsGrid>
      </div>

      <div className='p-restaurant-today__portion-section'>
        <div className='p-restaurant-today__section-header'>
          <h2>Kalan Porsiyonlar</h2>
        </div>

        {/* Kategori filtresi — bölüm başlığının hemen altında */}
        {hasAnyMeals && (
          <div className='p-restaurant-today__filters'>
            <CustomDropdown
              options={[
                { value: ALL_FILTER, label: "Tüm Kategoriler" },
                ...menuCategoryOptions.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                })),
              ]}
              selectedValue={selectedCategory}
              onSelect={setSelectedCategory}
              placeholder='Kategori seçiniz'
            />
          </div>
        )}

        <div className='p-restaurant-today__portion-list'>
          {isLoading && mealsByRemainingAsc.length === 0 && (
            <Loading text='Kalan porsiyonlar yükleniyor...' />
          )}
          {mealsByRemainingAsc.length > 0 &&
            mealsByRemainingAsc.map((meal) => (
              <PortionCard
                key={meal.id}
                title={meal.mealName}
                remaining={meal.remainingQuantity}
                sold={meal.orderCount}
                status={meal.status}
                onClick={() => handleOpenUpdateModal(meal)}
              />
            ))}
          {!isLoading && mealsByRemainingAsc.length === 0 && (
            <div className='u-empty-state'>
              <p>Henüz yemek eklemediniz.</p>
              <p>Menü sayfasından yemek ekleyebilirsiniz.</p>
            </div>
          )}
        </div>
      </div>

      <UpdateMealModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        selectedMeal={selectedMealForUpdate}
        restaurantId={restaurantId}
        onMealUpdated={handleMealUpdated}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
};

export default TodayPage;
