import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./OrderDetailPage.scss";
import CompanyHeader from "../../components/CompanyHeader/CompanyHeader";
import DetailPageHeader from "@/common/components/DetailPageHeader/DetailPageHeader";
import Loading from "@/common/components/Loading/Loading.jsx";
import ErrorState from "@/common/components/StateMessage/ErrorState";
import GenericModal from "@/common/components/modals/GenericModal/GenericModal";
import { ReactComponent as CheckIcon } from "@/assets/icons/check.svg";
import { ReactComponent as ClockIcon } from "@/assets/icons/clock.svg";
import Button from "@/common/components/Button/Button";
import {
  fetchOrderDetails,
  updateOrderStatus,
} from "../../store/restaurantOrdersSlice";

// Çalışan detayları ayrı ekranda ele alınacaktır

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

  // Tek sayfa: özet + CTA
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
    return <Loading text='Sipariş detayları yükleniyor...' />;
  }

  if (!order && !detailsError) {
    return null;
  }

  if (detailsError) {
    return (
      <div className='order-detail'>
        <DetailPageHeader title='Sipariş Detayı' backPath='/orders' />
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
    <div className='order-detail has-fixed-bottom-cta'>
      <DetailPageHeader title='Sipariş Detayı' backPath='/orders' />

      <CompanyHeader
        companyName={order.summary.company}
        region={order.summary.region}
        totalPeople={order.summary.totalPeople}
        status={order.summary.status}
      />

      <div className='summary-content'>
        <div className='summary-header'>
          <h3 className='tab-title'>Sipariş Özeti</h3>
          <button
            className='summary-action-link'
            type='button'
            onClick={() =>
              navigate(`/orders/${companyId}/by-employee`, {
                state: {
                  companyName: order.summary.company,
                  siteName: order.summary.region,
                },
              })
            }
            aria-label={"Sipariş verenler"}
          >
            {`Sipariş verenler`}
          </button>
        </div>
        <div className='categories-list'>
          {order.groupedItems.map((category) => (
            <div key={category.categoryId} className='category-group'>
              <h4 className='category-title'>
                {category.categoryName}
                <span className='category-total'>
                  {category.totalQuantity} adet
                </span>
              </h4>
              <div className='items-list'>
                {category.items.map((meal) => (
                  <div key={meal.id} className='detail-item'>
                    <span className='item-name'>{meal.mealName}</span>
                    <span className='item-quantity'>{meal.quantity} adet</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        className={`status-toggle-button fixed-cta ${
          order?.summary.status === "pending"
            ? "btn-status-completed"
            : "btn-status-pending"
        }`}
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
      </Button>

      {showStatusModal && (
        <GenericModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          closeOnOverlayClick={false}
          title='Sipariş Durumu'
          dialogRole='alertdialog'
          primaryButtonText={
            order.summary.status === "pending" ? "Tamamla" : "Beklemeye Al"
          }
          onPrimaryAction={handleStatusChange}
          secondaryButtonText='Vazgeç'
          isPrimaryButtonDisabled={isStatusUpdating}
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
          title='Güncelleme Başarısız'
          primaryButtonText='Tamam'
          onPrimaryAction={() => setShowErrorModal(false)}
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
