import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetailPage.scss";
import OrderCard from "../../components/OrderCard/OrderCard";
import DetailPageHeader from "@/components/common/DetailPageHeader/DetailPageHeader";
import GenericModal from "@/components/common/GenericModal/GenericModal";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate();

  // Örnek sipariş verisi (API entegrasyonu yapılacak)
  useEffect(() => {
    const mockOrders = [
      {
        id: 4,
        company: "Ahmet Yılmaz",
        region: "Eskoop SS",
        orderTime: "14:45",
        totalPeople: 1,
        status: "pending",
        orderItems: [
          {
            mealName: "Kuru Fasulye",
            quantity: 1,
            category: "Ana Yemek",
          },
          {
            mealName: "Domates Çorbası",
            quantity: 1,
            category: "Çorbalar",
          },
          {
            mealName: "Mantarlı Makarna",
            quantity: 1,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Kazandibi",
            quantity: 1,
            category: "Tatlılar ve Salatalar",
          },
        ],
      },
      {
        id: 1,
        company: "Innova",
        region: "Tümsan SS",
        orderTime: "14:30",
        totalPeople: 8,
        status: "completed",
        orderItems: [
          // Ana Yemekler
          {
            mealName: "Musakka",
            quantity: 3,
            category: "Ana Yemek",
          },
          {
            mealName: "Biber Dolması",
            quantity: 2,
            category: "Ana Yemek",
          },
          {
            mealName: "İzmir Köfte",
            quantity: 2,
            category: "Ana Yemek",
          },
          {
            mealName: "Tavuk Sote",
            quantity: 1,
            category: "Ana Yemek",
          },
          // Çorbalar
          {
            mealName: "Mercimek Çorbası",
            quantity: 2,
            category: "Çorbalar",
          },
          {
            mealName: "Ezogelin Çorbası",
            quantity: 2,
            category: "Çorbalar",
          },
          {
            mealName: "Yayla Çorbası",
            quantity: 1,
            category: "Çorbalar",
          },
          {
            mealName: "Domates Çorbası",
            quantity: 1,
            category: "Çorbalar",
          },
          {
            mealName: "İşkembe Çorbası",
            quantity: 1,
            category: "Çorbalar",
          },
          {
            mealName: "Tavuk Suyu Çorbası",
            quantity: 1,
            category: "Çorbalar",
          },
          // Makarnalar
          {
            mealName: "Pirinç Pilavı",
            quantity: 3,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Bulgur Pilavı",
            quantity: 3,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Spagetti Makarna",
            quantity: 2,
            category: "Pilavlar ve Makarnalar",
          },
          // Tatlılar
          {
            mealName: "Sütlaç",
            quantity: 2,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Kemalpaşa Tatlısı",
            quantity: 2,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Puding",
            quantity: 2,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Kazandibi",
            quantity: 1,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Yoğurt",
            quantity: 1,
            category: "Tatlılar ve Salatalar",
          },
        ],
      },
      {
        id: 2,
        company: "Teknosa",
        region: "İsdök SS",
        orderTime: "14:15",
        totalPeople: 12,
        status: "pending",
        orderItems: [
          // Ana Yemek 
          {
            mealName: "Musakka",
            quantity: 3,
            category: "Ana Yemek",
          },
          {
            mealName: "Biber Dolması",
            quantity: 3,
            category: "Ana Yemek",
          },
          {
            mealName: "İzmir Köfte",
            quantity: 2,
            category: "Ana Yemek",
          },
          {
            mealName: "Tavuk Sote",
            quantity: 2,
            category: "Ana Yemek",
          },
          {
            mealName: "Kuru Fasulye",
            quantity: 2,
            category: "Ana Yemek",
          },
          // Çorbalar
          {
            mealName: "Mercimek Çorbası",
            quantity: 4,
            category: "Çorbalar",
          },
          {
            mealName: "Ezogelin Çorbası",
            quantity: 3,
            category: "Çorbalar",
          },
          {
            mealName: "Yayla Çorbası",
            quantity: 3,
            category: "Çorbalar",
          },
          {
            mealName: "Domates Çorbası",
            quantity: 2,
            category: "Çorbalar",
          },
          // Makarnalar
          {
            mealName: "Pirinç Pilavı",
            quantity: 3,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Bulgur Pilavı",
            quantity: 3,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Spagetti Makarna",
            quantity: 2,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Mantarlı Makarna",
            quantity: 2,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Kelebek Makarna",
            quantity: 2,
            category: "Pilavlar ve Makarnalar",
          },
          // Tatlılar
          {
            mealName: "Sütlaç",
            quantity: 4,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Kemalpaşa Tatlısı",
            quantity: 4,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Puding",
            quantity: 2,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Kazandibi",
            quantity: 2,
            category: "Tatlılar ve Salatalar",
          },
        ],
      },
      {
        id: 3,
        company: "Migros",
        region: "Çevre SS",
        orderTime: "14:00",
        totalPeople: 14,
        status: "completed",
        orderItems: [
          // Ana Yemek
          {
            mealName: "Musakka",
            quantity: 5,
            category: "Ana Yemek",
          },
          {
            mealName: "Biber Dolması",
            quantity: 5,
            category: "Ana Yemek",
          },
          {
            mealName: "İzmir Köfte",
            quantity: 4,
            category: "Ana Yemek",
          },
          // Çorbalar
          {
            mealName: "Mercimek Çorbası",
            quantity: 3,
            category: "Çorbalar",
          },
          {
            mealName: "Ezogelin Çorbası",
            quantity: 3,
            category: "Çorbalar",
          },
          {
            mealName: "Yayla Çorbası",
            quantity: 3,
            category: "Çorbalar",
          },
          {
            mealName: "Domates Çorbası",
            quantity: 3,
            category: "Çorbalar",
          },
          {
            mealName: "İşkembe Çorbası",
            quantity: 2,
            category: "Çorbalar",
          },
          // Makarnalar
          {
            mealName: "Pirinç Pilavı",
            quantity: 4,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Bulgur Pilavı",
            quantity: 4,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Spagetti Makarna",
            quantity: 3,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Mantarlı Makarna",
            quantity: 3,
            category: "Pilavlar ve Makarnalar",
          },
          // Tatlılar
          {
            mealName: "Sütlaç",
            quantity: 3,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Kemalpaşa Tatlısı",
            quantity: 3,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Puding",
            quantity: 3,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Kazandibi",
            quantity: 3,
            category: "Tatlılar ve Salatalar",
          },
          {
            mealName: "Yoğurt",
            quantity: 2,
            category: "Tatlılar ve Salatalar",
          },
        ],
      },
      {
        id: 5,
        company: "Mono metal",
        region: "Eskoop SS",
        orderTime: "15:00",
        totalPeople: 4,
        status: "pending",
        orderItems: [
          { mealName: "Musakka", quantity: 1, category: "Ana Yemek" },
          { mealName: "Biber Dolması", quantity: 1, category: "Ana Yemek" },
          { mealName: "Tavuk Sote", quantity: 1, category: "Ana Yemek" },
          { mealName: "Kuru Fasulye", quantity: 1, category: "Ana Yemek" },
          { mealName: "Mercimek Çorbası", quantity: 1, category: "Çorbalar" },
          { mealName: "Ezogelin Çorbası", quantity: 1, category: "Çorbalar" },
          { mealName: "Yayla Çorbası", quantity: 1, category: "Çorbalar" },
          { mealName: "Domates Çorbası", quantity: 1, category: "Çorbalar" },
          {
            mealName: "Pirinç Pilavı",
            quantity: 1,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Bulgur Pilavı",
            quantity: 1,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Spagetti Makarna",
            quantity: 1,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Mantarlı Makarna",
            quantity: 1,
            category: "Pilavlar ve Makarnalar",
          },
          { mealName: "Sütlaç", quantity: 1, category: "Tatlılar ve Salatalar" },
          {
            mealName: "Kemalpaşa Tatlısı",
            quantity: 1,
            category: "Tatlılar ve Salatalar",
          },
          { mealName: "Kazandibi", quantity: 1, category: "Tatlılar ve Salatalar" },
          { mealName: "Puding", quantity: 1, category: "Tatlılar ve Salatalar" },
        ],
      },
      {
        id: 6,
        company: "Lazer Makine",
        region: "Seafköy SS",
        orderTime: "15:05",
        totalPeople: 5,
        status: "pending",
        orderItems: [
          { mealName: "İzmir Köfte", quantity: 1, category: "Ana Yemek" },
          { mealName: "Domates Çorbası", quantity: 1, category: "Çorbalar" },
          {
            mealName: "Bulgur Pilavı",
            quantity: 1,
            category: "Pilavlar ve Makarnalar",
          },
          { mealName: "Sütlaç", quantity: 1, category: "Tatlılar ve Salatalar" },
          { mealName: "Yoğurt", quantity: 1, category: "Tatlılar ve Salatalar" },
        ],
      },
      {
        id: 7,
        company: "Ak Oto Yıkama",
        region: "Göngören SS",
        orderTime: "15:10",
        totalPeople: 7,
        status: "pending",
        orderItems: [
          { mealName: "Tavuk Sote", quantity: 2, category: "Ana Yemek" },
          { mealName: "Yayla Çorbası", quantity: 1, category: "Çorbalar" },
          {
            mealName: "Kelebek Makarna",
            quantity: 1,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Kemalpaşa Tatlısı",
            quantity: 1,
            category: "Tatlılar ve Salatalar",
          },
          { mealName: "Yoğurt", quantity: 2, category: "Tatlılar ve Salatalar" },
        ],
      },
      {
        id: 8,
        company: "Kenan Motor",
        region: "Bağcılar SS",
        orderTime: "15:15",
        totalPeople: 3,
        status: "pending",
        orderItems: [
          { mealName: "Biber Dolması", quantity: 1, category: "Ana Yemek" },
          { mealName: "Puding", quantity: 1, category: "Tatlılar ve Salatalar" },
          { mealName: "Domates Çorbası", quantity: 1, category: "Çorbalar" },
        ],
      },
      {
        id: 9,
        company: "Karmak Alüminyum",
        region: "Çevre SS",
        orderTime: "15:20",
        totalPeople: 4,
        status: "pending",
        orderItems: [
          { mealName: "Musakka", quantity: 1, category: "Ana Yemek" },
          { mealName: "Ezogelin Çorbası", quantity: 1, category: "Çorbalar" },
          {
            mealName: "Spagetti Makarna",
            quantity: 1,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Kemalpaşa Tatlısı",
            quantity: 1,
            category: "Tatlılar ve Salatalar",
          },
        ],
      },
      {
        id: 10,
        company: "Onur Metal",
        region: "İsdök SS",
        orderTime: "15:25",
        totalPeople: 4,
        status: "pending",
        orderItems: [
          { mealName: "Kuru Fasulye", quantity: 1, category: "Ana Yemek" },
          { mealName: "Mercimek Çorbası", quantity: 1, category: "Çorbalar" },
          {
            mealName: "Bulgur Pilavı",
            quantity: 1,
            category: "Pilavlar ve Makarnalar",
          },
          { mealName: "Sütlaç", quantity: 1, category: "Tatlılar ve Salatalar" },
        ],
      },
      {
        id: 11,
        company: "Simge Elektronik",
        region: "Çevre SS",
        orderTime: "15:30",
        totalPeople: 10,
        status: "pending",
        orderItems: [
          { mealName: "Rosto Köfte", quantity: 3, category: "Ana Yemek" },
          { mealName: "İşkembe Çorbası", quantity: 2, category: "Çorbalar" },
          {
            mealName: "Kelebek Makarna",
            quantity: 2,
            category: "Pilavlar ve Makarnalar",
          },
          {
            mealName: "Kemalpaşa Tatlısı",
            quantity: 2,
            category: "Tatlılar ve Salatalar",
          },
          { mealName: "Yayla Çorbası", quantity: 1, category: "Çorbalar" },
        ],
      },
    ];

    // url deki ID ye göre siparişi bulma
    const selectedOrder = mockOrders.find((o) => o.id === parseInt(orderId));
    setOrder(selectedOrder || null);
  }, [orderId]);

  // Siparişleri kategorilere göre gruplandırma
  const groupMealsByCategory = (orderItems) => {
    const grouped = {};
    orderItems?.forEach((meal) => {
      if (!grouped[meal.category]) {
        grouped[meal.category] = [];
      }
      grouped[meal.category].push(meal);
    });
    return grouped;
  };

  // Kategori toplamlarını hesaplama
  const calculateCategoryTotals = (orderItems) => {
    const totals = {};
    orderItems?.forEach((meal) => {
      if (!totals[meal.category]) {
        totals[meal.category] = 0;
      }
      totals[meal.category] += meal.quantity;
    });
    return totals;
  };

  const handleStatusChange = () => {
    const newStatus = order.status === "pending" ? "completed" : "pending";
    // api entegrasyonu yapılacak
    setOrder({ ...order, status: newStatus });
    setShowStatusModal(false);
  };

  if (!order) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className='order-detail'>
      <DetailPageHeader
        title='Sipariş Detayı'
        backPath='/orders'
        backText='Geri'
      />

      <div className='order-content'>
        <OrderCard order={order} onClick={() => {}} />

        <div className='detail-content'>
          <h3>Sipariş Detayı</h3>
          <div className='categories-list'>
            {Object.entries(groupMealsByCategory(order.orderItems)).map(
              ([category, meals]) => (
                <div key={category} className='category-group'>
                  <h4 className='category-title'>
                    {category}
                    <span className='category-total'>
                      {calculateCategoryTotals(meals)[category]} adet
                    </span>
                  </h4>
                  <div className='items-list'>
                    {meals.map((meal, index) => (
                      <div key={index} className='detail-item'>
                        <span className='item-name'>{meal.mealName}</span>
                        <span className='item-quantity'>
                          {meal.quantity} adet
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {order.notes && (
          <div className='order-notes'>
            <h3>Notlar</h3>
            <p>{order.notes}</p>
          </div>
        )}
      </div>

      <button
        className={`status-toggle-button ${order.status}`}
        onClick={() => setShowStatusModal(true)}
      >
        {order.status === "pending" ? (
          <>
            <span>Siparişi Tamamla</span>
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16.875 5.625L8.125 14.375L3.75 10'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </>
        ) : (
          <>
            <span>Beklemeye Al</span>
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10 4.375V10L13.125 13.125'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M10 18.125C14.4873 18.125 18.125 14.4873 18.125 10C18.125 5.51269 14.4873 1.875 10 1.875C5.51269 1.875 1.875 5.51269 1.875 10C1.875 14.4873 5.51269 18.125 10 18.125Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </>
        )}
      </button>

      <GenericModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title='Sipariş Durumu'
        primaryButtonText={
          order?.status === "pending" ? "Tamamla" : "Beklemeye Al"
        }
        onPrimaryAction={handleStatusChange}
        secondaryButtonText='Vazgeç'
        primaryButtonClassName={order?.status}
      >
        <p>
          {order?.status === "pending"
            ? "Bu siparişi tamamlamak istiyor musunuz?"
            : "Bu siparişi beklemeye almak istiyor musunuz?"}
        </p>
      </GenericModal>
    </div>
  );
};

export default OrderDetailPage;
