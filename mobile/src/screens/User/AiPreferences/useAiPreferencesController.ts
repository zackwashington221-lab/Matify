import { useGetPreferencesQuery } from "../../../redux/Apis/Customer";

export default function useAiPreferencesController() {
  const { data } = useGetPreferencesQuery();
  const preferences = data || { healthySwaps: true, budgetAlerts: true, weeklyBudget: 120, dietaryPreferences: [] };
  return { values: { title: "AI preferences", description: "Make Martify's recommendations more personal.", items: [{ title: "Healthy swaps", detail: preferences.healthySwaps ? "Enabled" : "Disabled" }, { title: "Budget alerts", detail: preferences.budgetAlerts ? "Weekly grocery budget: $" + preferences.weeklyBudget : "Disabled" }, { title: "Dietary preferences", detail: preferences.dietaryPreferences.length ? preferences.dietaryPreferences.join(", ") : "No preferences selected" }] }, functions: {} };
}
