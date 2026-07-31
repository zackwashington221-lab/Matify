import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useLazyGetMeQuery } from "../redux/Apis/Auth";
import { useAppDispatch, useAppSelector } from "../redux/hook/hook";
import { logout, restoreSession } from "../redux/slice/authSlice";
import { colors } from "../theme";

function isUnauthorized(error: unknown) {
  const status = (error as { status?: number }).status;
  return status === 401 || status === 403;
}

export default function AuthSessionGate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [getMe] = useLazyGetMeQuery();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      setIsReady(false);
      if (!token) {
        if (active) setIsReady(true);
        return;
      }

      try {
        const verifiedUser = await getMe().unwrap();
        if (active) dispatch(restoreSession({ token, user: verifiedUser }));
      } catch (error) {
        if (active && isUnauthorized(error)) dispatch(logout());
      } finally {
        if (active) setIsReady(true);
      }
    };

    void restore();
    return () => {
      active = false;
    };
  }, [dispatch, getMe, token]);

  if (!isReady) {
    return <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
});
