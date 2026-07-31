import React from "react";
import AccountList from "../../../components/AccountList";
import useAddressesController from "./useAddressesController";
export default function Addresses() { const { values } = useAddressesController(); return <AccountList {...values} />; }
