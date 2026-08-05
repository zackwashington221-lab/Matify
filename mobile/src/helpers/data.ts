import Constants from "expo-constants";

const appConfig = Constants.expoConfig?.extra as
    { apiUrl?: string; useMockData?: boolean | string } | undefined;

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL || appConfig?.apiUrl || "https://matify.up.railway.app/api";

// Keep request paths predictable regardless of whether the configured URL has a trailing slash.
export const BASE_URL = configuredApiUrl.replace(/\/+$/, "");
export const USE_MOCK_DATA = appConfig?.useMockData !== false && appConfig?.useMockData !== "false";
