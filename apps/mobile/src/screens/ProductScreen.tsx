// src/screens/ProductScreen.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import { addToCart } from "../store/cartStore";

export default function ProductScreen() {
  const route = useRoute();
  const { productId, storeId } = route.params as { productId: string; storeId: string };

  // For simplicity, fake product
  const product = { id: productId, storeId, name: "Sample Product", price: 19.99 };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{product.name}</Text>
      <Text style={{ fontSize: 18, marginVertical: 8 }}>${product.price}</Text>
      <Button title="Add to Cart" onPress={() => addToCart(product)} />
    </View>
  );
}