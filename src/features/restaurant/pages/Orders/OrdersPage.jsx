import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import OrderCard from "../../components/OrderCard/OrderCard";
import CustomDropdown from "@/components/common/CustomDropdown/CustomDropdown";
import SearchBar from "@/components/common/SearchBar/SearchBar";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Loading from "@/components/common/Loading/Loading.jsx";
import EmptyState from "@/components/common/StateMessage/EmptyState";
import NoticeBanner from "@/components/common/NoticeBanner/NoticeBanner";
import {
  fetchRestaurantOrders,
  selectRegionCategories,
  makeSelectGroupedByRegion,
  selectAllOrders,
} from "../../store/restaurantOrdersSlice";
import "./OrdersPage.scss";

// Local sentinel value to indicate no region filter applied
const ALL_FILTER = "all";

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

  const [showBanner, setShowBanner] = useState(true);

  // Show banner when a fetch error occurs
  useEffect(() => {
    setShowBanner(Boolean(error));
  }, [error]);

  // Memoized selector for grouped lists
  const selectGrouped = useMemo(makeSelectGroupedByRegion, []);
  const { pendingGrouped, completedGrouped } = useSelector((state) =>
    selectGrouped(state, searchQuery, selectedValue)
  );
  const allOrders = useSelector(selectAllOrders);

  // Map region categories to dropdown options (without adding "Tümü" to options)
  const regionOptions = useMemo(() => {
    const mapped = (regionCategories || []).map((c) => ({
      value: String(c.id),
      label: c.name,
    }));
    return mapped.length > 0
      ? [{ value: ALL_FILTER, label: "Tüm Siteler" }, ...mapped]
      : [];
  }, [regionCategories]);

  const pendingCount = useMemo(
    () => Object.values(pendingGrouped).reduce((s, arr) => s + arr.length, 0),
    [pendingGrouped]
  );
  const completedCount = useMemo(
    () => Object.values(completedGrouped).reduce((s, arr) => s + arr.length, 0),
    [completedGrouped]
  );

  const handleOrderClick = (companyId) => {
    navigate(`/orders/${companyId}`);
  };

  // Centralized content rendering
  const renderBody = () => {
    // Full-screen spinner while orders are loading and list is empty
    if (isLoading && pendingCount === 0 && completedCount === 0) {
      return <Loading text='Siparişler yükleniyor...' />;
    }

    const hasAnyOrders = Array.isArray(allOrders) && allOrders.length > 0;
    const isFilterActive =
      searchQuery.trim().length > 0 || selectedValue !== ALL_FILTER;

    if (pendingCount === 0 && completedCount === 0) {
      if (hasAnyOrders && isFilterActive) {
        return (
          <div className='search-no-results'>
            Arama sonucuna uygun sipariş bulunamadı.
          </div>
        );
      }
      return (
        <EmptyState
          message='Henüz sipariş verilmedi'
          onRefresh={() =>
            user?.restaurantId &&
            dispatch(fetchRestaurantOrders(user.restaurantId))
          }
        />
      );
    }

    return (
      <div className='orders-layout'>
        {pendingCount > 0 && (
          <div className='orders-section'>
            <h2 className='section-title'>
              Bekleyen Siparişler
              <span className='section-meta'>({pendingCount} firma)</span>
            </h2>
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
            <h2 className='section-title'>
              Tamamlanan Siparişler
              <span className='section-meta'>({completedCount} firma)</span>
            </h2>
            <div className='orders-grid'>
              {Object.entries(completedGrouped).map(
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
      </div>
    );
  };

  return (
    <div className='orders-content'>
      <PageHeader title='Siparişler' />

      <div className='order-filters'>
        <CustomDropdown
          options={regionOptions}
          selectedValue={selectedValue}
          onSelect={setSelectedValue}
          placeholder='Sanayi sitesi seçiniz'
        />
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          placeholder='Firma Ara...'
        />
      </div>

      {showBanner && error && (
        <NoticeBanner
          message={error}
          actionText='Yenile'
          onAction={() =>
            user?.restaurantId &&
            dispatch(fetchRestaurantOrders(user.restaurantId))
          }
          onClose={() => setShowBanner(false)}
        />
      )}

      {renderBody()}
    </div>
  );
};

export default Orders;
