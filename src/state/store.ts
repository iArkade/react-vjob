import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import tableSlice from "./slices/tableSlice";
import feedBackSlice from "./slices/feedBackSlice";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    tableSlice: tableSlice,
    feedBackSlice: feedBackSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
