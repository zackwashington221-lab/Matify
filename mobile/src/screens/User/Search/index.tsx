import React from "react";
import { Text, View } from "react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import ProductCard from "../../../components/ProductCard";
import { styles } from "../../styles";
import useSearchController from "./useSearchController";
export default function Search() { const { values, functions } = useSearchController(); return <PrimaryLayout contentStyle={styles.page}><Header title="Discover" /><Input value={values.query} onChangeText={functions.setQuery} placeholder="Search groceries" /><Text style={styles.section}>{values.query ? "Results" : "Popular groceries"}</Text><View style={styles.grid}>{values.products.map((product) => <ProductCard key={product._id} product={product} />)}</View></PrimaryLayout>; }
