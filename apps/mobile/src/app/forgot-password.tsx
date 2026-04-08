// apps/mobile/src/app/forgot-password.tsx

import * as React from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Alert,
} from "react-native";

export default function ForgetPassword() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");

  // ✅ Email validation
  const validate = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return false;
    }

    setError("");
    return true;
  };

  // ✅ Submit handler (API ready)
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await fetch("https://your-api.com/forgot-password", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email }),
});

      Alert.alert("Success", "Password reset link sent to your email");

      router.back();
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.forgetPassword}>
      <View style={styles.forgetPasswordChild} />

      {/* Title */}
      <Text style={[styles.forgotPassword, styles.forgotPasswordPosition]}>
        Forgot{"\n"}password?
      </Text>

      {/* Email Input */}
      <View style={[styles.enterYourEmailAddress, styles.enterLayout]}>
        <View style={[styles.enterYourEmailAddressChild, styles.enterLayout]} />

        <TextInput
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
          placeholder="Enter your email address"
          placeholderTextColor="#676767"
          style={styles.input}
        />

        <Image
          source={require("../../assets/images/mail-icon.png")}
          style={[styles.mailIcon]}
        />
      </View>

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Info Text */}
      <Text style={[styles.weWillSendContainer]}>
        <Text style={styles.text}>*</Text>
        <Text style={styles.weWillSend}>
          {" "}
          We will send you a message to set or reset your new password
        </Text>
      </Text>

      {/* Submit Button */}
      <Pressable
        style={[styles.submitWrapper, styles.enterLayout]}
        onPress={handleSubmit}
      >
        <Text style={styles.submit}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  borderLayout: {
    width: 24,
    position: "absolute",
  },

  forgotPasswordPosition: {
    left: 52,
    textAlign: "left",
  },

  enterLayout: {
    height: 55,
    width: 317,
    position: "absolute",
  },

  forgetPassword: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 874,
  },

  forgetPasswordChild: {
    top: 874,
    left: 402,
    transform: [{ rotate: "180deg" }],
    width: 402,
    position: "absolute",
    backgroundColor: "#fff",
    height: 874,
  },

  forgotPassword: {
    top: 273,
    fontSize: 36,
    lineHeight: 43,
    fontWeight: "700",
    fontFamily: "NunitoSans_700Bold",
    textAlign: "left",
    color: "#000",
    position: "absolute",
  },

  submitWrapper: {
    top: 546,
    borderRadius: 16,
    backgroundColor: "#fe8c00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 109,
    paddingVertical: 21,
    left: 51,
  },

  submit: {
    fontSize: 20,
    fontFamily: "NunitoSans_600SemiBold",
    color: "#fff",
  },

  weWillSendContainer: {
    top: 472,
    fontFamily: "NunitoSans_400Regular",
    width: 282,
    textAlign: "left",
    left: 52,
    position: "absolute",
  },

  text: {
    color: "#ff4b26",
  },

  weWillSend: {
    color: "#676767",
  },

  enterYourEmailAddress: {
    top: 391,
    left: 51,
  },

  enterYourEmailAddressChild: {
    borderRadius: 10,
    backgroundColor: "#fffbf4",
    borderColor: "#a8a8a9",
    borderWidth: 1,
    left: 0,
    top: 0,
  },

  input: {
    position: "absolute",
    left: 53,
    top: 0,
    height: "100%",
    width: "75%",
    fontFamily: "NunitoSans_500Medium",
    fontSize: 14,
    color: "#000",
  },

  mailIcon: {
    position: "absolute",
    top: 17,
    left: 13,
    width: 24,
    height: 24,
  },

  errorText: {
    position: "absolute",
    top: 450,
    left: 52,
    color: "red",
    fontSize: 12,
  },
});

