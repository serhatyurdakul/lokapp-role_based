import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearOrderStatus,
  clearSelections,
  createOrder,
  fetchMeals,
  hydrateSelections,
} from "../../store/customerMenuSlice.js";
import CategoryRow from "../../components/CategoryRow/CategoryRow.jsx";
import GenericModal from "@/common/components/modals/GenericModal/GenericModal.jsx";
import ConfirmModal from "@/common/components/modals/ConfirmModal/ConfirmModal.jsx";
import Loading from "@/common/components/Loading/Loading.jsx";
import EmptyState from "@/common/components/StateMessage/EmptyState";
import NoticeBanner from "@/common/components/NoticeBanner/NoticeBanner";
import Button from "@/common/components/Button/Button";
import PageHeader from "@/common/components/PageHeader/PageHeader";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import Toast from "@/common/components/Toast/Toast.jsx";
import DeadlineNotice from "@/common/components/DeadlineNotice/DeadlineNotice.jsx";
import "./OrderScreen.scss";

const OrderScreen = ({ mode, selectedPairs }) => {
  const isEditMode = mode === "edit";
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [toastMessage, setToastMessage] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [shouldClearOnUnmount, setShouldClearOnUnmount] = useState(true);
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

  useEffect(() => {
    if (!isEditMode) return;
    const pairsFromState = selectedPairs;
    if (pairsFromState && typeof pairsFromState === "object") {
      dispatch(hydrateSelections(pairsFromState));
      initialSelectionsRef.current = { ...pairsFromState };
    } else {
      initialSelectionsRef.current = { ...selectedItems };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  useEffect(() => {
    if (!orderSuccessMessage) return;
    setToastMessage(orderSuccessMessage);
    dispatch(clearOrderStatus());
    try {
      setShouldClearOnUnmount(false);
      navigate("/", { state: { toast: orderSuccessMessage }, replace: true });
    } catch (_e) {}
  }, [orderSuccessMessage, dispatch, navigate]);

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
          items.push({
            categoryId: String(cat.id),
            categoryTitle: cat.title,
            name: found.name,
          });
      }
    });
    return items;
  };

  const handleSubmitOrder = () => {
    setShowConfirmModal(false);
    dispatch(createOrder());
  };

  const hasMenu = Array.isArray(categories) && categories.length > 0;

  const isDirtyComparedToInitial = () => {
    const initial = initialSelectionsRef.current || {};
    const keysA = Object.keys(initial);
    const keysB = Object.keys(selectedItems);
    const equal =
      keysA.length === keysB.length &&
      keysA.every((k) => String(initial[k]) === String(selectedItems[k]));
    return !equal;
  };

  const handleRequestExit = () => {
    if (isEditMode && isDirtyComparedToInitial()) {
      setShowDiscardModal(true);
      return;
    }
    try {
      navigate("/");
    } catch (_e) {}
  };

  const renderBody = () => {
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
            closeOnOverlayClick={false}
            title='Eksik Seçimler'
            dialogRole='alertdialog'
            primaryButtonText='Devam Et'
            onPrimaryAction={handleConfirmOrder}
            secondaryButtonText='Seçimlere Dön'
          >
            <p>Aşağıdaki kategorilerden seçim yapmadınız:</p>
            <ul className='p-customer-order__items-list'>
              {categories
                .filter((cat) => !selectedItems[cat.id])
                .map((cat) => cat.title)
                .map((item) => (
                  <li key={item} className='p-customer-order__items-list-item'>
                    {item}
                  </li>
                ))}
            </ul>
            <p>Bu şekilde devam etmek istiyor musunuz?</p>
          </GenericModal>
        )}

        {showConfirmModal && (
          <GenericModal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            closeOnOverlayClick={false}
            title={isEditMode ? "Siparişi Güncelle" : "Siparişi Onayla"}
            dialogRole='dialog'
            primaryButtonText={isEditMode ? "Güncelle" : "Sipariş ver"}
            onPrimaryAction={handleSubmitOrder}
            secondaryButtonText='Vazgeç'
          >
            <ul className='p-customer-order__items-list'>
              {buildSelectedItemsList().map((x) => (
                <li
                  key={x.categoryId}
                  className='p-customer-order__items-list-item'
                >
                  <span className='p-customer-order__item-label'>
                    {x.categoryTitle}
                  </span>
                  <span className='p-customer-order__item-value'>{x.name}</span>
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
          <div className='p-customer-order__cta fixed-cta'>
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
              onClick={handleRequestExit}
              disabled={isOrderLoading}
            >
              Vazgeç
            </Button>
          </div>
        ) : (
          <Button
            className='fixed-cta'
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
    <div className='p-customer-order has-fixed-bottom-cta'>
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
            onBack={handleRequestExit}
          />
          {!isLoading && hasMenu && (
            <DeadlineNotice className='deadline-notice--spaced'>
              Siparişlerinizi {orderCutoffTime}’e kadar düzenleyebilirsiniz.
            </DeadlineNotice>
          )}
        </>
      ) : (
        <>
          <PageHeader title='Sipariş Oluştur' />
          {!isLoading && hasMenu && (
            <DeadlineNotice className='deadline-notice--spaced'>
              Siparişinizi {orderCutoffTime}’e kadar verebilirsiniz.
            </DeadlineNotice>
          )}
        </>
      )}

      {renderBody()}

      {showDiscardModal && (
        <ConfirmModal
          isOpen={showDiscardModal}
          onClose={() => setShowDiscardModal(false)}
          title='İşlemi Sonlandır'
          message='Kaydedilmemiş değişiklikleriniz silinecek. Çıkmak istiyor musunuz?'
          confirmText='Çık'
          cancelText='Geri dön'
          onConfirm={() => {
            setShowDiscardModal(false);
            try {
              navigate("/", { replace: true });
            } catch (_e) {}
          }}
        />
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
};

export default OrderScreen;
