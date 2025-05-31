import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import StockUpdateModal from "../../components/StockUpdateModal/StockUpdateModal";
import "./DashboardPage.scss";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [newStock, setNewStock] = useState("");

  // Örnek veriler (Daha sonra API'den gelecek)
  const [dailyStats] = useState({
    totalOrders: 140,
    pendingOrders: 32,
    completedOrders: 108,
    totalRevenue: 8400,
  });

  const [stockAlerts, setStockAlerts] = useState([
    { id: 1, item: "Patlıcan Musakka", remaining: 5, total: 100 },
    { id: 2, item: "Mercimek Çorbası", remaining: 8, total: 250 },
    { id: 3, item: "Kuru Fasulye", remaining: 10, total: 150 },
    { id: 4, item: "Pilav", remaining: 25, total: 200 },
    { id: 5, item: "İskender", remaining: 15, total: 100 },
  ]);

  // Kritik stok seviyesi kontrolü
  const isStockCritical = (remaining, total) => {
    const percentage = (remaining / total) * 100;
    return percentage <= 35; // %35 ve altı kritik kabul edilir
  };

  // Stok aciliyet seviyesi
  const getUrgencyLevel = (remaining, total) => {
    const percentage = (remaining / total) * 100;
    if (percentage <= 20) return "critical"; // %20 ve altı kırmızı
    if (percentage <= 35) return "warning"; // %35 ve altı turuncu
    return "normal";
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setNewStock(item.remaining.toString());
    setShowQuickAction(true);
  };

  const handleQuickActionClose = () => {
    setShowQuickAction(false);
    setSelectedItem(null);
  };

  const handleStockUpdate = () => {
    if (!selectedItem) return;
    // API çağrısı yapılacak
    const updatedStock = stockAlerts.map((item) =>
      item.id === selectedItem.id
        ? { ...item, remaining: parseInt(newStock) || 0 }
        : item
    );
    setStockAlerts(updatedStock);
    handleQuickActionClose();
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
          {stockAlerts
            .filter((alert) => isStockCritical(alert.remaining, alert.total))
            .map((alert) => (
              <div
                key={alert.id}
                className={`alert-card ${getUrgencyLevel(
                  alert.remaining,
                  alert.total
                )}`}
                onClick={() => handleItemClick(alert)}
              >
                <div className='alert-header'>
                  <h4>{alert.item}</h4>
                  <span className='stock-badge'>
                    {alert.remaining} / {alert.total}
                  </span>
                </div>
                <div className='stock-bar'>
                  <div
                    className={`stock-progress ${getUrgencyLevel(
                      alert.remaining,
                      alert.total
                    )}`}
                    style={{
                      width: `${(alert.remaining / alert.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          {stockAlerts.filter((alert) =>
            isStockCritical(alert.remaining, alert.total)
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
        isOpen={showQuickAction}
        onClose={handleQuickActionClose}
        title="Stok Güncelle"
        primaryButtonText="Güncelle"
        onPrimaryAction={handleStockUpdate}
        secondaryButtonText="İptal"
        selectedItem={selectedItem}
        newStock={newStock}
        onNewStockChange={(e) => setNewStock(e.target.value)}
        onClearNewStock={() => setNewStock("")}
      />
    </div>
  );
};

export default DashboardPage;
