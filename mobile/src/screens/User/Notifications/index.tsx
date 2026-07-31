import React from "react";
import AccountList from "../../../components/AccountList";
import useNotificationsController from "./useNotificationsController";
export default function Notifications() { const { values } = useNotificationsController(); return <AccountList {...values} />; }
