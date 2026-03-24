// apps/mobile/src/app/signup.tsx

import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let valid = true;
    let temp: any = {};

    if (!email) {
      temp.email = "Email required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      temp.email = "Invalid email";
      valid = false;
    }

    if (!password) {
      temp.password = "Password required";
      valid = false;
    } else if (password.length < 6) {
      temp.password = "Min 6 characters";
      valid = false;
    }

    if (confirmPassword !== password) {
      temp.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(temp);
    return valid;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post("https://your-api.com/signup", {
        email,
        password,
      });

      console.log(res.data);

      Alert.alert("Success", "Account created!");
      router.replace("/login");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an {"\n"}account</Text>

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      {/* Password */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secure1}
        />
        <Pressable style={styles.eye} onPress={() => setSecure1(!secure1)}>
          <Text>{secure1 ? "👁️" : "🙈"}</Text>
        </Pressable>
      </View>
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      {/* Confirm Password */}
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secure2}
        />
        <Pressable style={styles.eye} onPress={() => setSecure2(!secure2)}>
          <Text>{secure2 ? "👁️" : "🙈"}</Text>
        </Pressable>
      </View>
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword}</Text>
      )}

      
      <Text style={styles.terms}>
        By clicking Register, you agree to our terms
      </Text>
      <Pressable style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
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
        <Text>I already have an account </Text>
        <Pressable onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Login</Text>
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
    fontSize: 34,
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

  terms: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 40,
    color: "#676767",
  },

  row: {
    flexDirection: "row",
    marginTop: 20,
  },

  link: {
    color: "#fe8c00",
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

/* import * as React from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";

export default function SignUp() {
  const router = useRouter();
  return (
    <View style={styles.signUp}>
      <View style={styles.signUpChild} />
      <View style={[styles.bar, styles.barLayout]}>
        <View style={[styles.bar2, styles.bar2Position]} />
      </View>
      <Text style={styles.createAnAccount}>Create an {"\n"}account</Text>
      <View style={[styles.createAccountWrapper, styles.googleFlexBox]}>
        <Text style={styles.createAccount}>Create Account</Text>
      </View>
      <View style={[styles.createAnAccountParent, styles.createPosition]}>
        <View style={[styles.createAnAccount2, styles.createPosition]}>
          <Text style={styles.iAlreadyHave}>I Already Have an Account</Text>

          <Pressable onPress={() => router.replace("/login")}>
            <Text style={styles.login}>Login</Text>
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
      <Text style={styles.byClickingTheContainer}>
        <Text style={styles.byClickingThe}>{`By clicking the `}</Text>
        <Text style={styles.register}>Register</Text>
        <Text style={styles.byClickingThe}>
          {" "}
          button, you agree to the public offer
        </Text>
      </Text>
      <View style={[styles.password, styles.passwordLayout]}>
        <View style={[styles.passwordChild, styles.googleBorder]} />
        <Image
          source={require("../../assets/images/lock-icon.svg")}
          style={[styles.passwordItem, styles.iconLayout]}
          resizeMode="cover"
        />
        <Text style={[styles.confirmpassword, styles.password3Typo]}>
          ConfirmPassword
        </Text>
        <Image
          source={require("../../assets/images/eye.svg")}
          style={styles.eyeIcon}
          resizeMode="cover"
        />
      </View>
      <View style={[styles.password2, styles.passwordLayout]}>
        <View style={[styles.passwordChild, styles.googleBorder]} />
        <Image
          source={require("../../assets/images/lock-icon.svg")}
          style={[styles.passwordItem, styles.iconLayout]}
          resizeMode="cover"
        />
        <Text style={[styles.password3, styles.password3Typo]}>Password</Text>
        <Image
          source={require("../../assets/images/eye.svg")}
          style={styles.eyeIcon}
          resizeMode="cover"
        />
      </View>
      <View style={[styles.usernameOrEmail, styles.passwordLayout]}>
        <View style={[styles.passwordChild, styles.googleBorder]} />
        <Text style={[styles.usernameOrEmail2, styles.password3Typo]}>
          Username or Email
        </Text>
        <Image
          source={require("../../assets/images/User.svg")}
          style={[styles.userIcon, styles.userIconLayout]}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  createPosition: {
    left: "50%",
    position: "absolute",
  },
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
  googleFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  googleBorder: {
    borderWidth: 1,
    borderStyle: "solid",
  },
  passwordLayout: {
    width: 317,
    height: 55,
    position: "absolute",
  },
  password3Typo: {
    top: 21,
    color: "#676767",
    // fontFamily: "NunitoSans12pt-Medium",
    fontFamily: "NunitoSans_500Medium",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    position: "absolute",
  },
  userIconLayout: {
    height: 24,
    width: 24,
  },
  signUp: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 874,
  },
  signUpChild: {
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
    top: 0,
    left: "50%",
    width: 402,
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
    color: "#000",
    fontWeight: "500",
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
  createAnAccount: {
    top: 120,
    fontSize: 36,
    lineHeight: 43,
    fontWeight: "700",
    // fontFamily: "NunitoSans12pt-Bold",
    fontFamily: "NunitoSans_700Bold",
    textAlign: "left",
    left: 44,
    color: "#000",
    position: "absolute",
  },
  createAccountWrapper: {
    top: 553,
    borderRadius: 16,
    backgroundColor: "#fe8c00",
    paddingHorizontal: 109,
    paddingVertical: 21,
    flexDirection: "row",
    height: 55,
    width: 317,
    position: "absolute",
    left: 44,
  },
  createAccount: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "NunitoSans12pt-SemiBold",
    fontWeight: "600",
    textAlign: "left",
  },
  createAnAccountParent: {
    marginLeft: -102,
    top: 648,
    width: 208,
    height: 138,
  },
  createAnAccount2: {
    marginLeft: -104,
    top: 119,
    gap: 5,
    flexDirection: "row",
  },
  iAlreadyHave: {
    color: "#575757",
    // fontFamily: "NunitoSans12pt-Regular",
    fontFamily: "NunitoSans_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  login: {
    textDecorationLine: "underline",
    color: "#fe8c00",
    fontSize: 14,
    fontFamily: "NunitoSans12pt-SemiBold",
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
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  facebookIcon: {
    width: 55,
    borderRadius: 50,
    height: 55,
  },
  facebookIcon2: {
    height: 56,
    width: 56,
    borderRadius: 50,
  },
  byClickingTheContainer: {
    top: 485,
    width: 258,
    left: 45,
    fontSize: 12,
    // fontFamily: "NunitoSans12pt-Regular",
    fontFamily: "NunitoSans_400Regular",
    textAlign: "left",
    position: "absolute",
  },
  byClickingThe: {
    color: "#676767",
  },
  register: {
    color: "#fe8c00",
  },
  password: {
    top: 411,
    height: 55,
    left: 44,
  },
  passwordChild: {
    borderRadius: 10,
    backgroundColor: "#fffbf4",
    borderColor: "#a8a8a9",
    height: 55,
    width: 317,
    position: "absolute",
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
  confirmpassword: {
    left: 48,
  },
  eyeIcon: {
    top: 18,
    left: 281,
    width: 20,
    height: 20,
    position: "absolute",
  },
  password2: {
    top: 325,
    height: 55,
    left: 44,
  },
  password3: {
    left: 44,
  },
  usernameOrEmail: {
    top: 239,
    height: 55,
    left: 44,
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
