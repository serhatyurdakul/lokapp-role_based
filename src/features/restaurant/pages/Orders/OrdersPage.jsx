import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import OrderCard from "../../components/OrderCard/OrderCard";
import FilterBar, {
  ALL as ALL_FILTER,
} from "@/components/common/FilterBar/FilterBar";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Loading from "@/components/common/Loading/Loading.jsx";
import { fetchRestaurantOrders, selectRegionCategories, makeSelectGroupedByRegion } from "../../store/restaurantOrdersSlice";
import "./OrdersPage.scss";



const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isLoading, error } = useSelector((state) => state.restaurantOrders);

    const regionCategories = useSelector(selectRegionCategories);

  useEffect(() => {
    if (user?.restaurantId) {
      dispatch(fetchRestaurantOrders(user.restaurantId));
    }
  }, [dispatch, user?.restaurantId]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState(ALL_FILTER);

  // Memoized selector instance for grouped lists
  const selectGrouped = useMemo(makeSelectGroupedByRegion, []);
  const { pendingGrouped, completedGrouped } = useSelector((state) =>
    selectGrouped(state, searchQuery, selectedValue)
  );

  const pendingCount = useMemo(() => Object.values(pendingGrouped).reduce((s, arr) => s + arr.length, 0), [pendingGrouped]);
  const completedCount = useMemo(() => Object.values(completedGrouped).reduce((s, arr) => s + arr.length, 0), [completedGrouped]);

  



  const handleOrderClick = (companyId) => {
    navigate(`/orders/${companyId}`);
  };

  // Tek bir fonksiyonda içerik durumlarını yönet
  const renderBody = () => {
    if (isLoading) {
      return <Loading text="Siparişler yükleniyor..." />;
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
            >
              Yeniden Dene
            </button>
          </div>
        </div>
      );
    }

    if (pendingCount === 0 && completedCount === 0) {
      return (
        <div className='empty-message'>
          <h2>Sipariş Bulunamadı</h2>
          <p>Seçtiğiniz kriterlere uygun bir sipariş bulunmamaktadır.</p>
        </div>
      );
    }

    return (
      <div className='orders-layout'>
        {pendingCount > 0 && (
          <div className='orders-section'>
            <h2 className='section-title'>Bekleyen Siparişler</h2>
            <div className='orders-grid'>
              {Object.entries(pendingGrouped).map(([region, regionOrders]) => (
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
              ))}
            </div>
          </div>
        )}

        {completedCount > 0 && (
          <div className='orders-section completed-section'>
            <h2 className='section-title'>Tamamlanan Siparişler</h2>
            <div className='orders-grid'>
              {Object.entries(completedGrouped).map(([region, regionOrders]) => (
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
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='orders-content'>
      <PageHeader title='Siparişler' />

      <FilterBar
        options={regionCategories}
        selectedValue={selectedValue}
        onChange={setSelectedValue}
      />

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder='Firma Ara...'
      />

      {renderBody()}
    </div>
  );
};

export default Orders;
