// src/app/startup.tsx

import { useRouter } from "expo-router";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";

export default function StartUpScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.logo} onPress={() => router.replace("/home")}>
        <Image
          source={require("../../assets/images/home-logo.png")}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.bottomSection}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.primaryText}>Let's get started</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.secondaryText}>
            I already have an account &nbsp;
            <Image
              source={require("../../assets/images/Button.svg")}
              style={[styles.buttonIcon]}
              resizeMode="cover"
            />
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },

  logo: {
    width: "60%",
    height: 120,
    top: "40%",
  },

  bottomSection: {
    width: "100%",
    paddingHorizontal: 30,
  },

  buttonIcon: {
    height: "100%",
    paddingVertical: "6.5%",
    paddingHorizontal: "4%",
    top: 5,
  },

  primaryButton: {
    backgroundColor: "#fe8c00",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "NunitoSans_700Bold",
  },

  secondaryButton: {
    marginTop: 20,
    alignItems: "center",
  },

  secondaryText: {
    fontSize: 14,
    color: "#202020",
    fontFamily: "NunitoSans_400Regular",
  },
});
