import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import StockUpdateModal from "../../components/StockUpdateModal/StockUpdateModal";
import "./DashboardPage.scss";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [newStock, setNewStock] = useState("");

  // mock veriler (Daha sonra api den gelecek)
  const [dailyStats] = useState({
    totalOrders: 140,
    pendingOrders: 32,
    completedOrders: 108,
    totalRevenue: 8400,
  });

  const [lowStockMeals, setLowStockMeals] = useState([
    { id: 1, mealName: "Patlıcan Musakka", currentStock: 5, maxStock: 100 },
    { id: 2, mealName: "Mercimek Çorbası", currentStock: 8, maxStock: 250 },
    { id: 3, mealName: "Kuru Fasulye", currentStock: 10, maxStock: 150 },
    { id: 4, mealName: "Pilav", currentStock: 25, maxStock: 200 },
    { id: 5, mealName: "İskender", currentStock: 15, maxStock: 100 },
  ]);

  // Kritik stok seviyesi kontrolü
  const isStockCritical = (currentStock, maxStock) => {
    const percentage = (currentStock / maxStock) * 100;
    return percentage <= 35; // %35 ve altı kritik kabul edilir
  };

  // Stok aciliyet seviyesi
  const getUrgencyLevel = (currentStock, maxStock) => {
    const percentage = (currentStock / maxStock) * 100;
    if (percentage <= 20) return "critical"; // %20 ve altı kırmızı
    if (percentage <= 35) return "warning"; // %35 ve altı turuncu
    return "normal";
  };

  const openStockModal = (meal) => {
    setSelectedMeal(meal);
    setNewStock(meal.currentStock.toString());
    setShowStockModal(true);
  };

  const closeStockModal = () => {
    setShowStockModal(false);
    setSelectedMeal(null);
  };

  const handleStockUpdate = () => {
    if (!selectedMeal) return;
    // API çağrısı yapılacak
    const updatedStock = lowStockMeals.map((meal) =>
      meal.id === selectedMeal.id
        ? { ...meal, currentStock: parseInt(newStock) || 0 }
        : meal
    );
    setLowStockMeals(updatedStock);
    closeStockModal();
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
          {lowStockMeals
            .filter((meal) => isStockCritical(meal.currentStock, meal.maxStock))
            .map((meal) => (
              <div
                key={meal.id}
                className={`alert-card ${getUrgencyLevel(
                  meal.currentStock,
                  meal.maxStock
                )}`}
                onClick={() => openStockModal(meal)}
              >
                <div className='alert-header'>
                  <h4>{meal.mealName}</h4>
                  <span className='stock-badge'>
                    {meal.currentStock} / {meal.maxStock}
                  </span>
                </div>
                <div className='stock-bar'>
                  <div
                    className={`stock-progress ${getUrgencyLevel(
                      meal.currentStock,
                      meal.maxStock
                    )}`}
                    style={{
                      width: `${(meal.currentStock / meal.maxStock) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          {lowStockMeals.filter((meal) =>
            isStockCritical(meal.currentStock, meal.maxStock)
          ).length === 0 && (
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

      <StockUpdateModal
        isOpen={showStockModal}
        onClose={closeStockModal}
        title="Stok Güncelle"
        primaryButtonText="Güncelle"
        onPrimaryAction={handleStockUpdate}
        secondaryButtonText="İptal"
        selectedMeal={selectedMeal}
        newStock={newStock}
        onNewStockChange={(e) => setNewStock(e.target.value)}
        onClearNewStock={() => setNewStock("")}
      />
    </div>
  );
};

export default DashboardPage;
