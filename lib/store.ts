import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { eventsApi } from "./features/events/eventsApi";  // plural "eventsApi"
import { authApi } from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
import { bookingsApi } from "./features/bookings/bookingApi";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [eventsApi.reducerPath]: eventsApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [bookingsApi.reducerPath]: bookingsApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        eventsApi.middleware,
        authApi.middleware,
        bookingsApi.middleware,
      ),
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];