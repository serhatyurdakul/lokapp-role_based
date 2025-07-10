import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import OrderCard from "../../components/OrderCard/OrderCard";
import FilterBar, {
  ALL as ALL_FILTER,
} from "@/components/common/FilterBar/FilterBar";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { fetchRestaurantOrders } from "../../store/restaurantOrdersSlice";
import "./OrdersPage.scss";

// FilterBar için bölge kategorileri doğrudan tanımlandı - BU KISIM DA DİNAMİKLEŞTİRİLEBİLİR
const regionCategories = [
  { id: "Tümsan SS", name: "Tümsan SS" },
  { id: "İsdök SS", name: "İsdök SS" },
  { id: "Çevre SS", name: "Çevre SS" },
  { id: "Eskoop SS", name: "Eskoop SS" },
  { id: "Seafköy SS", name: "Seafköy SS" },
  { id: "Göngören SS", name: "Göngören SS" },
  { id: "Bağcılar SS", name: "Bağcılar SS" },
];

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading, error } = useSelector(
    (state) => state.restaurantOrders
  );

  useEffect(() => {
    if (user?.restaurantId) {
      dispatch(fetchRestaurantOrders(user.restaurantId));
    }
  }, [dispatch, user?.restaurantId]);

  const [filterType, setFilterType] = useState(ALL_FILTER);
  const [searchQuery, setSearchQuery] = useState("");

  // Siparişleri filtreleme ve sıralama (şirket adına göre arama ve bölge filtresi)
  const filteredOrders = [...orders]
    .filter((order) =>
      order.company
        .toLocaleLowerCase("tr-TR")
        .includes(searchQuery.toLocaleLowerCase("tr-TR"))
    )
    .filter((order) => filterType === ALL_FILTER || order.region === filterType)
    .sort((a, b) => {
      // Zaman sıralaması için orderTime string'lerini karşılaştır
      const timeA = a.orderTime.replace(":", "");
      const timeB = b.orderTime.replace(":", "");
      return timeA.localeCompare(timeB);
    });

  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "pending"
  );
  const completedOrders = filteredOrders.filter(
    (order) => order.status === "completed"
  );

  // Siparişleri site (region) bazında gruplandırma
  const groupOrdersByRegion = (ordersList) => {
    return ordersList.reduce((acc, order) => {
      if (!acc[order.region]) {
        acc[order.region] = [];
      }
      acc[order.region].push(order);
      return acc;
    }, {});
  };

  const handleOrderClick = (companyId) => {
    navigate(`/orders/${companyId}`);
  };

  if (isLoading) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'></div>
        <p>Siparişler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-container'>
        <div className='error-message'>
          <h2>Hata!</h2>
          <p>{error}</p>
          <button
            onClick={() =>
              user?.restaurantId &&
              dispatch(fetchRestaurantOrders(user.restaurantId))
            }
            disabled={!user?.restaurantId || isLoading}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='orders-content'>
      <PageHeader title='Siparişler' />

      <FilterBar
        categories={regionCategories}
        selectedCategory={filterType}
        onCategoryChange={setFilterType}
      />

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder='Firma Ara...'
      />

      <div className='orders-layout'>
        {pendingOrders.length > 0 && (
          <div className='orders-section'>
            <h2 className='section-title'>Bekleyen Siparişler</h2>
            <div className='orders-grid'>
              {Object.entries(groupOrdersByRegion(pendingOrders)).map(
                ([region, regionOrders]) => (
                  <div key={region} className='orders-by-region'>
                    <h3 className='region-title'>{region}</h3>
                    <div className='orders-region-grid'>
                      {regionOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onClick={() => handleOrderClick(order.companyId)}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {completedOrders.length > 0 && (
          <div className='orders-section completed-section'>
            <h2 className='section-title'>Tamamlanan Siparişler</h2>
            <div className='orders-grid'>
              {Object.entries(groupOrdersByRegion(completedOrders)).map(
                ([region, regionOrders]) => (
                  <div key={region} className='orders-by-region'>
                    <h3 className='region-title'>{region}</h3>
                    <div className='orders-region-grid'>
                      {regionOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onClick={() => handleOrderClick(order.companyId)}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {!isLoading && filteredOrders.length === 0 && (
          <div className='empty-message'>
            <h2>Sipariş Bulunamadı</h2>
            <p>Seçtiğiniz kriterlere uygun bir sipariş bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
