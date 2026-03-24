// app/index.tsx (splash)

import { View, Image, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as React from "react";
// import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/startup"); // navigate to home
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/splash-screen-yellow.png")}
        style={styles.logo}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});


  /* return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/splash-screen.png")}
        // style={styles.logo}
        resizeMode="contain"
      />
    </View>
  ); */
/* const styles = StyleSheet.create({
  groupIconLayout: {
    left: "-33.76%",
    right: "-33.95%",
    width: "167.71%",
    height: "44.67%",
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  container: {
    width: "100%",
    backgroundColor: "#fff",
    overflow: "hidden",
    height: "100%"
  },
  containerChild: {
    top: 874,
    left: 402,
    width: 402,
    transform: [
      {
        rotate: "180deg",
      },
    ],
    backgroundColor: "transparent",
    position: "absolute",
    height: 874,
  },
  containerItem: {
    height: "13.68%",
    width: "51.37%",
    top: "43.18%",
    right: "24.23%",
    bottom: "43.13%",
    left: "24.4%",
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  containerInner: {
    top: "-4.58%",
    bottom: "59.91%",
  },
  groupIcon: {
    top: "59.95%",
    bottom: "-4.62%",
  },
}); */


