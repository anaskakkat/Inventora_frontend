// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/authSlice"; 
const store = configureStore({
  reducer: {
    authUser: userSlice, 
  },
});

// Export the store and types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
