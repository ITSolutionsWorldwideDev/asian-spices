// src/screens/CategoryScreen.tsx

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getProductsByCategory } from "../api";

type CategoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Category">;

export default function CategoryScreen() {
  const route = useRoute();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { categoryId } = route.params as { categoryId: string };
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getProductsByCategory(categoryId).then(setProducts);
  }, [categoryId]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Product", { productId: item.id, storeId: item.storeId })}
          >
            <View style={{ padding: 12, marginBottom: 8, backgroundColor: "#f0f0f0", borderRadius: 8 }}>
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <Text>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}