/* import * as React from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";

export default function ForgetPassword() {
  const router = useRouter();
  return (
    <View style={styles.forgetPassword}>
      <View style={styles.forgetPasswordChild} />

      <Text style={[styles.forgotPassword, styles.forgotPasswordPosition]}>
        Forgot{"\n"}password?
      </Text>
      <View style={[styles.submitWrapper, styles.enterLayout]}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.submit}>Submit</Text>
        </Pressable>
      </View>
      <Text style={[styles.weWillSendContainer, styles.enterYourEmailTypo]}>
        <Text style={styles.text}>*</Text>
        <Text style={styles.weWillSend}>
          {" "}
          We will send you a message to set or reset your new password
        </Text>
      </Text>
      <View style={[styles.enterYourEmailAddress, styles.enterLayout]}>
        <View style={[styles.enterYourEmailAddressChild, styles.enterLayout]} />
        <Text style={[styles.enterYourEmail, styles.enterYourEmailTypo]}>
          Enter your email address
        </Text>
        <Image
          source={require("../../assets/images/Mail.svg")}
          style={[styles.mailIcon, styles.borderLayout]}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  borderLayout: {
    width: 24,
    position: "absolute",
  },
  iconLayout: {
    maxHeight: "100%",
    position: "absolute",
  },
  timeTypo: {
    textAlign: "center",
    fontWeight: "500",
  },
  barLayout: {
    height: 5,
    width: 134,
    position: "absolute",
  },
  bar2Position: {
    left: 0,
    top: 0,
  },
  forgotPasswordPosition: {
    left: 52,
    textAlign: "left",
  },
  enterLayout: {
    height: 55,
    width: 317,
    position: "absolute",
  },
  enterYourEmailTypo: {
    fontSize: 12,
    position: "absolute",
  },
  forgetPassword: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 874,
  },
  forgetPasswordChild: {
    top: 874,
    left: 402,
    transform: [
      {
        rotate: "180deg",
      },
    ],
    width: 402,
    position: "absolute",
    backgroundColor: "#fff",
    height: 874,
  },
  barsStatusBarDesignL: {
    marginLeft: -201,
    left: "50%",
    height: 47,
    top: 0,
    width: 402,
    position: "absolute",
  },
  batteryParent: {
    height: "25.85%",
    top: "39.36%",
    right: 15,
    bottom: "34.79%",
    width: 71,
    position: "absolute",
  },
  battery: {
    height: "99.18%",
    top: "0.02%",
    bottom: "0.8%",
    width: 26,
    right: 0,
    position: "absolute",
  },
  border: {
    height: "100%",
    right: 3,
    bottom: "0%",
    borderRadius: 3,
    borderColor: "#000",
    borderWidth: 1,
    opacity: 0,
    borderStyle: "solid",
    top: "0%",
  },
  capIcon: {
    height: "35.54%",
    top: "32.48%",
    bottom: "31.98%",
    width: 1,
    opacity: 0,
    right: 0,
  },
  capacity: {
    height: "65.29%",
    top: "17.72%",
    right: 5,
    bottom: "16.99%",
    borderRadius: 1,
    width: 19,
    backgroundColor: "#000",
    position: "absolute",
  },
  wifiIcon: {
    height: "96.72%",
    right: 32,
    bottom: "3.28%",
    width: 16,
    top: "0%",
  },
  cellularConnectionIcon: {
    height: "93.44%",
    top: "2.95%",
    right: 53,
    bottom: "3.6%",
    width: 18,
  },
  timeStyle: {
    height: "47.67%",
    top: "15.9%",
    bottom: "36.43%",
    left: 23,
    width: 58,
    position: "absolute",
  },
  time: {
    marginTop: -5,
    width: "55.61%",
    top: "50%",
    left: "0%",
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "Poppins-Medium",
    color: "#000",
    position: "absolute",
  },
  bar: {
    top: 861,
    left: 134,
  },
  bar2: {
    borderRadius: 34,
    height: 5,
    width: 134,
    position: "absolute",
    backgroundColor: "#000",
  },
  forgotPassword: {
    top: 273,
    fontSize: 36,
    lineHeight: 43,
    fontWeight: "700",
    // fontFamily: "NunitoSans12pt-Bold",
    fontFamily: "NunitoSans_700Bold",
    textAlign: "left",
    color: "#000",
    position: "absolute",
  },
  submitWrapper: {
    top: 546,
    borderRadius: 16,
    backgroundColor: "#fe8c00",
    color:"#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 109,
    paddingVertical: 21,
    left: 51,
    height: 55,
    width: 317,
  },
  submit: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "NunitoSans12pt-SemiBold",
    color: "#fff",
    textAlign: "left",
  },
  weWillSendContainer: {
    top: 472,
    // fontFamily: "NunitoSans12pt-Regular",
    fontFamily: "NunitoSans_400Regular",
    width: 282,
    height: 48,
    textAlign: "left",
    left: 52,
  },
  text: {
    color: "#ff4b26",
  },
  weWillSend: {
    color: "#676767",
  },
  enterYourEmailAddress: {
    top: 391,
    left: 51,
    height: 55,
    width: 317,
  },
  enterYourEmailAddressChild: {
    borderRadius: 10,
    backgroundColor: "#fffbf4",
    borderColor: "#a8a8a9",
    borderWidth: 1,
    left: 0,
    top: 0,
    borderStyle: "solid",
  },
  enterYourEmail: {
    top: 22,
    left: 53,
    // fontFamily: "NunitoSans12pt-Medium",
    fontFamily: "NunitoSans_500Medium",
    color: "#676767",
    textAlign: "center",
    fontWeight: "500",
  },
  mailIcon: {
    top: 17,
    left: 13,
    height: 24,
  },
}); */
