// src/screens/CartScreen.tsx
import React from "react";
import { View, Text, FlatList, Button } from "react-native";
import { useCartStore } from "../store/cartStore";

export default function CartScreen() {
  const { cart, clearCart } = useCartStore();

  const total = cart.reduce((sum: any, item: any) => sum + item.price, 0);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={(item, idx) => item.id + idx}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              marginBottom: 8,
              backgroundColor: "#eee",
              borderRadius: 8,
            }}
          >
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
          </View>
        )}
      />
      <Text style={{ fontSize: 20, marginVertical: 12 }}>
        Total: ${total.toFixed(2)}
      </Text>
      <Button title="Clear Cart" onPress={clearCart} />
    </View>
  );
}
