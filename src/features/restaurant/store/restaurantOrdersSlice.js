import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  getRestaurantsOrderList,
  getRestaurantOrderDetails,
  setOrderStatus,
} from "@/utils/api";
import { groupOrderItemsByName } from "../utils/groupOrderItemsByName";

// Map API order list to UI-friendly format
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
              // Convert 'YYYY-MM-DD HH:mm:ss' to 'HH:mm' format
              orderTime: order.createdAt
                ? order.createdAt.substring(11, 16)
                : "",
              // Additional raw data for detail page
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

// Map order details API response to UI format
const mapOrderDetailsData = (apiDetailsData) => {
  if (!apiDetailsData || !apiDetailsData.orderDetails) {
    return null;
  }

  const { summary, items } = apiDetailsData.orderDetails;

  // Group items by normalized mealName (temporary workaround)
  // TODO[backend_id_fix]: Revert to mealId-based grouping once backend provides stable baseMealId
  const groupedItems = groupOrderItemsByName(items);

  return {
    summary: {
      id: summary.companyId,
      company: summary.companyName,
      region: summary.industrialSiteName,
      // totalPeople is derived from totalOrders
      totalPeople: summary.totalOrders,
      status: summary.statusText === "Yeni Sipariş" ? "pending" : "completed",
      orderTime: summary.createdAt ? summary.createdAt.substring(11, 16) : "",
    },

    groupedItems: groupedItems,
    // Keep original items for status updates
    rawItems: items,
  };
};

export const fetchRestaurantOrders = createAsyncThunk(
  "restaurantOrders/fetchOrders",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const data = await getRestaurantsOrderList(restaurantId);
      if (data && data.error === false) {
        // Map to UI format
        return mapOrderData(data);
      } else {
        return rejectWithValue(data.message || "Failed to fetch order list.");
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
        return rejectWithValue(
          data.message || "Failed to fetch order details."
        );
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
        // After successful status update, refetch order list for consistency
        await dispatch(fetchRestaurantOrders(statusUpdateData.restaurantId));
        return data; // Pass through success response
      } else {
        return rejectWithValue(data.message || "Failed to update status.");
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
  // Detail page state
  selectedOrderDetails: null,
  isDetailsLoading: false,
  detailsError: null,
  // Status update state
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
        // Preserve previously fetched list
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
        // Clear details; user will be redirected
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
    [
      selectAllOrders,
      (_state, searchQuery) => searchQuery,
      (_state, _q, selectedValue) => selectedValue,
    ],
    (orders, searchQuery, selectedValue) => {
      const lowerQuery = (searchQuery || "").toLocaleLowerCase("tr-TR");
      return orders
        .filter((o) =>
          o.company.toLocaleLowerCase("tr-TR").includes(lowerQuery)
        )
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
