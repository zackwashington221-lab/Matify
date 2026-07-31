import React from "react";
import AccountList from "../../../components/AccountList";
import usePaymentMethodsController from "./usePaymentMethodsController";
export default function PaymentMethods() { const { values } = usePaymentMethodsController(); return <AccountList {...values} />; }
