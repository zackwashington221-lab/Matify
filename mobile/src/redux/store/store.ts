import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { authApi } from "../Apis/Auth";
import { catalogApi } from "../Apis/Catalog";
import { customerApi } from "../Apis/Customer";
import { notificationApi } from "../Apis/Notification";
import { orderApi } from "../Apis/Orders";
import { assistantApi } from "../Apis/Assistant";
import { mmkvStorage } from "../../helpers/storage";
import errorLogger from "../../middlewares/apierror.middleware";
import successLogger from "../../middlewares/apisuccess.middleware";
import auth from "../slice/authSlice";
import cart from "../slice/cartSlice";
import general from "../slice/generalSlice";

const reducer = combineReducers({
  auth,
  cart,
  general,
  [authApi.reducerPath]: authApi.reducer,
  [catalogApi.reducerPath]: catalogApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [assistantApi.reducerPath]: assistantApi.reducer,
});

const persistedReducer = persistReducer(
  { key: "com.freshly.mobile", storage: mmkvStorage, whitelist: ["auth", "cart", "general"] },
  reducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApi.middleware, catalogApi.middleware, customerApi.middleware, notificationApi.middleware, orderApi.middleware, assistantApi.middleware)
      .concat(errorLogger, successLogger),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
