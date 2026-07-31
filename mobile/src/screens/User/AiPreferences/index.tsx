import React from "react";
import AccountList from "../../../components/AccountList";
import useAiPreferencesController from "./useAiPreferencesController";
export default function AiPreferences() { const { values } = useAiPreferencesController(); return <AccountList {...values} />; }
