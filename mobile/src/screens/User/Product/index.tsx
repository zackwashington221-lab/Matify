import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import { styles } from "../../styles";
import useProductController from "./useProductController";
export default function Product() { const { values, functions } = useProductController(); if (!values.product) return <ActivityIndicator style={{ marginTop: 80 }} />; return <PrimaryLayout contentStyle={styles.page}><Header title="Product" back /><View style={styles.productImage}><Text style={{ fontSize: 120 }}>{values.product.emoji || "🥬"}</Text></View><Text style={styles.eyebrow}>{values.product.brand || "FRESHLY"}</Text><Text style={styles.title}>{values.product.name}</Text><Text style={styles.muted}>{values.product.description || "Fresh groceries delivered when you need them."}</Text><Text style={styles.productPrice}>{"$"}{values.product.price.toFixed(2)} · {values.product.unit || "each"}</Text><View style={styles.row}><Pressable onPress={functions.decrease}><Text>−</Text></Pressable><Text>{values.quantity}</Text><Pressable onPress={functions.increase}><Text>＋</Text></Pressable></View><Button label="Add to cart" onPress={functions.addToCart} /></PrimaryLayout>; }
