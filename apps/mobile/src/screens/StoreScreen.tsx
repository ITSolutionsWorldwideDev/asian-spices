// src/screens/StoreScreen.tsx

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getProductsByStore } from "../api";

type StoreScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Store">;

export default function StoreScreen() {
  const route = useRoute();
  const navigation = useNavigation<StoreScreenNavigationProp>();
  const { storeId } = route.params as { storeId: string };
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getProductsByStore(storeId).then(setProducts);
  }, [storeId]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Product", { productId: item.id, storeId })}
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