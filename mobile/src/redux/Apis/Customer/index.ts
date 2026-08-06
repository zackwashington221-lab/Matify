import { createApi } from "@reduxjs/toolkit/query/react";
import { mockAddresses, mockPaymentMethods, mockPreferences, mockProducts, mockUser } from "../../../mocks/user.mock";
import type { Address, AiPreferences, PaymentMethod, Product, User } from "../../../helpers/types";
import { USE_MOCK_DATA } from "../../../helpers/data";
import { baseQuery } from "../baseQuery";

let addresses = mockAddresses.map((address) => ({ ...address }));
let preferences = { ...mockPreferences };
let paymentMethods = mockPaymentMethods.map((method) => ({ ...method }));
let wishlist = mockProducts.slice(0, 2);

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery,
  tagTypes: ["Addresses", "PaymentMethods", "Preferences", "Wishlist"],
  endpoints: (builder) => ({
    getCart: builder.query<{ product: Product; qty: number }[], void>({
      queryFn: async (_arg, api, extraOptions) => USE_MOCK_DATA
        ? { data: [] }
        : baseQuery("/mobile/cart", api, extraOptions) as Promise<{ data: { product: Product; qty: number }[] }>,
    }),
    getProfile: builder.query<User, void>({
      queryFn: async (_arg, api, extraOptions) => USE_MOCK_DATA ? { data: mockUser } : baseQuery("/mobile/profile", api, extraOptions) as Promise<{ data: User }>,
    }),
    updateMobileProfile: builder.mutation<User, Partial<Pick<User, "name">> & { avatarUrl?: string }>({
      queryFn: async (body, api, extraOptions) => USE_MOCK_DATA ? { data: { ...mockUser, ...body } } : baseQuery({ url: "/mobile/profile", method: "PATCH", body }, api, extraOptions) as Promise<{ data: User }>,
    }),
    getAddresses: builder.query<Address[], void>({
      queryFn: async (_arg, api, extraOptions) => USE_MOCK_DATA ? { data: addresses } : baseQuery("/mobile/addresses", api, extraOptions) as Promise<{ data: Address[] }>,
      providesTags: ["Addresses"],
    }),
    addAddress: builder.mutation<Address, Omit<Address, "_id">>({
      queryFn: async (body, api, extraOptions) => {
        if (USE_MOCK_DATA) {
          const address = { ...body, _id: "address-" + Date.now() };
          addresses = addresses.concat(address);
          return { data: address };
        }
        return baseQuery({ url: "/mobile/addresses", method: "POST", body }, api, extraOptions) as Promise<{ data: Address }>;
      },
      invalidatesTags: ["Addresses"],
    }),
    updateAddress: builder.mutation<Address, { id: string; body: Partial<Address> }>({
      queryFn: async ({ id, body }, api, extraOptions) => {
        if (USE_MOCK_DATA) {
          const address = addresses.find((item) => item._id === id);
          if (!address) return { error: { status: 404, data: "Address not found" } };
          const updated = { ...address, ...body };
          addresses = addresses.map((item) => item._id === id ? updated : item);
          return { data: updated };
        }
        return baseQuery({ url: "/mobile/addresses/" + id, method: "PATCH", body }, api, extraOptions) as Promise<{ data: Address }>;
      },
      invalidatesTags: ["Addresses"],
    }),
    deleteAddress: builder.mutation<void, string>({
      queryFn: async (id, api, extraOptions) => {
        if (USE_MOCK_DATA) {
          addresses = addresses.filter((address) => address._id !== id);
          return { data: undefined };
        }
        return baseQuery({ url: "/mobile/addresses/" + id, method: "DELETE" }, api, extraOptions) as Promise<{ data: undefined }>;
      },
      invalidatesTags: ["Addresses"],
    }),
    getWishlist: builder.query<Product[], void>({
      queryFn: async (_arg, api, extraOptions) => USE_MOCK_DATA ? { data: wishlist } : baseQuery("/mobile/wishlist", api, extraOptions) as Promise<{ data: Product[] }>,
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation<Product[], string>({
      queryFn: async (productId, api, extraOptions) => {
        if (USE_MOCK_DATA) {
          const product = mockProducts.find((item) => item._id === productId);
          if (product && !wishlist.some((item) => item._id === productId)) wishlist = wishlist.concat(product);
          return { data: wishlist };
        }
        return baseQuery({ url: "/mobile/wishlist/" + productId, method: "POST" }, api, extraOptions) as Promise<{ data: Product[] }>;
      },
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation<void, string>({
      queryFn: async (productId, api, extraOptions) => {
        if (USE_MOCK_DATA) {
          wishlist = wishlist.filter((item) => item._id !== productId);
          return { data: undefined };
        }
        return baseQuery({ url: "/mobile/wishlist/" + productId, method: "DELETE" }, api, extraOptions) as Promise<{ data: undefined }>;
      },
      invalidatesTags: ["Wishlist"],
    }),
    getPreferences: builder.query<AiPreferences, void>({
      queryFn: async (_arg, api, extraOptions) => USE_MOCK_DATA ? { data: preferences } : baseQuery("/mobile/preferences", api, extraOptions) as Promise<{ data: AiPreferences }>,
      providesTags: ["Preferences"],
    }),
    updatePreferences: builder.mutation<AiPreferences, Partial<AiPreferences>>({
      queryFn: async (body, api, extraOptions) => {
        if (USE_MOCK_DATA) {
          preferences = { ...preferences, ...body };
          return { data: preferences };
        }
        return baseQuery({ url: "/mobile/preferences", method: "PATCH", body }, api, extraOptions) as Promise<{ data: AiPreferences }>;
      },
      invalidatesTags: ["Preferences"],
    }),
    getPaymentMethods: builder.query<PaymentMethod[], void>({
      queryFn: async (_arg, api, extraOptions) => USE_MOCK_DATA ? { data: paymentMethods } : baseQuery("/mobile/payment-methods", api, extraOptions) as Promise<{ data: PaymentMethod[] }>,
      providesTags: ["PaymentMethods"],
    }),
    addPaymentMethod: builder.mutation<PaymentMethod, Omit<PaymentMethod, "_id">>({
      queryFn: async (body, api, extraOptions) => {
        if (USE_MOCK_DATA) {
          const paymentMethod = { ...body, _id: "payment-method-" + Date.now() };
          paymentMethods = paymentMethods.concat(paymentMethod);
          return { data: paymentMethod };
        }
        return baseQuery({ url: "/mobile/payment-methods", method: "POST", body }, api, extraOptions) as Promise<{ data: PaymentMethod }>;
      },
      invalidatesTags: ["PaymentMethods"],
    }),
    deletePaymentMethod: builder.mutation<void, string>({
      queryFn: async (id, api, extraOptions) => {
        if (USE_MOCK_DATA) {
          paymentMethods = paymentMethods.filter((method) => method._id !== id);
          return { data: undefined };
        }
        return baseQuery({ url: "/mobile/payment-methods/" + id, method: "DELETE" }, api, extraOptions) as Promise<{ data: undefined }>;
      },
      invalidatesTags: ["PaymentMethods"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddAddressMutation,
  useAddPaymentMethodMutation,
  useAddToWishlistMutation,
  useDeleteAddressMutation,
  useDeletePaymentMethodMutation,
  useGetAddressesQuery,
  useGetPaymentMethodsQuery,
  useGetPreferencesQuery,
  useGetProfileQuery,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useUpdateAddressMutation,
  useUpdateMobileProfileMutation,
  useUpdatePreferencesMutation,
} = customerApi;
