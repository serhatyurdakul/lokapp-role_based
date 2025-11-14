import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMeals,
  createOrder,
  clearOrderStatus,
  clearSelections,
} from "../../store/customerMenuSlice.js";
import CategoryRow from "../../components/CategoryRow/CategoryRow.jsx";
import GenericModal from "@/components/common/GenericModal/GenericModal.jsx";
import Loading from "@/components/common/Loading/Loading.jsx";
import EmptyState from "@/components/common/StateMessage/EmptyState";

import NoticeBanner from "@/components/common/NoticeBanner/NoticeBanner";
import Button from "@/components/common/Button/Button";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import Toast from "@/components/common/Toast/Toast.jsx";
import DeadlineNotice from "@/components/common/DeadlineNotice/DeadlineNotice.jsx";
// Removed Home-specific card rendering; CreateOrderPage only handles menu/ordering
import "./CreateOrderPage.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { hydrateSelections } from "../../store/customerMenuSlice.js";

const CreateOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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

  const isCompanyEmp = Number(user?.isCompanyEmployee) === 1;
  const restaurantId = user
    ? isCompanyEmp
      ? user?.contractedRestaurantId
      : user?.restaurantId
    : null;
  const orderCutoffTime =
    user?.restaurant?.orderCutoffTime ||
    user?.contractedRestaurantOrderCutoffTime ||
    "11:00";

  const [showBanner, setShowBanner] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // CreateOrderPage no longer shows order cards or view toggles
  const [toastMessage, setToastMessage] = useState("");

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [shouldClearOnUnmount, setShouldClearOnUnmount] = useState(true);
  const isEditMode = location.pathname === "/orders/edit";
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const initialSelectionsRef = useRef(null);

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchMeals(restaurantId));
    }
  }, [dispatch, restaurantId]);

  useEffect(() => {
    setShowBanner(Boolean(error));
  }, [error]);

  // Hydrate selections when entering edit mode
  useEffect(() => {
    if (!isEditMode) return;
    const pairsFromState = location?.state?.selectedPairs;
    if (pairsFromState && typeof pairsFromState === "object") {
      dispatch(hydrateSelections(pairsFromState));
      initialSelectionsRef.current = { ...pairsFromState };
    } else {
      initialSelectionsRef.current = { ...selectedItems };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  // No local order-cards view; only persist after success

  // Persist will be done right after success

  // On successful order, show toast, clear status, and navigate Home
  useEffect(() => {
    if (!orderSuccessMessage) return;
    setToastMessage(orderSuccessMessage);
    dispatch(clearOrderStatus());
    try {
      setShouldClearOnUnmount(false); // order fulfilled clears selections in slice
      navigate("/", { state: { toast: orderSuccessMessage }, replace: true });
    } catch (_e) {}
  }, [orderSuccessMessage, dispatch]);

  // Clear temporary selections when leaving the page (Back = Vazgeç)
  // No ref needed; cleanup runs only on unmount
  useEffect(() => {
    return () => {
      if (shouldClearOnUnmount) {
        dispatch(clearSelections());
      }
    };
  }, [dispatch, shouldClearOnUnmount]);

  const isOrderDisabled = Object.keys(selectedItems).length === 0;

  const handleOrder = () => {
    if (isOrderDisabled) return;

    const missingCategories = categories
      .filter((cat) => !selectedItems[cat.id])
      .map((cat) => cat.title);

    if (missingCategories.length > 0) {
      setShowWarningModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmOrder = () => {
    setShowWarningModal(false);
    setShowConfirmModal(true);
  };

  const closeStatusModal = () => {
    dispatch(clearOrderStatus());
  };

  const buildSelectedItemsList = () => {
    const items = [];
    if (!categories || categories.length === 0) return items;
    categories.forEach((cat) => {
      const selId = selectedItems[cat.id];
      if (selId) {
        const found = (cat.items || []).find(
          (it) => String(it.id) === String(selId)
        );
        if (found && found.name)
          items.push({ categoryTitle: cat.title, name: found.name });
      }
    });
    return items;
  };

  const handleSubmitOrder = () => {
    setShowConfirmModal(false);
    dispatch(createOrder());
  };

  const renderBody = () => {
    // Show full-screen spinner while initial data is loading
    if (isLoading && (!categories || categories.length === 0)) {
      return <Loading text='Yemekler yükleniyor...' />;
    }

    if (!categories || categories.length === 0) {
      return (
        <EmptyState
          message='Günlük menü henüz yayımlanmadı. Menü paylaşıldığında sipariş verebilirsiniz.'
          onRefresh={() => restaurantId && dispatch(fetchMeals(restaurantId))}
        />
      );
    }

    // Menu view only
    return (
      <div className='has-fixed-bottom-cta'>
        <div className='menu-content'>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              categoryId={category.id}
              title={category.title}
              items={category.items}
            />
          ))}
        </div>

        {showWarningModal && (
          <GenericModal
            isOpen={showWarningModal}
            onClose={() => setShowWarningModal(false)}
            title='Eksik Seçimler'
            primaryButtonText='Devam Et'
            onPrimaryAction={handleConfirmOrder}
            secondaryButtonText='Seçimlere Dön'
          >
            <p>Aşağıdaki kategorilerden seçim yapmadınız:</p>
            <ul className='modal-items-list'>
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

        {showConfirmModal && (
          <GenericModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            title={isEditMode ? "Siparişi Güncelle" : "Siparişi Onayla"}
            primaryButtonText='Onayla'
            onPrimaryAction={handleSubmitOrder}
            secondaryButtonText='Vazgeç'
          >
            <ul className='modal-items-list'>
              {buildSelectedItemsList().map((x, idx) => (
                <li key={idx} className='modal-item'>
                  <span className='modal-item__label'>{x.categoryTitle}</span>
                  <span className='modal-item__value'>{x.name}</span>
                </li>
              ))}
            </ul>
          </GenericModal>
        )}

        {orderError && (
          <GenericModal
            isOpen={true}
            onClose={closeStatusModal}
            title='Hata!'
            primaryButtonText='Tamam'
            onPrimaryAction={closeStatusModal}
          >
            <p>
              Siparişiniz oluşturulurken bir hata oluştu: <br />
              <strong>{orderError}</strong>
            </p>
          </GenericModal>
        )}

        {isEditMode ? (
          <div className='order-page__cta fixed-cta'>
            <Button
              type='button'
              onClick={handleOrder}
              disabled={isOrderDisabled || isOrderLoading}
              loading={isOrderLoading}
            >
              Siparişi Güncelle
            </Button>
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                const initial = initialSelectionsRef.current || {};
                const keysA = Object.keys(initial);
                const keysB = Object.keys(selectedItems);
                const equal =
                  keysA.length === keysB.length &&
                  keysA.every(
                    (k) => String(initial[k]) === String(selectedItems[k])
                  );
                if (!equal) {
                  setShowDiscardModal(true);
                } else {
                  try {
                    navigate("/");
                  } catch (_e) {}
                }
              }}
              disabled={isOrderLoading}
            >
              Vazgeç
            </Button>
          </div>
        ) : (
          <Button
            className='order-button fixed-cta'
            onClick={handleOrder}
            disabled={isOrderDisabled || isOrderLoading}
            loading={isOrderLoading}
          >
            Siparişi Onayla
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      {showBanner && error && (
        <NoticeBanner
          message={error}
          actionText='Yenile'
          onAction={() => restaurantId && dispatch(fetchMeals(restaurantId))}
          onClose={() => setShowBanner(false)}
        />
      )}
      {isEditMode ? (
        <>
          <DetailPageHeader
            title='Siparişi Düzenle'
            onBack={() => {
              const initial = initialSelectionsRef.current || {};
              const keysA = Object.keys(initial);
              const keysB = Object.keys(selectedItems);
              const equal =
                keysA.length === keysB.length &&
                keysA.every(
                  (k) => String(initial[k]) === String(selectedItems[k])
                );
              if (!equal) {
                setShowDiscardModal(true);
              } else {
                try {
                  navigate("/");
                } catch (_e) {}
              }
            }}
          />
          <DeadlineNotice className='deadline-notice--spaced'>
            Siparişlerinizi {orderCutoffTime}’e kadar düzenleyebilirsiniz.
          </DeadlineNotice>
        </>
      ) : (
        <>
          <PageHeader title='Sipariş Oluştur' />
          <DeadlineNotice className='deadline-notice--spaced'>
            Siparişinizi {orderCutoffTime}’e kadar verebilirsiniz.
          </DeadlineNotice>
        </>
      )}
      {renderBody()}
      {showDiscardModal && (
        <GenericModal
          isOpen={showDiscardModal}
          onClose={() => setShowDiscardModal(false)}
          title='İşlemi Sonlandır'
          primaryButtonText='Vazgeç ve çık'
          onPrimaryAction={() => {
            setShowDiscardModal(false);
            try {
              navigate("/", { replace: true });
            } catch (_e) {}
          }}
          secondaryButtonText='Geri dön'
        >
          <p>
            Kaydedilmemiş değişiklikleriniz silinecek. Devam etmek istiyor
            musunuz?
          </p>
        </GenericModal>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </>
  );
};

export default CreateOrderPage;
