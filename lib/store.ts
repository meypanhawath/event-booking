import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { eventsApi } from "./features/events/eventsApi";
import { authApi } from "./features/auth/authApi";
import { ticketsApi } from "./features/tickets/ticketsApi";
import authReducer from "./features/auth/authSlice";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [eventsApi.reducerPath]: eventsApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [ticketsApi.reducerPath]: ticketsApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        eventsApi.middleware,
        authApi.middleware,
        ticketsApi.middleware,
      ),
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
