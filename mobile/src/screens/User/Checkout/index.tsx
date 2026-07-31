import React from "react";
import { Text } from "react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { styles } from "../../styles";
import useCheckoutController from "./useCheckoutController";
export default function Checkout() { const { values, functions } = useCheckoutController(); return <PrimaryLayout contentStyle={styles.page}><Header title="Checkout" back /><Text style={styles.section}>Delivery address</Text><Input value={values.address} onChangeText={functions.setAddress} placeholder="Delivery address" /><Text style={styles.section}>Estimated total</Text><Text style={styles.productPrice}>{"$"}{values.subtotal.toFixed(2)}</Text><Button label={values.isLoading ? "Placing order…" : "Place secure order"} onPress={() => void functions.placeOrder()} /></PrimaryLayout>; }
