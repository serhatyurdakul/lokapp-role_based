import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./OrderDetailPage.scss";
import OrderCard from "../../components/OrderCard/OrderCard";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import Loading from "@/components/common/Loading/Loading.jsx";
import ErrorState from "@/components/common/StateMessage/ErrorState";
import GenericModal from "@/components/common/GenericModal/GenericModal";
import { ReactComponent as CheckIcon } from "@/assets/icons/check.svg";
import { ReactComponent as ClockIcon } from "@/assets/icons/clock.svg";
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

    // Determine next status ID
    const newStatusId = order.summary.status === "pending" ? 4 : 1; // 4 = Completed, 1 = New

    // Collect unique order codes
    const uniqueOrderCodes = new Set(
      (order.rawItems || []).map((item) => item.orderCode)
    );

    const statusUpdateData = {
      orderCodes: Array.from(uniqueOrderCodes),
      statusId: newStatusId,
      restaurantId: user.restaurantId,
      companyId: parseInt(companyId),
    };

    dispatch(updateOrderStatus(statusUpdateData))
      .unwrap()
      .then(() => {
        navigate("/orders");
      });

    setShowStatusModal(false);
  };

  // Navigate back to list on error
  useEffect(() => {
    if (detailsError) {
      navigate("/orders");
    }
  }, [detailsError, navigate]);

  // Full-screen spinner while order data is loading
  if (isDetailsLoading && !order) {
    return <Loading text="Sipariş detayları yükleniyor..." />;
  }

  if (!order && !detailsError) {
    return null;
  }

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
            <CheckIcon />
          </>
        ) : (
          <>
            <span>Beklemeye Al</span>
            <ClockIcon />
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
