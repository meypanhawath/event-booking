// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
// import { eventsApi } from "./features/events/eventsApi";  // plural "eventsApi"
// import { authApi } from "./features/auth/authApi";
// import authReducer from "./features/auth/authSlice";
// import { bookingsApi } from "./features/bookings/bookingApi";

// export const makeStore = () => {
//   const store = configureStore({
//     reducer: {
//       [eventsApi.reducerPath]: eventsApi.reducer,
//       [authApi.reducerPath]: authApi.reducer,
//       [bookingsApi.reducerPath]: bookingsApi.reducer,
//       auth: authReducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware().concat(
//         eventsApi.middleware,
//         authApi.middleware,
//         bookingsApi.middleware,
//       ),
//   });

//   setupListeners(store.dispatch);
//   return store;
// };

// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore["getState"]>;
// export type AppDispatch = AppStore["dispatch"];


// backup 2

// import { configureStore } from "@reduxjs/toolkit";
// import { authApi } from "./features/auth/authApi";
// import { eventsApi } from "./features/events/eventsApi";
// import { adminApi } from "./features/admin/adminApi";
// import authReducer from "./features/auth/authSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     [authApi.reducerPath]: authApi.reducer,
//     [eventsApi.reducerPath]: eventsApi.reducer,
//     [adminApi.reducerPath]: adminApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(
//       authApi.middleware,
//       eventsApi.middleware,
//       adminApi.middleware
//     ),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { eventsApi } from "./features/events/eventsApi";
import { authApi } from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
import { bookingsApi } from "./features/bookings/bookingApi";
import { adminApi } from "./features/admin/adminApi"; // Add this

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [eventsApi.reducerPath]: eventsApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [bookingsApi.reducerPath]: bookingsApi.reducer,
      [adminApi.reducerPath]: adminApi.reducer, // Add this
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        eventsApi.middleware,
        authApi.middleware,
        bookingsApi.middleware,
        adminApi.middleware, // Add this
      ),
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];