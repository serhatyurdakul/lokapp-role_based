import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@/common/components/PageHeader/PageHeader";
import EmptyState from "@/common/components/StateMessage/EmptyState";
import Toast from "@/common/components/Toast/Toast.jsx";
import MealCard from "../../components/MealCard/MealCard.jsx";
import OrderActionsModal from "../../components/OrderActionsModal/OrderActionsModal.jsx";
import DeadlineNotice from "@/common/components/DeadlineNotice/DeadlineNotice.jsx";
import { fetchUserOrderHistoryByDate } from "@/utils/api";
import { getLastOrdersStorageKey } from "@/utils/storageKeys";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const isCompanyEmp = Number(user?.isCompanyEmployee) === 1;
  const restaurantId = user ? (isCompanyEmp ? user?.contractedRestaurantId : user?.restaurantId) : null;
  const companyId = user ? user.companyId : null;
  const userId = user ? user.id : null;
  const storageKey = getLastOrdersStorageKey({ userId, restaurantId, companyId });

  const restaurantName =
    user?.restaurantName || user?.restaurant?.name || user?.contractedRestaurantName;

  const [dineInToday, setDineInToday] = useState([]);
  const [ordersToday, setOrdersToday] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const location = useLocation();

  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const orderCutoffTime =
    user?.restaurant?.orderCutoffTime ||
    user?.contractedRestaurantOrderCutoffTime ||
    "11:00";

  // Local dine-in (QR) mock for today only
  useEffect(() => {
    if (!storageKey) {
      setDineInToday([]);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];

      const todayStr = new Date().toLocaleDateString("tr-TR");
      let didChange = false;

      const normalizedList = list.map((item) => {
        if (!item || typeof item !== "object") return item;
        if (typeof item.date !== "string" || item.date.length === 0) return item;
        if (typeof item.id === "string" && item.id.length > 0) return item;
        didChange = true;
        return { ...item, id: item.date };
      });

      const hasDineinToday = normalizedList.some((x) => {
        try {
          return (
            x &&
            x.type === "Restoranda" &&
            typeof x.date === "string" &&
            new Date(x.date).toLocaleDateString("tr-TR") === todayStr
          );
        } catch (_e) {
          return false;
        }
      });

      let base = normalizedList;
      if (!hasDineinToday && restaurantName) {
        const now = new Date();
        const date = now.toISOString();
        const time = now.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const mock = {
          id: date,
          date,
          type: "Restoranda",
          restaurant: restaurantName,
          time,
          items: [],
        };
        base = [mock, ...base];
        didChange = true;
      }

      if (didChange) {
        localStorage.setItem(storageKey, JSON.stringify(base));
      }

      const dineInForToday = base.filter((m) => {
        try {
          return (
            m &&
            m.type === "Restoranda" &&
            typeof m.date === "string" &&
            new Date(m.date).toLocaleDateString("tr-TR") === todayStr
          );
        } catch (_e) {
          return false;
        }
      });

      setDineInToday(dineInForToday);
    } catch (_e) {
      setDineInToday([]);
    }
  }, [storageKey, restaurantName]);

  // Fetch today's orders from API
  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) {
        setOrdersToday([]);
        return;
      }
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const list = await fetchUserOrderHistoryByDate(year, month, day);
      if (!active) return;
      if (!Array.isArray(list) || list.length === 0) {
        setOrdersToday([]);
        return;
      }
      const mapped = list
        .map((o) => {
          if (!o || !o.createdAt || o.id == null) return null;
          const dateIso = new Date(String(o.createdAt).replace(" ", "T")).toISOString();
          const selectedPairs = {};
          if (Array.isArray(o.orderMealList)) {
            o.orderMealList.forEach((it) => {
              if (it && it.categoryId && it.mealId) {
                selectedPairs[String(it.categoryId)] = String(it.mealId);
              }
            });
          }
          const items = Array.isArray(o.orderMealList)
            ? o.orderMealList.map((it) => it?.mealName).filter(Boolean)
            : [];
          return {
            id: String(o.id),
            date: dateIso,
            type: "Sipariş",
            restaurant: o.restaurantName || "",
            time: o.hour || undefined,
            items,
            selectedPairs,
          };
        })
        .filter(Boolean);
      setOrdersToday(mapped);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  // Read toast from navigation state (e.g., after successful order/QR), then clear state
  useEffect(() => {
    const stateToast = location?.state?.toast;
    if (stateToast) {
      setToastMessage(stateToast);
      // Clear state to avoid duplicate toasts on back/forward
      try {
        navigate(location.pathname, { replace: true });
      } catch (_e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state]);

  // Today groups from API (orders) and local (dine-in)
  const orders = ordersToday || [];
  const dinein = dineInToday || [];
  const hasAny = orders.length + dinein.length > 0;

  return (
    <div>
      <PageHeader title='Bugün' />

      {hasAny ? (
        <div className='u-card-group__grid'>
          <>
            {orders.length > 0 && (
              <section>
                <h2 className='u-card-group__title'>
                  Siparişler ({orders.length})
                </h2>
                <DeadlineNotice className='deadline-notice--spaced'>
                  Siparişlerinizi {orderCutoffTime}’e kadar düzenleyebilir veya iptal edebilirsiniz.
                </DeadlineNotice>
                <div className='u-card-group__list'>
                  {orders.map((m) => (
                    <MealCard
                      key={m.id}
                      meal={m}
                      onClick={() => {
                        setSelectedOrder(m);
                        setIsQuickActionsOpen(true);
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {dinein.length > 0 && (
              <section>
                <h2 className='u-card-group__title'>Restoranda ({dinein.length})</h2>
                <div className='u-card-group__list'>
                  {dinein.map((m) => (
                    <MealCard key={m.id} meal={m} />
                  ))}
                </div>
              </section>
            )}
          </>
        </div>
      ) : (
        <div>
          <EmptyState message='Bugün için sipariş veya QR kaydınız yok. Kayıtlarınız burada görünecek.' />
        </div>
      )}

      <OrderActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => {
          setIsQuickActionsOpen(false);
          setSelectedOrder(null);
        }}
        onRequestEdit={() => {
          try {
            const pairs = selectedOrder?.selectedPairs || null;
            navigate("/orders/edit", {
              state: { selectedPairs: pairs },
              replace: false,
            });
          } catch (_e) {}
        }}
        onRequestCancel={() => {
          /* iptal akışı backend hazır olunca bağlanacak */
        }}
        cutoffTime={orderCutoffTime}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
};

export default HomePage;
