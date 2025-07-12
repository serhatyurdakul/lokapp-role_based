import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import {
  getRestaurantsOrderList,
  getRestaurantOrderDetails,
  setOrderStatus,
} from "@/utils/api";

// API'den gelen sipariş verisini ön yüzün kullanacağı formata dönüştüren yardımcı fonksiyon
const mapOrderData = (apiOrderData) => {
  if (!apiOrderData || !Array.isArray(apiOrderData.orderList)) {
    return [];
  }

  const allOrders = [];

  apiOrderData.orderList.forEach((industrialSite) => {
    if (
      industrialSite.statusGroups &&
      Array.isArray(industrialSite.statusGroups)
    ) {
      industrialSite.statusGroups.forEach((group) => {
        if (group.orders && Array.isArray(group.orders)) {
          group.orders.forEach((order) => {
            const mappedOrder = {
              id: order.id,
              orderCode: order.orderCode,
              company: order.companyName,
              companyId: order.companyId,
              region: order.industrialSiteName,
              totalPeople: order.companyTotalOrders,
              status:
                order.statusText === "Yeni Sipariş" ? "pending" : "completed",
              // API'den gelen "2025-06-28 12:19:50" formatındaki createdAt'i "12:19" formatına dönüştür
              orderTime: order.createdAt
                ? order.createdAt.substring(11, 16)
                : "",
              // Detay sayfasında gerekebilecek diğer ham veriler
              _raw: order,
            };
            allOrders.push(mappedOrder);
          });
        }
      });
    }
  });

  return allOrders;
};

// Detay API'sinden gelen veriyi ön yüz formatına dönüştüren yardımcı fonksiyon
const mapOrderDetailsData = (apiDetailsData) => {
  if (!apiDetailsData || !apiDetailsData.orderDetails) {
    return null;
  }
  // API'den gelen ham verileri alıyoruz: sipariş özeti ve sipariş kalemleri listesi.
  const { summary, items } = apiDetailsData.orderDetails;

  // Sipariş kalemlerini (items) önce kategoriye, sonra yemeğe göre gruplayıp adetleri toplayalım.
  const groupedItems = Object.values(
    (items || []).reduce((acc, item) => {
      // Her bir sipariş kaleminin kategorisini ve yemek adını alıyoruz.
      const { categoryId, categoryName, mealId, mealName, quantity } = item;

      // Eğer bu kategori daha önce oluşturulmamışsa, accumulator'de (acc) oluşturalım.
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId,
          categoryName,
          items: {}, // Yemekleri de kendi içinde gruplamak için bir obje.
          totalQuantity: 0,
        };
      }

      // Eğer o kategoride bu yemek daha önce eklenmemişse, onu da oluşturalım.
      if (!acc[categoryId].items[mealId]) {
        acc[categoryId].items[mealId] = {
          // React'in 'key' prop'u için stabil bir ID'ye ihtiyacımız var.
          // Gruplanmış bir satırın temsili ID'si olarak mealId'yi kullanabiliriz.
          id: mealId,
          mealName,
          quantity: 0,
        };
      }

      // API'den gelen adet string olduğu için, sayıya çevirip ekliyoruz.
      const itemQuantity = parseInt(quantity, 10) || 0;

      // Yemeğin ve kategorinin toplam adetini güncelleyelim.
      acc[categoryId].items[mealId].quantity += itemQuantity;
      acc[categoryId].totalQuantity += itemQuantity;

      return acc;
    }, {})
  ).map((category) => ({
    // Son olarak, her bir kategori içindeki yemekler objesini de bir diziye çevirelim.
    ...category,
    items: Object.values(category.items),
  }));

  return {
    summary: {
      id: summary.companyId,
      company: summary.companyName,
      region: summary.industrialSiteName,
      // Detay sayfasının tepesindeki kart için "kişi" sayısı "totalOrders" alanından geliyor.
      totalPeople: summary.totalOrders,
      status: summary.statusText === "Yeni Sipariş" ? "pending" : "completed",
      orderTime: summary.createdAt ? summary.createdAt.substring(11, 16) : "",
    },
    // Yeni oluşturduğumuz, tamamen gruplanmış ve toplanmış veri yapısını atayalım.
    groupedItems: groupedItems,
    // DURUM GÜNCELLEME İÇİN GEREKLİ: API'den gelen orijinal sipariş kalemlerini
    // (orderCode'ları içeren) burada saklıyoruz.
    rawItems: items,
  };
};

