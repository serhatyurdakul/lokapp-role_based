import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMeals,
  createOrder,
  clearOrderStatus,
} from "../../store/customerMenuSlice";
import CategoryRow from "../../components/CategoryRow/CategoryRow.jsx";
import GenericModal from "@/components/common/GenericModal/GenericModal.jsx";
import Loading from "@/components/common/Loading/Loading.jsx";
import EmptyState from "@/components/common/StateMessage/EmptyState";

import NoticeBanner from "@/components/common/NoticeBanner/NoticeBanner";
import Button from "@/components/common/Button/Button";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import "./HomePage.scss";

const HomePage = () => {
  const [showBanner, setShowBanner] = useState(true);
  const dispatch = useDispatch();
  const {
    categories,
    isLoading,
    error,
    selectedItems,
    isOrderLoading,
    orderError,
    orderSuccessMessage,
  } = useSelector((state) => state.customerMenu);
  const { user } = useSelector((state) => state.auth);

  const [showWarningModal, setShowWarningModal] = useState(false);

  const restaurantId = user
    ? user.isCompanyEmployee === 1
      ? user.contractedRestaurantId
      : user.restaurantId
    : null;

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchMeals(restaurantId));
    }
  }, [dispatch, restaurantId]);

  useEffect(() => {
    setShowBanner(Boolean(error));
  }, [error]);

  const isOrderDisabled = Object.keys(selectedItems).length === 0;

  const handleOrder = () => {
    if (isOrderDisabled) return;

    const missingCategories = categories
      .filter((cat) => !selectedItems[cat.id])
      .map((cat) => cat.title);

    if (missingCategories.length > 0) {
      setShowWarningModal(true);
    } else {
      dispatch(createOrder());
    }
  };

  const handleConfirmOrder = () => {
    setShowWarningModal(false);
    dispatch(createOrder());
  };

  const closeStatusModal = () => {
    dispatch(clearOrderStatus());
  };

  const renderBody = () => {
    // Show full-screen spinner while initial data is loading
    if (isLoading && (!categories || categories.length === 0)) {
      return <Loading text="Yemekler yükleniyor..." />;
    }

    if (!categories || categories.length === 0) {
      return (
        <EmptyState
          message="Sipariş listesinde yemek bulunmamaktadır."
          onRefresh={() => restaurantId && dispatch(fetchMeals(restaurantId))}
        />
      );
    }

    return (
      <div className="has-order-button">
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            categoryId={category.id}
            title={category.title}
            items={category.items}
          />
        ))}

        {showWarningModal && (
          <GenericModal
            isOpen={showWarningModal}
            onClose={() => setShowWarningModal(false)}
            title="Eksik Seçimler"
            primaryButtonText="Devam Et"
            onPrimaryAction={handleConfirmOrder}
            secondaryButtonText="Seçimlere Dön"
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

        {orderSuccessMessage && (
          <GenericModal
            isOpen={true}
            onClose={closeStatusModal}
            title="Başarılı!"
            primaryButtonText="Tamam"
            onPrimaryAction={closeStatusModal}
          >
            <p>{orderSuccessMessage}</p>
          </GenericModal>
        )}

        {orderError && (
          <GenericModal
            isOpen={true}
            onClose={closeStatusModal}
            title="Hata!"
            primaryButtonText="Tamam"
            onPrimaryAction={closeStatusModal}
            isError={true}
          >
            <p>
              Siparişiniz oluşturulurken bir hata oluştu: <br />
              <strong>{orderError}</strong>
            </p>
          </GenericModal>
        )}

        <Button
          className="order-button"
          onClick={handleOrder}
          disabled={isOrderDisabled || isOrderLoading}
          loading={isOrderLoading}
        >
          Siparişi Onayla
        </Button>
      </div>
    );
  };

  return (
    <>
      {showBanner && error && (
        <NoticeBanner
          message={error}
          actionText="Yenile"
          onAction={() => restaurantId && dispatch(fetchMeals(restaurantId))}
          onClose={() => setShowBanner(false)}
        />
      )}
      <PageHeader title="Sipariş Ekranı" />
      {renderBody()}
    </>
  );
};

export default HomePage;
