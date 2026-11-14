import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/order/admin/getall");
      return data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders."
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(
        `/order/admin/update/${orderId}`,
        { status }
      );
      toast.success(data.message || "Order status updated successfully.");
      return data.updatedOrder;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update order status."
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(
        `/order/admin/delete/${orderId}`
      );
      toast.success(data.message || "Order deleted successfully.");
      return orderId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order.");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete order."
      );
    }
  }
);

// ==================== STALLION EXPRESS THUNKS ====================

export const fetchStallionConfig = createAsyncThunk(
  "orders/fetchStallionConfig",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/order/admin/stallion/config");
      return data.config;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load Stallion Express configuration."
      );
    }
  }
);

export const saveStallionConfig = createAsyncThunk(
  "orders/saveStallionConfig",
  async (configData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        "/order/admin/stallion/config",
        configData
      );
      if (data.testResult?.success) {
        toast.success(data.testResult.message || "Stallion Express API connected successfully!");
      } else if (data.testResult?.message) {
        toast.warn(data.testResult.message);
      } else {
        toast.success("Stallion Express settings saved.");
      }
      return data.config;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to save Stallion settings.";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const shipWithStallion = createAsyncThunk(
  "orders/shipWithStallion",
  async ({ orderId, packageInfo }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        `/order/admin/stallion/ship/${orderId}`,
        packageInfo || {}
      );
      toast.success(data.message || "Order shipped via Stallion Express!");
      return data.updatedOrder;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create Stallion shipment.";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const attachStallionTracking = createAsyncThunk(
  "orders/attachStallionTracking",
  async ({ orderId, trackingNumber, carrier, labelUrl }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        `/order/admin/stallion/attach-tracking/${orderId}`,
        { trackingNumber, carrier, labelUrl }
      );
      toast.success(data.message || "Stallion tracking attached successfully.");
      return data.updatedOrder;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to attach tracking.";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const syncStallionTracking = createAsyncThunk(
  "orders/syncStallionTracking",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/order/stallion/track/${orderId}`);
      if (data.has_tracking) {
        toast.success(`Tracking synced: Status is "${data.tracking?.status || data.updatedOrder?.order_status}"`);
      } else {
        toast.info(data.message || "No tracking number assigned yet.");
      }
      return data.updatedOrder;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to sync tracking.";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const syncAllStallionOrders = createAsyncThunk(
  "orders/syncAllStallionOrders",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post("/order/admin/stallion/sync-all");
      toast.success(data.message || "All Stallion orders synced successfully.");
      // Refresh all orders
      thunkAPI.dispatch(fetchAllOrders());
      return data.results;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to sync all orders.";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    orders: [],
    error: null,
    stallionConfig: null,
    stallionLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAllOrders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.loading = false;
      })

      // deleteOrder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state) => {
        state.loading = false;
      })

      // Stallion Config
      .addCase(fetchStallionConfig.fulfilled, (state, action) => {
        state.stallionConfig = action.payload;
      })
      .addCase(saveStallionConfig.fulfilled, (state, action) => {
        state.stallionConfig = action.payload;
      })

      // shipWithStallion
      .addCase(shipWithStallion.pending, (state) => {
        state.stallionLoading = true;
      })
      .addCase(shipWithStallion.fulfilled, (state, action) => {
        state.stallionLoading = false;
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...action.payload,
          };
        }
      })
      .addCase(shipWithStallion.rejected, (state) => {
        state.stallionLoading = false;
      })

      // attachStallionTracking
      .addCase(attachStallionTracking.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...action.payload,
          };
        }
      })

      // syncStallionTracking
      .addCase(syncStallionTracking.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.orders.findIndex(
            (order) => order.id === action.payload.id
          );
          if (index !== -1) {
            state.orders[index] = {
              ...state.orders[index],
              ...action.payload,
            };
          }
        }
      });
  },
});

export default orderSlice.reducer;
