import React from "react";
import { Pressable, Text, View } from "react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import { styles } from "../../styles";
import useCartController from "./useCartController";
export default function Cart() { const { values, functions } = useCartController(); return <PrimaryLayout contentStyle={styles.page}><Header title="Your cart" />{values.lines.map((line) => <View key={line.product._id} style={styles.card}><View style={styles.row}><Text style={{ fontSize: 35 }}>{line.product.emoji || "🥬"}</Text><View style={{ flex: 1 }}><Text style={styles.productName}>{line.product.name}</Text><Text style={styles.muted}>{"$"}{line.product.price.toFixed(2)}</Text></View><Text>{"$"}{(line.product.price * line.qty).toFixed(2)}</Text></View><View style={styles.row}><Pressable onPress={() => line.qty === 1 ? functions.remove(line.product._id) : functions.setQty(line.product._id, line.qty - 1)}><Text>−</Text></Pressable><Text>{line.qty}</Text><Pressable onPress={() => functions.setQty(line.product._id, line.qty + 1)}><Text>＋</Text></Pressable></View></View>)}<Text style={styles.section}>Total: {"$"}{values.subtotal.toFixed(2)}</Text><Button label="Continue to checkout" onPress={functions.checkout} /></PrimaryLayout>; }