export const fetchRestaurantOrders = createAsyncThunk(
  "restaurantOrders/fetchOrders",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const data = await getRestaurantsOrderList(restaurantId);
      if (data && data.error === false) {
        // Gelen veriyi ön yüz formatına dönüştür
        return mapOrderData(data);
      } else {
        return rejectWithValue(data.message || "Sipariş listesi alınamadı.");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "restaurantOrders/fetchDetails",
  async ({ restaurantId, companyId }, { rejectWithValue }) => {
    try {
      const data = await getRestaurantOrderDetails(restaurantId, companyId);
      if (data && data.error === false) {
        return mapOrderDetailsData(data);
      } else {
        return rejectWithValue(data.message || "Sipariş detayları alınamadı.");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "restaurantOrders/updateStatus",
  async (statusUpdateData, { dispatch, rejectWithValue }) => {
    try {
      const data = await setOrderStatus(statusUpdateData);
      if (data && data.error === false) {
        // Durum başarıyla güncellendiğinde, sipariş listesini yeniden çekerek
        // verinin tutarlılığını sağlıyoruz.
        await dispatch(fetchRestaurantOrders(statusUpdateData.restaurantId));
        return data; // Başarılı yanıtı döndür
      } else {
        return rejectWithValue(data.message || "Durum güncellenemedi.");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
  // Detay sayfası için state'ler
  selectedOrderDetails: null,
  isDetailsLoading: false,
  detailsError: null,
  // Durum güncelleme için state'ler
  isStatusUpdating: false,
  statusUpdateError: null,
};

const restaurantOrdersSlice = createSlice({
  name: "restaurantOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchRestaurantOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.orders = [];
      })
      // Order Details Reducers
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
        state.selectedOrderDetails = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.selectedOrderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = action.payload;
      })
      // Order Status Update Reducers
      .addCase(updateOrderStatus.pending, (state) => {
        state.isStatusUpdating = true;
        state.statusUpdateError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.isStatusUpdating = false;
        // Detay sayfasındaki veriyi temizleyebiliriz, çünkü kullanıcı listeye yönlendirilecek.
        state.selectedOrderDetails = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isStatusUpdating = false;
        state.statusUpdateError = action.payload;
      });
  },
});

// Memoized selectors -------------------------------------------------
const selectOrdersState = (state) => state.restaurantOrders;
export const selectAllOrders = createSelector(
  [selectOrdersState],
  (ordersState) => ordersState.orders
);

export const selectRegionCategories = createSelector(
  [selectAllOrders],
  (orders) => {
    const unique = new Map();
    orders.forEach((o) => {
      if (o.region) unique.set(o.region, { id: o.region, name: o.region });
    });
    return Array.from(unique.values());
  }
);

export const makeSelectFilteredOrders = () =>
  createSelector(
    [selectAllOrders, (_state, searchQuery) => searchQuery, (_state, _q, selectedValue) => selectedValue],
    (orders, searchQuery, selectedValue) => {
      const lowerQuery = (searchQuery || "").toLocaleLowerCase("tr-TR");
      return orders
        .filter((o) => o.company.toLocaleLowerCase("tr-TR").includes(lowerQuery))
        .filter((o) => selectedValue === "all" || o.region === selectedValue)
        .sort((a, b) => {
          const timeA = a.orderTime.replace(":", "");
          const timeB = b.orderTime.replace(":", "");
          return timeA.localeCompare(timeB);
        });
    }
  );

export const makeSelectPendingAndCompleted = () => {
  const selectFiltered = makeSelectFilteredOrders();
  return createSelector([selectFiltered], (filtered) => ({
    pending: filtered.filter((o) => o.status === "pending"),
    completed: filtered.filter((o) => o.status === "completed"),
  }));
};

// Selector: pending & completed orders grouped by region
export const makeSelectGroupedByRegion = () => {
  const selectPendingCompleted = makeSelectPendingAndCompleted();
  return createSelector([selectPendingCompleted], ({ pending, completed }) => {
    const group = (list) =>
      list.reduce((acc, order) => {
        (acc[order.region] = acc[order.region] || []).push(order);
        return acc;
      }, {});

    return {
      pendingGrouped: group(pending),
      completedGrouped: group(completed),
    };
  });
};

export default restaurantOrdersSlice.reducer;
