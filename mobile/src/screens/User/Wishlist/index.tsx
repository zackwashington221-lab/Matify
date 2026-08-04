import React from "react";
import AccountList from "../../../components/AccountList";
import useWishlistController from "./useWishlistController";
export default function Wishlist() {
  const { values } = useWishlistController();
  return <AccountList {...values} />;
}
