import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import { persistor, store } from "./src/redux/store/store";
import AuthSessionGate from "./src/service/AuthSessionGate";

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar style="dark" />
          <AuthSessionGate>
            <RootNavigator />
          </AuthSessionGate>
          <Toast />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
