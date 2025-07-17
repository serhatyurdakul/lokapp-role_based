import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./OrderDetailPage.scss";
import OrderCard from "../../components/OrderCard/OrderCard";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import Loading from "@/components/common/Loading/Loading.jsx";
import ErrorState from "@/components/common/StateMessage/ErrorState";
import Button from "@/components/common/Button/Button";
import GenericModal from "@/components/common/GenericModal/GenericModal";
import {
  fetchOrderDetails,
  updateOrderStatus,
} from "../../store/restaurantOrdersSlice";

const OrderDetailPage = () => {
  const { companyId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    selectedOrderDetails: order,
    isDetailsLoading,
    detailsError,
    isStatusUpdating,
    statusUpdateError,
  } = useSelector((state) => state.restaurantOrders);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (user?.restaurantId && companyId) {
      dispatch(
        fetchOrderDetails({ restaurantId: user.restaurantId, companyId })
      );
    }
  }, [dispatch, user?.restaurantId, companyId]);

  useEffect(() => {
    if (statusUpdateError) {
      setShowErrorModal(true);
    }
  }, [statusUpdateError]);

  const handleStatusChange = () => {
    if (!order || !user?.restaurantId || !companyId) return;

    // Mevcut duruma göre yeni durum ID'sini belirle
    const newStatusId = order.summary.status === "pending" ? 4 : 1; // 4 = Tamamlandı, 1 = Yeni Sipariş

    // 1. Benzersiz orderCode'ları topla - ARTIK DOĞRU YERDEN OKUNUYOR
    const uniqueOrderCodes = new Set(
      (order.rawItems || []).map((item) => item.orderCode)
    );

    const statusUpdateData = {
      orderCodes: Array.from(uniqueOrderCodes),
      statusId: newStatusId, // Dinamik olarak belirlenen statusId'yi kullan
      restaurantId: user.restaurantId,
      companyId: parseInt(companyId),
    };

    dispatch(updateOrderStatus(statusUpdateData))
      .unwrap()
      .then(() => {
        navigate("/orders");
      })
      .catch((error) => {
        console.error("Sipariş durumu güncellenemedi:", error);
      });

    setShowStatusModal(false);
  };

  // Hata oluştuğunda liste sayfasına geri dön
  useEffect(() => {
    if (detailsError) {
      navigate("/orders");
    }
  }, [detailsError, navigate]);

  // Tam ekran spinner yalnızca sipariş verisi henüz gelmemişse gösterilir
  if (isDetailsLoading && !order) {
    return <Loading text="Sipariş detayları yükleniyor..." />;
  }

  // order yoksa (hata da yok) redirect beklenirken kısa süreli spinner göster
  if (!order && !detailsError) {
    return null;
  }

  // Error state
  if (detailsError) {
    return (
      <div className="order-detail">
        <DetailPageHeader
          title="Sipariş Detayı"
          backPath="/orders"
          backText="Geri"
        />
        <ErrorState
          message={detailsError}
          onRetry={() =>
            user?.restaurantId &&
            companyId &&
            dispatch(
              fetchOrderDetails({
                restaurantId: user.restaurantId,
                companyId,
              })
            )
          }
        />
      </div>
    );
  }

  return (
    <div className="order-detail">
      <DetailPageHeader
        title="Sipariş Detayı"
        backPath="/orders"
        backText="Geri"
      />

      <OrderCard order={order.summary} onClick={() => {}} />

      <div className="detail-content">
        <h3>Sipariş Detayı</h3>
        <div className="categories-list">
          {order.groupedItems.map((category) => (
            <div key={category.categoryId} className="category-group">
              <h4 className="category-title">
                {category.categoryName}
                <span className="category-total">
                  {category.totalQuantity} adet
                </span>
              </h4>
              <div className="items-list">
                {category.items.map((meal) => (
                  <div key={meal.id} className="detail-item">
                    <span className="item-name">{meal.mealName}</span>
                    <span className="item-quantity">{meal.quantity} adet</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`status-toggle-button ${order?.summary.status}`}
        onClick={() => setShowStatusModal(true)}
        disabled={isStatusUpdating}
      >
        {order?.summary.status === "pending" ? (
          <>
            <span>Siparişi Tamamla</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.875 5.625L8.125 14.375L3.75 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ) : (
          <>
            <span>Beklemeye Al</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4.375V10L13.125 13.125"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 18.125C14.4873 18.125 18.125 14.4873 18.125 10C18.125 5.51269 14.4873 1.875 10 1.875C5.51269 1.875 1.875 5.51269 1.875 10C1.875 14.4873 5.51269 18.125 10 18.125Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>

      {showStatusModal && (
        <GenericModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title="Sipariş Durumu"
          primaryButtonText={
            order.summary.status === "pending" ? "Tamamla" : "Beklemeye Al"
          }
          onPrimaryAction={handleStatusChange}
          secondaryButtonText="Vazgeç"
          primaryButtonClassName={order.summary.status}
          isPrimaryDisabled={isStatusUpdating}
        >
          <p>
            {order.summary.status === "pending"
              ? "Bu siparişi tamamlamak istiyor musunuz?"
              : "Bu siparişi beklemeye almak istiyor musunuz?"}
          </p>
        </GenericModal>
      )}

      {showErrorModal && (
        <GenericModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title="Güncelleme Başarısız"
          primaryButtonText="Tamam"
          onPrimaryAction={() => setShowErrorModal(false)}
          isError={true}
        >
          <p>
            Sipariş durumu güncellenirken bir hata oluştu: <br />
            <strong>{statusUpdateError}</strong>
          </p>
        </GenericModal>
      )}
    </div>
  );
};

export default OrderDetailPage;
