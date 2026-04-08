// apps/mobile/src/app/login.tsx

import * as React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let valid = true;
    let tempErrors: any = {};

    if (!email) {
      tempErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Invalid email format";
      valid = false;
    }

    if (!password) {
      tempErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Minimum 6 characters required";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const response = await axios.post("https://your-api.com/login", {
        email,
        password,
      });

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Login Failed", error?.response?.data?.message || "Error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {"\n"}Back!</Text>

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secure}
        />

        <Pressable style={styles.eye} onPress={() => setSecure(!secure)}>
          <Text>{secure ? "👁️" : "🙈"}</Text>
        </Pressable>
      </View>
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <Pressable onPress={() => router.push("/forgot-password")}>
        <Text style={styles.link}>Forgot Password?</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <View style={styles.goodleFbSignIn}>
        <Text style={styles.orContinueWith}>- OR Continue with -</Text>
        <View style={styles.buttons}>
          <View style={[styles.google, styles.googleFlexBox]}>
            <Image
              source={require("../../assets/images/google-icon.png")}
              style={styles.facebookIcon}
              resizeMode="cover"
            />
          </View>
          <View style={[styles.google, styles.googleFlexBox]}>
            <Image
              source={require("../../assets/images/apple-icon.png")}
              style={styles.facebookIcon}
              resizeMode="cover"
            />
          </View>
          <View style={[styles.google, styles.googleFlexBox]}>
            <Image
              source={require("../../assets/images/facebook-icon.png")}
              style={styles.facebookIcon2}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      <View style={styles.goodleFbSignIn}>
        <Text>Create An Account </Text>
        <Pressable onPress={() => router.push("/signup")}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    marginBottom: 30,
    fontFamily: "NunitoSans_700Bold",
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    fontFamily: "NunitoSans_400Regular",
    backgroundColor: "#FFFBF4",
    borderWidth: 1,
    borderColor: "#A8A8A9",
    borderRadius: 10,
  },
  eye: {
    position: "absolute",
    right: 15,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#fe8c00",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "NunitoSans_700Bold",
  },
  link: {
    color: "#fe8c00",
    marginTop: 10,
  },
  signUpLink: {
    color: "#fe8c00",
    marginTop: 0,
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    marginTop: 20,
    textAlign: "center",
  },

  goodleFbSignIn: {
    gap: 20,
    alignItems: "center",
    marginTop: 50,
  },
  orContinueWith: {
    fontFamily: "NunitoSans_500Medium",
    fontSize: 12,
    color: "#575757",
    textAlign: "center",
    fontWeight: "500",
  },
  buttons: {
    gap: 10,
    flexDirection: "row",
  },
  google: {
    backgroundColor: "#fff9ef",
    borderColor: "#fe8c00",
    padding: 15,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 50,
    overflow: "hidden",
  },
  facebookIcon: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  facebookIcon2: {
    height: 30,
    width: 30,
    borderRadius: 50,
  },

  googleFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },

  userIconLayout: {
    height: 24,
    width: 24,
  },
});

/* 
  
  backgroundColor: "#fff9ef",
borderStyle: "solid",
borderColor: "#fe8c00",
borderWidth: 1,

  return (
    <View style={styles.logIn}>
      <View style={styles.logInChild} />

      <Text style={[styles.welcomeBack, styles.welcomeBackLayout]}>
        Welcome {"\n"}Back!{"\n"}
      </Text>
      <View style={[styles.createAnAccountParent, styles.welcomeBackLayout]}>
        <View style={styles.createAnAccount}>
          <Text style={styles.createAnAccount2}>Create An Account</Text>

          <Pressable onPress={() => router.push("/signup")}>
            <Text style={[styles.signUp, styles.loginTypo]}>Sign Up</Text>
          </Pressable>
        </View>
        <View style={styles.goodleFbSignIn}>
          <Text style={styles.orContinueWith}>- OR Continue with -</Text>
          <View style={styles.buttons}>
            <View style={[styles.google, styles.googleFlexBox]}>
              <Image
                source={require("../../assets/images/google-icon.png")}
                style={styles.userIconLayout}
                resizeMode="cover"
              />
            </View>
            <Image
              source={require("../../assets/images/apple-icon.svg")}
              style={styles.facebookIcon}
              resizeMode="cover"
            />
            <Image
              source={require("../../assets/images/facebook-icon.svg")}
              style={styles.facebookIcon2}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
      <View style={[styles.loginWrapper, styles.passwordLayout]}>
        <Pressable style={styles.loginBtn} onPress={handleLogin}>
          <Text style={[styles.login, styles.loginTypo]}>Login</Text>
        </Pressable>
      </View>
      <View style={[styles.password, styles.passwordLayout]}>
        <View style={[styles.passwordChild, styles.passwordLayout]} />
        <Image
          source={require("../../assets/images/lock-icon.svg")}
          style={[styles.passwordItem, styles.iconLayout]}
          resizeMode="cover"
        />
        <TextInput
          style={[styles.password2, styles.password2Typo, styles.input]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Image
          source={require("../../assets/images/eye.svg")}
          style={styles.eyeIcon}
          resizeMode="cover"
        />
      </View>
      <View style={[styles.forgetPassword, styles.passwordLayout]}>
        <Pressable onPress={() => router.push("/forgot-password")}>
          <Text style={styles.password2Typo2}>Forgot Password?</Text>
        </Pressable>
      </View>
      <View style={[styles.usernameOrEmail, styles.passwordLayout]}>
        <View style={[styles.passwordChild, styles.passwordLayout]} />

        <TextInput
          style={[styles.usernameOrEmail2, styles.password2Typo, styles.input]}
          placeholder="Username or Email"
          value={email}
          onChangeText={setEmail}
        />

        <Image
          source={require("../../assets/images/User.svg")}
          style={[styles.userIcon, styles.userIconLayout]}
          resizeMode="cover"
        />
      </View>
    </View>
  ); */

