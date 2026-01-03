import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import OrderCard from "../../components/OrderCard/OrderCard";
import CustomDropdown from "@/common/components/CustomDropdown/CustomDropdown";
import SearchBar from "@/common/components/SearchBar/SearchBar";
import PageHeader from "@/common/components/PageHeader/PageHeader";
import Loading from "@/common/components/Loading/Loading.jsx";
import EmptyState from "@/common/components/StateMessage/EmptyState";
import InlineEmptyState from "@/common/components/StateMessage/InlineEmptyState";
import NoticeBanner from "@/common/components/NoticeBanner/NoticeBanner";
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
  const hasAnyOrders = Array.isArray(allOrders) && allOrders.length > 0;

  // Map region categories to dropdown options (without adding "Tümü" to options)
  const regionFilterOptions = useMemo(() => {
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

    const isFilterActive =
      searchQuery.trim().length > 0 || selectedValue !== ALL_FILTER;

    if (pendingCount === 0 && completedCount === 0) {
      if (hasAnyOrders && isFilterActive) {
        return (
          <InlineEmptyState>
            Arama sonucuna uygun sipariş bulunamadı.
          </InlineEmptyState>
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
      <div className='orders-page__layout'>
        {pendingCount > 0 && (
          <div className='orders-page__section'>
            <h2 className='orders-page__section-title'>
              Bekleyen Siparişler
              <span className='orders-page__section-meta'>
                ({pendingCount} firma)
              </span>
            </h2>
            <div className='orders-page__section-grid'>
              {Object.entries(pendingGrouped).map(([region, regionOrders]) => (
                <div key={region} className='orders-page__region'>
                  <h3 className='orders-page__region-title'>{region}</h3>
                  <div className='orders-page__region-grid'>
                    {regionOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onClick={handleOrderClick}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedCount > 0 && (
          <div className='orders-page__section orders-page__section--completed'>
            <h2 className='orders-page__section-title'>
              Tamamlanan Siparişler
              <span className='orders-page__section-meta'>
                ({completedCount} firma)
              </span>
            </h2>
            <div className='orders-page__section-grid'>
              {Object.entries(completedGrouped).map(
                ([region, regionOrders]) => (
                  <div key={region} className='orders-page__region'>
                    <h3 className='orders-page__region-title'>{region}</h3>
                    <div className='orders-page__region-grid'>
                      {regionOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onClick={handleOrderClick}
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
    <div className='orders-page'>
      <PageHeader title='Siparişler' />

      {hasAnyOrders && (
        <div className='orders-page__filters'>
          <CustomDropdown
            options={regionFilterOptions}
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
      )}

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
