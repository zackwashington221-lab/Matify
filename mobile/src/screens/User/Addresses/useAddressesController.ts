import { useGetAddressesQuery } from "../../../redux/Apis/Customer";

export default function useAddressesController() {
  const { data = [] } = useGetAddressesQuery();
  return { values: { title: "Saved addresses", description: "Choose where your groceries arrive.", items: data.map((address) => ({ title: address.label, detail: address.line1 + ", " + address.city })) }, functions: {} };
}