/* const styles = StyleSheet.create({
  iconLayout: {
    maxHeight: "100%",
    position: "absolute",
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
  welcomeBackLayout: {
    width: 185,
    position: "absolute",
  },
  loginBtn: {},
  loginTypo: {
    fontFamily: "NunitoSans12pt-SemiBold",
    fontWeight: "600",
  },
  googleFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    // borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "70%",
  },
  passwordLayout: {
    width: 317,
    height: 55,
    position: "absolute",
  },
  password2Typo: {
    color: "#676767",
    top: 2,
    // border: "none",
    // fontFamily: "NunitoSans12pt-Medium",
    fontFamily: "NunitoSans_500Medium",
    fontSize: 12,
    // textAlign: "center",
    fontWeight: "500",
    position: "absolute",
  },
  password2Typo2: {
    color: "#676767",
    top: 20,
  },
  userIconLayout: {
    height: 24,
    width: 24,
  },
  logIn: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 874,
  },
  logInChild: {
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
    height: 47,
    left: "50%",
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
    width: 24,
    borderStyle: "solid",
    top: "0%",
    position: "absolute",
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
    maxHeight: "100%",
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
    textAlign: "center",
    fontWeight: "500",
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
  welcomeBack: {
    top: 136,
    fontSize: 36,
    lineHeight: 43,
    fontWeight: "700",
    // fontFamily: "NunitoSans12pt-Bold",
    fontFamily: "NunitoSans_700Bold",
    height: 83,
    textAlign: "left",
    left: 46,
    color: "#000",
    width: 185,
  },
  createAnAccountParent: {
    marginLeft: -92,
    top: 602,
    height: 138,
    left: "50%",
  },
  createAnAccount: {
    marginLeft: -86,
    top: 119,
    gap: 5,
    flexDirection: "row",
    left: "50%",
    position: "absolute",
  },
  createAnAccount2: {
    // fontFamily: "NunitoSans12pt-Regular",
    fontFamily: "NunitoSans_400Regular",
    color: "#575757",
    fontSize: 14,
    textAlign: "center",
  },
  signUp: {
    textDecorationLine: "underline",
    color: "#fe8c00",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  goodleFbSignIn: {
    marginLeft: -92,
    gap: 20,
    alignItems: "center",
    left: "50%",
    top: 0,
    position: "absolute",
  },
  orContinueWith: {
    // fontFamily: "NunitoSans12pt-Medium",
    fontFamily: "NunitoSans_500Medium",
    fontSize: 12,
    color: "#575757",
    textAlign: "center",
    fontWeight: "500",
  },
  buttons: {
    gap: 10,
    flexDirection: "row",
  },
  google: {
    backgroundColor: "#fff9ef",
    borderColor: "#fe8c00",
    padding: 15,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 50,
    overflow: "hidden",
  },
  facebookIcon: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  facebookIcon2: {
    height: 56,
    width: 56,
    borderRadius: 50,
  },
  loginWrapper: {
    marginLeft: -158,
    top: 472,
    borderRadius: 16,
    backgroundColor: "#fe8c00",
    paddingHorizontal: 109,
    paddingVertical: 21,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    left: "50%",
  },
  login: {
    fontSize: 20,
    color: "#fff",
    textAlign: "left",
  },
  forgetPassword: {
    top: 391,
    left: 46,
  },
  password: {
    top: 341,
    left: 46,
  },
  passwordChild: {
    borderRadius: 10,
    backgroundColor: "#fffbf4",
    borderColor: "#a8a8a9",
    borderWidth: 1,
    borderStyle: "solid",
    left: 0,
    top: 0,
  },
  passwordItem: {
    height: "36.36%",
    width: "5.05%",
    top: "30.91%",
    right: "90.22%",
    bottom: "32.73%",
    left: "4.73%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  password2: {
    left: 44,
  },
  eyeIcon: {
    top: 18,
    left: 281,
    width: 20,
    height: 20,
    position: "absolute",
  },
  usernameOrEmail: {
    top: 255,
    left: 46,
  },
  usernameOrEmail2: {
    left: 45,
  },
  userIcon: {
    top: 16,
    left: 11,
    position: "absolute",
  },
}); */

/* import { View, Text, StyleSheet } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen 🔐</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
}); */
