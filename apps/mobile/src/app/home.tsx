// app/home.tsx

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getCategories, getStores } from "../api";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function HomeScreen() {
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    getStores().then(setStores);
    getCategories().then(setCategories);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>Categories</Text>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("Category", { categoryId: item.id })}>
            <View style={{ padding: 8, marginRight: 8, backgroundColor: "#eee", borderRadius: 8 }}>
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 12 }}>Top Stores</Text>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("Store", { storeId: item.id })}>
            <View style={{ padding: 12, marginBottom: 8, backgroundColor: "#fafafa", borderRadius: 8 }}>
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <Text>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
} from "react-native";
// import LinearGradient from "react-native-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  return (
    <ScrollView style={[styles.mianScreen, styles.imgIconLayout1]}>

      <LinearGradient
        style={styles.header}
        locations={[0, 1]}
        colors={["#f54900", "#e7000b"]}
        // useAngle={true}
        // angle={90}
      >
        <View style={styles.div}>
          <Pressable style={styles.button} onPress={() => {}}>
            <Image
            source={require("../../assets/images/google-icon.png")}
              style={[styles.icon, styles.buttonLayout11]}
              resizeMode="cover"
            />
          </Pressable>
          <View style={styles.container}>
            <Pressable style={styles.button} onPress={() => {}}>
              <Image
              source={require("../../assets/images/google-icon.png")}
                style={[styles.icon, styles.buttonLayout11]}
                resizeMode="cover"
              />
            </Pressable>
            <Pressable style={styles.button3} onPress={() => {}}>
              <Image
              source={require("../../assets/images/google-icon.png")}
                style={[styles.icon, styles.buttonLayout11]}
                resizeMode="cover"
              />
            </Pressable>
          </View>
          <View style={[styles.container2, styles.inputLayout]}>
            <View style={[styles.input, styles.inputLayout]}>
              <Text style={[styles.searchSpicesRecipes, styles.watchCookTypo]}>
                Search spices, recipes...
              </Text>
            </View>
            <Image source={require("../../assets/images/google-icon.png")} style={styles.searchIcon} resizeMode="cover" />
          </View>
        </View>
      </LinearGradient>
      <LinearGradient
        style={[styles.container3, styles.containerLayout1]}
        locations={[0, 1]}
        colors={["#ff6900", "#e7000b"]}
        // useAngle={true}
        // angle={90}
      >
        <Image
        source={require("../../assets/images/google-icon.png")}
          style={[styles.imgIcon, styles.containerLayout1]}
          resizeMode="cover"
        />
        <View style={[styles.container4, styles.containerLayout1]}>
          <View style={[styles.h1, styles.pPosition]}>
            <Text style={[styles.welcomeToAsian, styles.textClr]}>
              Welcome to Asian Spices
            </Text>
          </View>
          <View style={[styles.p, styles.pPosition]}>
            <Text style={[styles.authenticFlavorsFrom, styles.text17Layout]}>
              Authentic flavors from across Asia
            </Text>
          </View>
          <View style={[styles.badge, styles.badgeSpaceBlock]}>
            <Text style={[styles.offOnSelected, styles.textTypo2]}>
              30% OFF on Selected Items
            </Text>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.section}>
        <View style={[styles.div2, styles.divFlexBox]}>
          <View style={styles.h2}>
            <Text style={[styles.categories, styles.powderClr]}>
              Categories
            </Text>
          </View>
          <View style={styles.button4}>
            <Text style={[styles.seeAll, styles.seeTypo]}>{`See All `}</Text>
            <Image
            source={require("../../assets/images/google-icon.png")}
              style={[styles.chevronrightIcon, styles.iconPosition]}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.div3}>
          <View style={[styles.button5, styles.buttonSpaceBlock2]}>
            <View style={styles.span}>
              <Text style={styles.text}>🌶️</Text>
            </View>
            <View style={styles.span2}>
              <Text style={[styles.spices, styles.herbsTypo]}>Spices</Text>
            </View>
          </View>
          <View style={[styles.button6, styles.buttonSpaceBlock1]}>
            <View style={styles.span3}>
              <Text style={styles.text}>🫚</Text>
            </View>
            <View style={styles.span4}>
              <Text style={[styles.spiceBlends, styles.herbsTypo]}>
                Spice Blends
              </Text>
            </View>
          </View>
          <View style={[styles.button7, styles.buttonSpaceBlock2]}>
            <View style={styles.span}>
              <Text style={styles.text}>🌿</Text>
            </View>
            <View style={styles.span6}>
              <Text style={[styles.herbs, styles.herbsTypo]}>Herbs</Text>
            </View>
          </View>
          <View style={[styles.button8, styles.buttonSpaceBlock2]}>
            <View style={styles.span}>
              <Text style={styles.text}>☕</Text>
            </View>
            <View style={styles.span8}>
              <Text style={[styles.spices, styles.herbsTypo]}>Beverages</Text>
            </View>
          </View>
          <View style={[styles.button9, styles.buttonLayout10]}>
            <View style={styles.span3}>
              <Text style={styles.text}>🌾</Text>
            </View>
            <View style={styles.span4}>
              <Text style={styles.riceGrains}>{`Rice & \nGrains`}</Text>
            </View>
          </View>
          <View style={[styles.button10, styles.buttonLayout10]}>
            <View style={styles.span}>
              <Text style={styles.text}>🫗</Text>
            </View>
            <View style={styles.span12}>
              <Text style={[styles.herbs, styles.herbsTypo]}>Oils</Text>
            </View>
          </View>
          <View style={[styles.button11, styles.buttonLayout10]}>
            <View style={styles.span}>
              <Text style={styles.text}>🍯</Text>
            </View>
            <View style={styles.span14}>
              <Text style={[styles.spices, styles.herbsTypo]}>Condiments</Text>
            </View>
          </View>
          <View style={[styles.button12, styles.buttonLayout10]}>
            <View style={styles.span3}>
              <Text style={styles.text}>🥄</Text>
            </View>
            <View style={styles.span4}>
              <Text style={[styles.kitchenTools, styles.herbsTypo]}>
                Kitchen{"\n"}Tools
              </Text>
            </View>
          </View>
        </View>
      </View>
      <LinearGradient
        style={[styles.section2, styles.sectionPosition1]}
        locations={[0, 1]}
        colors={["#faf5ff", "#fdf2f8"]}
        // useAngle={true}
        // angle={90}
      >
        <View style={[styles.div4, styles.divFlexBox]}>
          <View style={styles.container5}>
            <View style={styles.h22}>
              <Text style={[styles.categories, styles.powderClr]}>
                Trending Recipe Reels
              </Text>
            </View>
            <View style={styles.p2}>
              <Text
                style={[styles.watchCook, styles.text17Layout]}
              >{`Watch & Cook`}</Text>
            </View>
          </View>
          <Image
          source={require("../../assets/images/google-icon.png")}
            style={[ styles.iconLayout1]} // , styles.buttonIcon
            resizeMode="cover"
          />
        </View>
        <View style={styles.div5}>
          <View style={[styles.button13, styles.buttonShadowBox]}>
            <View style={styles.div6}>
              <Image source={require("../../assets/images/google-icon.png")} style={styles.imgIcon2} resizeMode="cover" />
              <LinearGradient
                style={styles.container6}
                locations={[0, 0.5, 1]}
                colors={[
                  "rgba(0, 0, 0, 0.7)",
                  "rgba(0, 0, 0, 0)",
                  "rgba(0, 0, 0, 0)",
                ]}
              />
              <View style={[styles.container7, styles.badgeFlexBox]}>
                <Image source={require("../../assets/images/google-icon.png")} style={styles.iconLayout1} resizeMode="cover" />
              </View>
              <View style={[styles.container8, styles.containerSpaceBlock1]}>
                <Text style={[styles.text9, styles.textTypo2]}>2:45</Text>
              </View>
              <View style={[styles.container9, styles.containerSpaceBlock1]}>
                <View style={[styles.container10, styles.containerFlexBox]}>
                  <Image source={require("../../assets/images/google-icon.png")} style={styles.imgIcon3} resizeMode="cover" />
                  <View style={styles.span17}>
                    <Text style={[styles.text9, styles.textTypo2]}>
                      Chef Priya
                    </Text>
                  </View>
                </View>
                <View style={styles.p3}>
                  <Text style={[styles.butterChickenRecipe, styles.textTypo2]}>
                    Butter Chicken Recipe
                  </Text>
                </View>
                <View style={styles.container11}>
                  <View style={styles.span18}>
                    <Image
                    source={require("../../assets/images/google-icon.png")}
                      style={[styles.eyeIcon, styles.iconLayout]}
                      resizeMode="cover"
                    />
                    <Text style={[styles.k, styles.textTypo2]}>45.2K</Text>
                  </View>
                  <View style={styles.span19}>
                    <Image
                    source={require("../../assets/images/google-icon.png")}
                      style={[styles.eyeIcon, styles.iconLayout]}
                      resizeMode="cover"
                    />
                    <Text style={[styles.k, styles.textTypo2]}>12.5K</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button13, styles.buttonShadowBox]}>
            <View style={styles.div6}>
              <Image source={require("../../assets/images/google-icon.png")} style={styles.imgIcon2} resizeMode="cover" />
              <LinearGradient
                style={styles.container6}
                locations={[0, 0.5, 1]}
                colors={[
                  "rgba(0, 0, 0, 0.7)",
                  "rgba(0, 0, 0, 0)",
                  "rgba(0, 0, 0, 0)",
                ]}
              />
              <View style={[styles.container7, styles.badgeFlexBox]}>
                <Image style={styles.iconLayout1} resizeMode="cover" />
              </View>
              <View style={[styles.container14, styles.span72Layout]}>
                <Text style={[styles.text9, styles.textTypo2]}>3:12</Text>
              </View>
              <View style={[styles.container9, styles.containerSpaceBlock1]}>
                <View style={[styles.container10, styles.containerFlexBox]}>
                  <Image style={styles.imgIcon3} resizeMode="cover" />
                  <View style={styles.span20}>
                    <Text style={[styles.text9, styles.textTypo2]}>
                      Ravi Kumar
                    </Text>
                  </View>
                </View>
                <View style={styles.p3}>
                  <Text style={[styles.butterChickenRecipe, styles.textTypo2]}>
                    Biryani Masala Mix
                  </Text>
                </View>
                <View style={styles.container11}>
                  <View style={styles.span18}>
                    <Image
                      style={[styles.eyeIcon, styles.iconLayout]}
                      resizeMode="cover"
                    />
                    <Text style={[styles.k, styles.textTypo2]}>67.8K</Text>
                  </View>
                  <View style={styles.span19}>
                    <Image
                      style={[styles.eyeIcon, styles.iconLayout]}
                      resizeMode="cover"
                    />
                    <Text style={[styles.k, styles.textTypo2]}>18.7K</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button13, styles.buttonShadowBox]}>
            <View style={styles.div6}>
              <Image style={styles.imgIcon2} resizeMode="cover" />
              <LinearGradient
                style={styles.container6}
                locations={[0, 0.5, 1]}
                colors={[
                  "rgba(0, 0, 0, 0.7)",
                  "rgba(0, 0, 0, 0)",
                  "rgba(0, 0, 0, 0)",
                ]}
              />
              <View style={[styles.container7, styles.badgeFlexBox]}>
                <Image style={styles.iconLayout1} resizeMode="cover" />
              </View>
              <View style={[styles.container8, styles.containerSpaceBlock1]}>
                <Text style={[styles.text9, styles.textTypo2]}>2:30</Text>
              </View>
              <View style={[styles.container9, styles.containerSpaceBlock1]}>
                <View style={[styles.container10, styles.containerFlexBox]}>
                  <Image style={styles.imgIcon3} resizeMode="cover" />
                  <View style={styles.span20}>
                    <Text style={[styles.text9, styles.textTypo2]}>
                      Sarah Chen
                    </Text>
                  </View>
                </View>
                <View style={styles.p5}>
                  <Text style={[styles.text9, styles.textTypo2]}>
                    Thai Green Curry
                  </Text>
                </View>
                <View style={styles.container11}>
                  <View style={styles.span18}>
                    <Image
                      style={[styles.eyeIcon, styles.iconLayout]}
                      resizeMode="cover"
                    />
                    <Text style={[styles.k, styles.textTypo2]}>32.4K</Text>
                  </View>
                  <View style={styles.span25}>
                    <Image
                      style={[styles.eyeIcon, styles.iconLayout]}
                      resizeMode="cover"
                    />
                    <Text style={[styles.k, styles.textTypo2]}>9.8K</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button13, styles.buttonShadowBox]}>
            <View style={styles.div6}>
              <Image style={styles.imgIcon2} resizeMode="cover" />
              <LinearGradient
                style={styles.container6}
                locations={[0, 0.5, 1]}
                colors={[
                  "rgba(0, 0, 0, 0.7)",
                  "rgba(0, 0, 0, 0)",
                  "rgba(0, 0, 0, 0)",
                ]}
              />
              <View style={[styles.container7, styles.badgeFlexBox]}>
                <Image style={styles.iconLayout1} resizeMode="cover" />
              </View>
              <View style={[styles.container14, styles.span72Layout]}>
                <Text style={[styles.text9, styles.textTypo2]}>1:45</Text>
              </View>
              <View style={[styles.container9, styles.containerSpaceBlock1]}>
                <View style={[styles.container10, styles.containerFlexBox]}>
                  <Image style={styles.imgIcon3} resizeMode="cover" />
                  <View style={styles.span26}>
                    <Text style={[styles.text9, styles.textTypo2]}>
                      Amit Singh
                    </Text>
                  </View>
                </View>
                <View style={styles.p3}>
                  <Text style={[styles.masalaChaiTutorial, styles.textTypo2]}>
                    Masala Chai Tutorial
                  </Text>
                </View>
                <View style={styles.container11}>
                  <View style={styles.span19}>
                    <Image
                      style={[styles.eyeIcon, styles.iconLayout]}
                      resizeMode="cover"
                    />
                    <Text style={[styles.k, styles.textTypo2]}>51.2K</Text>
                  </View>
                  <View style={styles.span19}>
                    <Image
                      style={[styles.eyeIcon, styles.iconLayout]}
                      resizeMode="cover"
                    />
                    <Text style={[styles.k, styles.textTypo2]}>15.3K</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button13, styles.buttonShadowBox]}>
            <View style={styles.div6}>
              <Image style={styles.imgIcon2} resizeMode="cover" />
              <LinearGradient
                style={styles.container6}
                locations={[0, 0.5, 1]}
                colors={[
                  "rgba(0, 0, 0, 0.7)",
                  "rgba(0, 0, 0, 0)",
                  "rgba(0, 0, 0, 0)",
                ]}
              />
              <View style={[styles.container7, styles.badgeFlexBox]}>
                <Image style={styles.iconLayout1} resizeMode="cover" />
              </View>
              <View style={[styles.container8, styles.containerSpaceBlock1]}>
                <Text style={[styles.text9, styles.textTypo2]}>2:55</Text>
              </View>
              <View style={[styles.container9, styles.containerSpaceBlock1]}>
                <View style={[styles.container10, styles.containerFlexBox]}>
                  <Image style={styles.imgIcon3} resizeMode="cover" />
                  <View style={styles.span26}>
                    <Text style={[styles.text9, styles.textTypo2]}>
                      Maya Patel
                    </Text>
                  </View>
                </View>
                <View style={styles.p5}>
                  <Text style={[styles.text9, styles.textTypo2]}>
                    Tandoori Chicken
                  </Text>
                </View>
                <View style={styles.container11}>
                  <View style={styles.span18}>
                    <Image
                      style={[styles.eyeIcon, styles.iconLayout]}
                      resizeMode="cover"
                    />
                    <Text style={[styles.k, styles.textTypo2]}>89.5K</Text>
                  </View>
                  <View style={styles.span31}>
                    <Image
                      style={[styles.eyeIcon, styles.iconLayout]}
                      resizeMode="cover"
                    />
                    <Text style={[styles.k, styles.textTypo2]}>21.4K</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
      <View style={[styles.section3, styles.sectionPosition1]}>
        <View style={[styles.div2, styles.divFlexBox]}>
          <View style={styles.h23}>
            <Text style={[styles.categories, styles.powderClr]}>
              Top Products
            </Text>
          </View>
          <View style={styles.button18}>
            <Text style={[styles.seeMore, styles.seeTypo]}>{`See More `}</Text>
            <Image
              style={[styles.chevronrightIcon2, styles.iconPosition]}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.div12}>
          <View style={[styles.button19, styles.buttonShadowBox]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container36, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-30%</Text>
              </View>
            </View>
            <View style={styles.div14}>
              <View style={[styles.h3, styles.h3Position]}>
                <Text style={[styles.organicTurmericPowder, styles.seeTypo]}>
                  Organic Turmeric Powder
                </Text>
              </View>
              <View style={[styles.container37, styles.p9Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span32}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.8</Text>
                </View>
                <View style={styles.span33}>
                  <Text style={styles.textTypo}>(234)</Text>
                </View>
              </View>
              <View style={[styles.container38, styles.containerPosition3]}>
                <View style={[styles.span34, styles.spanLayout]}>
                  <Text style={[styles.text17, styles.textTypo1]}>$8.99</Text>
                </View>
                <View style={styles.span35}>
                  <Text style={[styles.text18, styles.textTypo]}>$12.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button20, styles.buttonShadowBox]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon13, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container36, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-25%</Text>
              </View>
            </View>
            <View style={styles.div16}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.redChiliPowder, styles.powderClr]}>
                  Red Chili Powder
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span36}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.6</Text>
                </View>
                <View style={styles.span37}>
                  <Text style={styles.textTypo}>(189)</Text>
                </View>
              </View>
              <View style={[styles.container41, styles.containerPosition2]}>
                <View style={[styles.span34, styles.spanLayout]}>
                  <Text style={[styles.text17, styles.textTypo1]}>$6.99</Text>
                </View>
                <View style={styles.span39}>
                  <Text style={[styles.text18, styles.textTypo]}>$9.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button21, styles.buttonLayout9]}>
            <Image
              style={[styles.imgIcon14, styles.div13Layout]}
              resizeMode="cover"
            />
            <View style={styles.div16}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.ceylonCinnamonSticks, styles.powderClr]}>
                  Ceylon Cinnamon Sticks
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span36}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.9</Text>
                </View>
                <View style={styles.span37}>
                  <Text style={styles.textTypo}>(156)</Text>
                </View>
              </View>
              <View style={[styles.container43, styles.containerPosition2]}>
                <View style={styles.span42}>
                  <Text style={[styles.text17, styles.textTypo1]}>$11.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button22, styles.buttonLayout9]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container36, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-20%</Text>
              </View>
            </View>
            <View style={styles.div16}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.ceylonCinnamonSticks, styles.powderClr]}>
                  Green Cardamom Pods
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span32}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.7</Text>
                </View>
                <View style={styles.span44}>
                  <Text style={styles.textTypo}>(112)</Text>
                </View>
              </View>
              <View style={[styles.container41, styles.containerPosition2]}>
                <View style={styles.span45}>
                  <Text style={[styles.text17, styles.textTypo1]}>$14.99</Text>
                </View>
                <View style={styles.span35}>
                  <Text style={[styles.text18, styles.textTypo]}>$18.99</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.divParent, styles.divLayout]}>
        <View style={[styles.div20, styles.divLayout]}>
          <View style={styles.container47}>
            <View style={styles.h22}>
              <Text style={[styles.categories, styles.powderClr]}>
                Kitchen Appliances
              </Text>
            </View>
            <View style={styles.p2}>
              <Text style={[styles.watchCook, styles.text17Layout]}>
                Essential cooking tools
              </Text>
            </View>
          </View>
          <View style={styles.button4}>
            <Text style={[styles.seeAll, styles.seeTypo]}>{`See All `}</Text>
            <Image
              style={[styles.chevronrightIcon, styles.iconPosition]}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={[styles.div21, styles.divLayout]}>
          <View style={[styles.button24, styles.buttonLayout8]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container36, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-29%</Text>
              </View>
            </View>
            <View style={styles.div23}>
              <View style={[styles.h3, styles.h3Position]}>
                <Text style={[styles.electricSpiceGrinder, styles.seeTypo]}>
                  Electric Spice Grinder Pro
                </Text>
              </View>
              <View style={styles.p9Position}>
                <Text style={[styles.spicemaster, styles.textTypo2]}>
                  SpiceMaster
                </Text>
              </View>
              <View style={[styles.container49, styles.h3Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span32}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.7</Text>
                </View>
                <View style={styles.span33}>
                  <Text style={styles.textTypo}>(342)</Text>
                </View>
              </View>
              <View style={[styles.container50, styles.containerPosition1]}>
                <View style={styles.span49}>
                  <Text style={[styles.text17, styles.textTypo1]}>$49.99</Text>
                </View>
                <View style={[styles.span50, styles.span50Layout]}>
                  <Text style={[styles.text18, styles.textTypo]}>$69.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button25, styles.buttonLayout8]}>
            <Image
              style={[styles.imgIcon17, styles.imgIconLayout1]}
              resizeMode="cover"
            />
            <View style={styles.div14}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.redChiliPowder, styles.powderClr]}>
                  Manual Spice Mill
                </Text>
              </View>
              <View style={styles.p10Position}>
                <Text style={[styles.spicemaster, styles.textTypo2]}>
                  Heritage Kitchen
                </Text>
              </View>
              <View style={[styles.container37, styles.p9Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span32}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.5</Text>
                </View>
                <View style={styles.span37}>
                  <Text style={styles.textTypo}>(156)</Text>
                </View>
              </View>
              <View style={styles.containerPosition3}>
                <View style={styles.span49}>
                  <Text style={[styles.text17, styles.textTypo1]}>$24.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button26, styles.buttonLayout7]}>
            <Image
              style={[styles.imgIcon14, styles.div13Layout]}
              resizeMode="cover"
            />
            <View style={styles.div23}>
              <View style={[styles.h3, styles.h3Position]}>
                <Text style={[styles.commercialSpiceGrinder, styles.seeTypo]}>
                  Commercial Spice Grinder
                </Text>
              </View>
              <View style={styles.p9Position}>
                <Text style={[styles.spicemaster, styles.textTypo2]}>
                  ChefPro
                </Text>
              </View>
              <View style={[styles.container49, styles.h3Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span36}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.9</Text>
                </View>
                <View style={styles.span55}>
                  <Text style={styles.textTypo}>(89)</Text>
                </View>
              </View>
              <View style={styles.containerPosition1}>
                <View style={styles.span56}>
                  <Text style={[styles.text17, styles.textTypo1]}>$89.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button27, styles.buttonLayout7]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container36, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-22%</Text>
              </View>
            </View>
            <View style={styles.div23}>
              <View style={[styles.h3, styles.h3Position]}>
                <Text
                  style={[styles.graniteMortar, styles.seeTypo]}
                >{`Granite Mortar & Pestle Set`}</Text>
              </View>
              <View style={styles.p9Position}>
                <Text style={[styles.spicemaster, styles.textTypo2]}>
                  StoneKraft
                </Text>
              </View>
              <View style={[styles.container49, styles.h3Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span32}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.8</Text>
                </View>
                <View style={styles.span33}>
                  <Text style={styles.textTypo}>(267)</Text>
                </View>
              </View>
              <View style={[styles.container50, styles.containerPosition1]}>
                <View style={styles.span49}>
                  <Text style={[styles.text17, styles.textTypo1]}>$34.99</Text>
                </View>
                <View style={styles.span60}>
                  <Text style={[styles.text18, styles.textTypo]}>$44.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button28, styles.buttonLayout6]}>
            <Image
              style={[styles.imgIcon14, styles.div13Layout]}
              resizeMode="cover"
            />
            <View style={styles.div14}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text
                  style={[styles.ceylonCinnamonSticks, styles.powderClr]}
                >{`Marble Mortar & Pestle`}</Text>
              </View>
              <View style={styles.p10Position}>
                <Text style={[styles.spicemaster, styles.textTypo2]}>
                  Artisan Home
                </Text>
              </View>
              <View style={[styles.container37, styles.p9Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span36}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.6</Text>
                </View>
                <View style={styles.span37}>
                  <Text style={styles.textTypo}>(198)</Text>
                </View>
              </View>
              <View style={styles.containerPosition3}>
                <View style={styles.span56}>
                  <Text style={[styles.text17, styles.textTypo1]}>$28.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button29, styles.buttonLayout6]}>
            <Image
              style={[styles.imgIcon14, styles.div13Layout]}
              resizeMode="cover"
            />
            <View style={styles.div14}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text
                  style={[styles.ceylonCinnamonSticks, styles.powderClr]}
                >{`Wooden Mortar & Pestle`}</Text>
              </View>
              <View style={styles.p10Position}>
                <Text style={[styles.spicemaster, styles.textTypo2]}>
                  EcoWood
                </Text>
              </View>
              <View style={[styles.container37, styles.p9Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span36}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.4</Text>
                </View>
                <View style={styles.span37}>
                  <Text style={styles.textTypo}>(134)</Text>
                </View>
              </View>
              <View style={styles.containerPosition3}>
                <View style={styles.span45}>
                  <Text style={[styles.text17, styles.textTypo1]}>$18.99</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.section4, styles.sectionPosition1]}>
        <View style={[styles.div4, styles.divFlexBox]}>
          <View style={styles.container62}>
            <View style={styles.h22}>
              <Text style={[styles.categories, styles.powderClr]}>
                Featured Recipes
              </Text>
            </View>
            <View style={styles.p2}>
              <Text style={[styles.tryTheseDelicious, styles.text17Layout]}>
                Try these delicious dishes
              </Text>
            </View>
          </View>
          <View style={styles.button4}>
            <Text style={[styles.seeAll, styles.seeTypo]}>{`See All `}</Text>
            <Image
              style={[styles.chevronrightIcon, styles.iconPosition]}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.div31}>
          <View style={[styles.button19, styles.buttonShadowBox]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container63, styles.containerSpaceBlock1]}>
                <Text style={[styles.text14, styles.textTypo1]}>55min</Text>
              </View>
              <View style={[styles.container64, styles.containerSpaceBlock1]}>
                <Text style={[styles.text14, styles.textTypo1]}>Medium</Text>
              </View>
            </View>
            <View style={styles.div33}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.redChiliPowder, styles.powderClr]}>
                  Spicy Samosas
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span32}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.8</Text>
                </View>
                <View style={styles.span33}>
                  <Text style={styles.textTypo}>(542)</Text>
                </View>
              </View>
              <View style={[styles.p16, styles.containerPosition2]}>
                <Text style={[styles.servings, styles.textTypo2]}>
                  12 servings
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.button32, styles.buttonShadowBox]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container63, styles.containerSpaceBlock1]}>
                <Text style={[styles.text14, styles.textTypo1]}>35min</Text>
              </View>
              <View style={[styles.container67, styles.span50Layout]}>
                <Text style={[styles.text14, styles.textTypo1]}>Easy</Text>
              </View>
            </View>
            <View style={styles.div33}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.redChiliPowder, styles.powderClr]}>
                  Paneer Tikka
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span36}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.9</Text>
                </View>
                <View style={styles.span33}>
                  <Text style={styles.textTypo}>(678)</Text>
                </View>
              </View>
              <View style={[styles.p16, styles.containerPosition2]}>
                <Text style={[styles.servings, styles.textTypo2]}>
                  4 servings
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.button33, styles.buttonLayout5]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container63, styles.containerSpaceBlock1]}>
                <Text style={[styles.text14, styles.textTypo1]}>70min</Text>
              </View>
              <View style={[styles.container64, styles.containerSpaceBlock1]}>
                <Text style={[styles.text14, styles.textTypo1]}>Medium</Text>
              </View>
            </View>
            <View style={styles.div33}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.redChiliPowder, styles.powderClr]}>
                  Butter Chicken
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span36}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.9</Text>
                </View>
                <View style={[styles.span72, styles.span72Layout]}>
                  <Text style={styles.textTypo}>(1245)</Text>
                </View>
              </View>
              <View style={[styles.p16, styles.containerPosition2]}>
                <Text style={[styles.servings, styles.textTypo2]}>
                  6 servings
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.button34, styles.buttonLayout5]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container63, styles.containerSpaceBlock1]}>
                <Text style={[styles.text14, styles.textTypo1]}>45min</Text>
              </View>
              <View style={[styles.container67, styles.span50Layout]}>
                <Text style={[styles.text14, styles.textTypo1]}>Easy</Text>
              </View>
            </View>
            <View style={styles.div33}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.redChiliPowder, styles.powderClr]}>
                  Palak Paneer
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span32}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.7</Text>
                </View>
                <View style={styles.span33}>
                  <Text style={styles.textTypo}>(867)</Text>
                </View>
              </View>
              <View style={[styles.p16, styles.containerPosition2]}>
                <Text style={[styles.servings, styles.textTypo2]}>
                  4 servings
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <LinearGradient
        style={[styles.section5, styles.sectionPosition1]}
        locations={[0, 1]}
        colors={["#fff7ed", "#fef2f2"]}
        // useAngle={true}
        // angle={90}
      >
        <View style={[styles.div4, styles.divFlexBox]}>
          <View style={styles.container75}>
            <View style={styles.h22}>
              <Text style={[styles.categories, styles.powderClr]}>
                Special Discounts
              </Text>
            </View>
            <View style={styles.p2}>
              <Text style={[styles.watchCook, styles.text17Layout]}>
                Limited time offers
              </Text>
            </View>
          </View>
          <View style={styles.button18}>
            <Text style={[styles.seeMore, styles.seeTypo]}>{`See More `}</Text>
            <Image
              style={[styles.chevronrightIcon2, styles.iconPosition]}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.div41}>
          <View style={[styles.button36, styles.buttonLayout4]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container36, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-30%</Text>
              </View>
            </View>
            <View style={styles.div14}>
              <View style={[styles.h3, styles.h3Position]}>
                <Text style={[styles.organicTurmericPowder, styles.seeTypo]}>
                  Organic Turmeric Powder
                </Text>
              </View>
              <View style={[styles.container37, styles.p9Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span32}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.8</Text>
                </View>
                <View style={styles.span33}>
                  <Text style={styles.textTypo}>(234)</Text>
                </View>
              </View>
              <View style={[styles.container38, styles.containerPosition3]}>
                <View style={[styles.span34, styles.spanLayout]}>
                  <Text style={[styles.text17, styles.textTypo1]}>$8.99</Text>
                </View>
                <View style={styles.span35}>
                  <Text style={[styles.text18, styles.textTypo]}>$12.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button37, styles.buttonLayout4]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container36, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-25%</Text>
              </View>
            </View>
            <View style={styles.div16}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.redChiliPowder, styles.powderClr]}>
                  Red Chili Powder
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span36}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.6</Text>
                </View>
                <View style={styles.span37}>
                  <Text style={styles.textTypo}>(189)</Text>
                </View>
              </View>
              <View style={[styles.container41, styles.containerPosition2]}>
                <View style={[styles.span34, styles.spanLayout]}>
                  <Text style={[styles.text17, styles.textTypo1]}>$6.99</Text>
                </View>
                <View style={styles.span39}>
                  <Text style={[styles.text18, styles.textTypo]}>$9.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button38, styles.buttonLayout3]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container36, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-25%</Text>
              </View>
            </View>
            <View style={styles.div16}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.redChiliPowder, styles.powderClr]}>
                  Kashmiri Chili Powder
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span36}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.9</Text>
                </View>
                <View style={styles.span37}>
                  <Text style={styles.textTypo}>(198)</Text>
                </View>
              </View>
              <View style={[styles.container41, styles.containerPosition2]}>
                <View style={[styles.span34, styles.spanLayout]}>
                  <Text style={[styles.text17, styles.textTypo1]}>$8.99</Text>
                </View>
                <View style={[styles.span72, styles.span72Layout]}>
                  <Text style={[styles.text18, styles.textTypo]}>$11.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button39, styles.buttonLayout3]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container85, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-17%</Text>
              </View>
            </View>
            <View style={styles.div16}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.redChiliPowder, styles.powderClr]}>
                  Saffron Threads
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span87}>
                  <Text style={[styles.text15, styles.textTypo2]}>5</Text>
                </View>
                <View style={styles.span55}>
                  <Text style={styles.textTypo}>(87)</Text>
                </View>
              </View>
              <View style={[styles.container41, styles.containerPosition2]}>
                <View style={styles.span49}>
                  <Text style={[styles.text17, styles.textTypo1]}>$24.99</Text>
                </View>
                <View style={[styles.span50, styles.span50Layout]}>
                  <Text style={[styles.text18, styles.textTypo]}>$29.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button40, styles.buttonLayout2]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container36, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-20%</Text>
              </View>
            </View>
            <View style={styles.div16}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.ceylonCinnamonSticks, styles.powderClr]}>
                  Green Cardamom Pods
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span32}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.7</Text>
                </View>
                <View style={styles.span44}>
                  <Text style={styles.textTypo}>(112)</Text>
                </View>
              </View>
              <View style={[styles.container41, styles.containerPosition2]}>
                <View style={styles.span45}>
                  <Text style={[styles.text17, styles.textTypo1]}>$14.99</Text>
                </View>
                <View style={styles.span35}>
                  <Text style={[styles.text18, styles.textTypo]}>$18.99</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.button41, styles.buttonLayout2]}>
            <View style={styles.div13Layout}>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container36, styles.containerSpaceBlock]}>
                <Text style={[styles.text14, styles.textTypo1]}>-28%</Text>
              </View>
            </View>
            <View style={styles.div16}>
              <View style={[styles.h32, styles.h3Position]}>
                <Text style={[styles.redChiliPowder, styles.powderClr]}>
                  Garam Masala
                </Text>
              </View>
              <View style={[styles.container40, styles.p10Position]}>
                <Image style={styles.iconLayout} resizeMode="cover" />
                <View style={styles.span32}>
                  <Text style={[styles.text15, styles.textTypo2]}>4.8</Text>
                </View>
                <View style={styles.span33}>
                  <Text style={styles.textTypo}>(267)</Text>
                </View>
              </View>
              <View style={[styles.container41, styles.containerPosition2]}>
                <View style={[styles.span34, styles.spanLayout]}>
                  <Text style={[styles.text17, styles.textTypo1]}>$9.99</Text>
                </View>
                <View style={styles.span35}>
                  <Text style={[styles.text18, styles.textTypo]}>$13.99</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
      <View style={[styles.sectionParent, styles.sectionParentLayout]}>
        <LinearGradient
          style={[styles.section6, styles.sectionPosition]}
          locations={[0, 1]}
          colors={["#ecfdf5", "#f0fdfa"]}
        //   useAngle={true}
        //   angle={135}
        >
          <View style={[styles.div4, styles.divFlexBox]}>
            <View style={styles.container95}>
              <Image style={styles.containerIcon6} resizeMode="cover" />
              <View style={styles.container96}>
                <View style={styles.h22}>
                  <Text style={[styles.newArrivals, styles.powderClr]}>
                    New Arrivals
                  </Text>
                </View>
                <View style={styles.p2}>
                  <Text style={[styles.tryTheseDelicious, styles.text17Layout]}>
                    Latest herbal wellness products
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.button4}>
              <Text style={[styles.seeAll, styles.seeTypo]}>{`See All `}</Text>
              <Image
                style={[styles.chevronrightIcon, styles.iconPosition]}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.container97}>
            <View style={[styles.button43, styles.buttonShadowBox]}>
              <View style={[styles.container98, styles.containerPosition]}>
                <View style={[styles.h3, styles.h3Position]}>
                  <Text
                    style={[styles.turmericCurcuminCapsules, styles.seeTypo]}
                  >
                    Turmeric Curcumin Capsules
                  </Text>
                </View>
                <View style={[styles.container37, styles.p9Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span32}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.8</Text>
                  </View>
                  <View style={styles.span33}>
                    <Text style={styles.textTypo}>(487)</Text>
                  </View>
                </View>
                <View style={[styles.container38, styles.containerPosition3]}>
                  <View style={styles.span49}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $24.99
                    </Text>
                  </View>
                  <View style={[styles.span50, styles.span50Layout]}>
                    <Text style={[styles.text18, styles.textTypo]}>$32.99</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.imgIcon12, styles.imgIconLayout]}>
                <Image
                  style={[styles.imgIcon12, styles.imgIconLayout]}
                  resizeMode="cover"
                />
                <View style={[styles.container102, styles.containerSpaceBlock]}>
                  <Text style={[styles.text14, styles.textTypo1]}>-24%</Text>
                </View>
              </View>
              <View style={[styles.container103, styles.badgeSpaceBlock]}>
                <Text style={styles.new}>NEW</Text>
              </View>
            </View>
            <View style={[styles.button44, styles.buttonShadowBox]}>
              <View style={[styles.container98, styles.containerPosition]}>
                <View style={[styles.h3, styles.h3Position]}>
                  <Text
                    style={[styles.ashwagandhaRootCapsules, styles.seeTypo]}
                  >
                    Ashwagandha Root Capsules
                  </Text>
                </View>
                <View style={[styles.container37, styles.p9Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span32}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.7</Text>
                  </View>
                  <View style={styles.span33}>
                    <Text style={styles.textTypo}>(352)</Text>
                  </View>
                </View>
                <View style={[styles.container38, styles.containerPosition3]}>
                  <View style={styles.span45}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $19.99
                    </Text>
                  </View>
                  <View style={[styles.span50, styles.span50Layout]}>
                    <Text style={[styles.text18, styles.textTypo]}>$26.99</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.imgIcon12, styles.imgIconLayout]}>
                <Image
                  style={[styles.imgIcon12, styles.imgIconLayout]}
                  resizeMode="cover"
                />
                <View style={[styles.container36, styles.containerSpaceBlock]}>
                  <Text style={[styles.text14, styles.textTypo1]}>-26%</Text>
                </View>
              </View>
              <View style={[styles.container103, styles.badgeSpaceBlock]}>
                <Text style={styles.new}>NEW</Text>
              </View>
            </View>
            <View style={[styles.button45, styles.buttonLayout1]}>
              <View style={[styles.container110, styles.containerPosition]}>
                <View style={[styles.h32, styles.h3Position]}>
                  <Text style={[styles.redChiliPowder, styles.powderClr]}>
                    Spirulina Powder
                  </Text>
                </View>
                <View style={[styles.container40, styles.p10Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span32}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.7</Text>
                  </View>
                  <View style={styles.span37}>
                    <Text style={styles.textTypo}>(421)</Text>
                  </View>
                </View>
                <View style={[styles.container43, styles.containerPosition2]}>
                  <View style={styles.span56}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $27.99
                    </Text>
                  </View>
                </View>
              </View>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container103, styles.badgeSpaceBlock]}>
                <Text style={styles.new}>NEW</Text>
              </View>
            </View>
            <View style={[styles.button46, styles.buttonLayout1]}>
              <View style={[styles.container110, styles.containerPosition]}>
                <View style={[styles.h32, styles.h3Position]}>
                  <Text style={[styles.redChiliPowder, styles.powderClr]}>
                    Chamomile Herbal Tea
                  </Text>
                </View>
                <View style={[styles.container40, styles.p10Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span32}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.8</Text>
                  </View>
                  <View style={styles.span33}>
                    <Text style={styles.textTypo}>(543)</Text>
                  </View>
                </View>
                <View style={[styles.container43, styles.containerPosition2]}>
                  <View style={styles.span45}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $14.99
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={[styles.imageChamomileHerbalTea, styles.imgIconLayout]}
              />
              <View style={[styles.container103, styles.badgeSpaceBlock]}>
                <Text style={styles.new}>NEW</Text>
              </View>
            </View>
            <View style={[styles.button47, styles.buttonLayout]}>
              <View style={[styles.container110, styles.containerPosition]}>
                <View style={[styles.h32, styles.h3Position]}>
                  <Text style={[styles.redChiliPowder, styles.powderClr]}>
                    Green Tea with Tulsi
                  </Text>
                </View>
                <View style={[styles.container40, styles.p10Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span32}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.7</Text>
                  </View>
                  <View style={styles.span33}>
                    <Text style={styles.textTypo}>(389)</Text>
                  </View>
                </View>
                <View style={[styles.container41, styles.containerPosition2]}>
                  <View style={styles.span45}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $16.99
                    </Text>
                  </View>
                  <View style={styles.span35}>
                    <Text style={[styles.text18, styles.textTypo]}>$21.99</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.imgIcon12, styles.imgIconLayout]}>
                <Image
                  style={[styles.imgIcon12, styles.imgIconLayout]}
                  resizeMode="cover"
                />
                <View style={[styles.container36, styles.containerSpaceBlock]}>
                  <Text style={[styles.text14, styles.textTypo1]}>-23%</Text>
                </View>
              </View>
              <View style={[styles.container103, styles.badgeSpaceBlock]}>
                <Text style={styles.new}>NEW</Text>
              </View>
            </View>
            <View style={[styles.button48, styles.buttonLayout]}>
              <View style={[styles.container110, styles.containerPosition]}>
                <View style={[styles.h32, styles.h3Position]}>
                  <Text style={[styles.redChiliPowder, styles.powderClr]}>
                    Rosehip Face Oil
                  </Text>
                </View>
                <View style={[styles.container40, styles.p10Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span36}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.9</Text>
                  </View>
                  <View style={styles.span37}>
                    <Text style={styles.textTypo}>(612)</Text>
                  </View>
                </View>
                <View style={[styles.container43, styles.containerPosition2]}>
                  <View style={styles.span56}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $29.99
                    </Text>
                  </View>
                </View>
              </View>
              <Image
                style={[styles.imgIcon12, styles.imgIconLayout]}
                resizeMode="cover"
              />
              <View style={[styles.container103, styles.badgeSpaceBlock]}>
                <Text style={styles.new}>NEW</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={[styles.section7, styles.sectionPosition]}>
          <View style={[styles.div4, styles.divFlexBox]}>
            <View style={styles.container129}>
              <Image style={styles.containerIcon6} resizeMode="cover" />
              <View style={styles.container96}>
                <View style={styles.h22}>
                  <Text style={[styles.categories, styles.powderClr]}>
                    Herbal Products
                  </Text>
                </View>
                <View style={styles.p2}>
                  <Text style={[styles.tryTheseDelicious, styles.text17Layout]}>
                    Natural wellness essentials
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.button4}>
              <Text style={[styles.seeAll, styles.seeTypo]}>{`See All `}</Text>
              <Image
                style={[styles.chevronrightIcon, styles.iconPosition]}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.container97}>
            <View style={[styles.button19, styles.buttonShadowBox]}>
              <View style={styles.div13Layout}>
                <Image
                  style={[styles.imgIcon12, styles.imgIconLayout]}
                  resizeMode="cover"
                />
                <View style={[styles.container102, styles.containerSpaceBlock]}>
                  <Text style={[styles.text14, styles.textTypo1]}>-24%</Text>
                </View>
              </View>
              <View style={styles.div14}>
                <View style={[styles.h3, styles.h3Position]}>
                  <Text
                    style={[styles.turmericCurcuminCapsules, styles.seeTypo]}
                  >
                    Turmeric Curcumin Capsules
                  </Text>
                </View>
                <View style={[styles.container37, styles.p9Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span32}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.8</Text>
                  </View>
                  <View style={styles.span33}>
                    <Text style={styles.textTypo}>(487)</Text>
                  </View>
                </View>
                <View style={[styles.container38, styles.containerPosition3]}>
                  <View style={styles.span49}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $24.99
                    </Text>
                  </View>
                  <View style={[styles.span50, styles.span50Layout]}>
                    <Text style={[styles.text18, styles.textTypo]}>$32.99</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.button32, styles.buttonShadowBox]}>
              <View style={styles.div13Layout}>
                <Image
                  style={[styles.imgIcon12, styles.imgIconLayout]}
                  resizeMode="cover"
                />
                <View style={[styles.container36, styles.containerSpaceBlock]}>
                  <Text style={[styles.text14, styles.textTypo1]}>-26%</Text>
                </View>
              </View>
              <View style={styles.div14}>
                <View style={[styles.h3, styles.h3Position]}>
                  <Text
                    style={[styles.ashwagandhaRootCapsules, styles.seeTypo]}
                  >
                    Ashwagandha Root Capsules
                  </Text>
                </View>
                <View style={[styles.container37, styles.p9Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span32}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.7</Text>
                  </View>
                  <View style={styles.span33}>
                    <Text style={styles.textTypo}>(352)</Text>
                  </View>
                </View>
                <View style={[styles.container38, styles.containerPosition3]}>
                  <View style={styles.span45}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $19.99
                    </Text>
                  </View>
                  <View style={[styles.span50, styles.span50Layout]}>
                    <Text style={[styles.text18, styles.textTypo]}>$26.99</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.button52, styles.buttonLayout1]}>
              <Image
                style={[styles.imgIcon14, styles.div13Layout]}
                resizeMode="cover"
              />
              <View style={styles.div16}>
                <View style={[styles.h32, styles.h3Position]}>
                  <Text style={[styles.ceylonCinnamonSticks, styles.powderClr]}>
                    Moringa Leaf Capsules
                  </Text>
                </View>
                <View style={[styles.container40, styles.p10Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span36}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.6</Text>
                  </View>
                  <View style={styles.span33}>
                    <Text style={styles.textTypo}>(298)</Text>
                  </View>
                </View>
                <View style={[styles.container43, styles.containerPosition2]}>
                  <View style={styles.span45}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $21.99
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.button53, styles.buttonLayout1]}>
              <Image
                style={[styles.imgIcon14, styles.div13Layout]}
                resizeMode="cover"
              />
              <View style={styles.div16}>
                <View style={[styles.h32, styles.h3Position]}>
                  <Text style={[styles.redChiliPowder, styles.powderClr]}>
                    Spirulina Powder
                  </Text>
                </View>
                <View style={[styles.container40, styles.p10Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span32}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.7</Text>
                  </View>
                  <View style={styles.span37}>
                    <Text style={styles.textTypo}>(421)</Text>
                  </View>
                </View>
                <View style={[styles.container43, styles.containerPosition2]}>
                  <View style={styles.span56}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $27.99
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.button54, styles.buttonLayout]}>
              <View style={styles.div13Layout}>
                <Image
                  style={[styles.imgIcon12, styles.imgIconLayout]}
                  resizeMode="cover"
                />
                <View style={[styles.container102, styles.containerSpaceBlock]}>
                  <Text style={[styles.text14, styles.textTypo1]}>-24%</Text>
                </View>
              </View>
              <View style={styles.div16}>
                <View style={[styles.h32, styles.h3Position]}>
                  <Text style={[styles.redChiliPowder, styles.powderClr]}>
                    Wheatgrass Powder
                  </Text>
                </View>
                <View style={[styles.container40, styles.p10Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span32}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.5</Text>
                  </View>
                  <View style={styles.span33}>
                    <Text style={styles.textTypo}>(267)</Text>
                  </View>
                </View>
                <View style={[styles.container41, styles.containerPosition2]}>
                  <View style={styles.span45}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $18.99
                    </Text>
                  </View>
                  <View style={styles.span60}>
                    <Text style={[styles.text18, styles.textTypo]}>$24.99</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.button55, styles.buttonLayout]}>
              <View
                style={[styles.imageChamomileHerbalTea2, styles.div13Layout]}
              />
              <View style={styles.div16}>
                <View style={[styles.h32, styles.h3Position]}>
                  <Text style={[styles.redChiliPowder, styles.powderClr]}>
                    Chamomile Herbal Tea
                  </Text>
                </View>
                <View style={[styles.container40, styles.p10Position]}>
                  <Image style={styles.iconLayout} resizeMode="cover" />
                  <View style={styles.span32}>
                    <Text style={[styles.text15, styles.textTypo2]}>4.8</Text>
                  </View>
                  <View style={styles.span33}>
                    <Text style={styles.textTypo}>(543)</Text>
                  </View>
                </View>
                <View style={[styles.container43, styles.containerPosition2]}>
                  <View style={styles.span45}>
                    <Text style={[styles.text17, styles.textTypo1]}>
                      $14.99
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.navWrapper, styles.navLayout]}>
        <View style={[styles.nav, styles.navLayout]}>
          <View style={styles.div54}>
            <View style={[styles.button56, styles.buttonSpaceBlock]}>
              <Image style={styles.homeIcon} resizeMode="cover" />
              <View style={[styles.span72, styles.span72Layout]}>
                <Text style={[styles.home, styles.textTypo2]}>Home</Text>
              </View>
            </View>
            <View style={[styles.button57, styles.buttonSpaceBlock]}>
              <Image style={styles.homeIcon} resizeMode="cover" />
              <View style={styles.span100}>
                <Text style={[styles.categories2, styles.textTypo2]}>
                  Categories
                </Text>
              </View>
            </View>
            <View style={[styles.button58, styles.buttonSpaceBlock]}>
              <Image style={styles.homeIcon} resizeMode="cover" />
              <View style={styles.span33}>
                <Text style={[styles.categories2, styles.textTypo2]}>
                  Reels
                </Text>
              </View>
            </View>
            <View style={[styles.button59, styles.buttonSpaceBlock]}>
              <Image style={styles.homeIcon} resizeMode="cover" />
              <View style={styles.span102}>
                <Text style={[styles.categories2, styles.textTypo2]}>Chat</Text>
              </View>
            </View>
            <View style={[styles.button60, styles.buttonSpaceBlock]}>
              <Image style={styles.homeIcon} resizeMode="cover" />
              <View style={[styles.span103, styles.spanLayout]}>
                <Text style={[styles.categories2, styles.textTypo2]}>
                  Profile
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imgIconLayout1: {
    maxWidth: "100%",
    width: "100%",
  },
  sectionParentLayout: {
    width: 402,
    position: "absolute",
  },
  batteryPosition: {
    right: 0,
    position: "absolute",
  },
  buttonLayout11: {
    height: "100%",
    width: "100%",
  },
  inputLayout: {
    width: 218,
    height: 40,
    top: 0,
    position: "absolute",
  },
  watchCookTypo: {
    fontFamily: "Inter-Regular",
    textAlign: "left",
  },
  containerLayout1: {
    height: 192,
    left: 0,
    width: 402,
    position: "absolute",
  },
  pPosition: {
    width: 354,
    left: 24,
    position: "absolute",
  },
  textClr: {
    color: "#fff",
    textAlign: "left",
  },
  text17Layout: {
    lineHeight: 20,
    fontSize: 14,
  },
  badgeSpaceBlock: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: "row",
    position: "absolute",
  },
  textTypo2: {
    fontFamily: "Inter-Medium",
    fontWeight: "500",
  },
  divFlexBox: {
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  powderClr: {
    color: "#0a0a0a",
    textAlign: "left",
  },
  seeTypo: {
    top: -1,
    fontFamily: "Inter-Medium",
    lineHeight: 20,
    fontSize: 14,
    fontWeight: "500",
    position: "absolute",
  },
  iconPosition: {
    top: 2,
    position: "absolute",
  },
  buttonSpaceBlock2: {
    paddingBottom: 27,
    paddingTop: 12,
  },
  herbsTypo: {
    color: "#364153",
    lineHeight: 15,
    top: -1,
    fontFamily: "Inter-Medium",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    position: "absolute",
  },
  buttonSpaceBlock1: {
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  buttonLayout10: {
    top: 110,
    gap: 8,
    borderRadius: 14,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    height: "100%",
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  sectionPosition1: {
    paddingTop: 16,
    gap: 16,
    paddingHorizontal: 16,
    left: 0,
    width: 402,
    position: "absolute",
  },
  iconLayout1: {
    height: 32,
    width: 32,
    borderRadius: 33554400,
  },
  buttonShadowBox: {
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  badgeFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  containerSpaceBlock1: {
    paddingHorizontal: 6,
    position: "absolute",
  },
  containerFlexBox: {
    gap: 4,
    alignItems: "center",
  },
  iconLayout: {
    height: 12,
    width: 12,
  },
  span72Layout: {
    width: 33,
    flexDirection: "row",
  },
  imgIconLayout: {
    width: 179,
    height: 179,
    left: 0,
    position: "absolute",
  },
  containerSpaceBlock: {
    backgroundColor: "#fb2c36",
    paddingHorizontal: 6,
    top: 6,
    paddingVertical: 2,
    borderRadius: 8,
    height: 20,
    flexDirection: "row",
    position: "absolute",
  },
  textTypo1: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
  },
  h3Position: {
    width: 159,
    left: 10,
    position: "absolute",
  },
  p9Position: {
    top: 54,
    width: 159,
    left: 10,
    height: 16,
    flexDirection: "row",
    position: "absolute",
  },
  containerPosition3: {
    top: 76,
    width: 159,
    left: 10,
    height: 20,
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  spanLayout: {
    width: 35,
    flexDirection: "row",
  },
  textTypo: {
    color: "#99a1af",
    fontFamily: "Inter-Medium",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
    fontWeight: "500",
  },
  p10Position: {
    top: 34,
    width: 159,
    left: 10,
    height: 16,
    flexDirection: "row",
    position: "absolute",
  },
  containerPosition2: {
    top: 56,
    width: 159,
    left: 10,
    flexDirection: "row",
    position: "absolute",
  },
  buttonLayout9: {
    height: 283,
    top: 309,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    borderRadius: 10,
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  div13Layout: {
    height: 179,
    alignSelf: "stretch",
  },
  divLayout: {
    width: 370,
    position: "absolute",
  },
  buttonLayout8: {
    height: 319,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    borderRadius: 10,
    top: 0,
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  containerPosition1: {
    top: 96,
    width: 159,
    left: 10,
    height: 20,
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  span50Layout: {
    width: 36,
    flexDirection: "row",
  },
  buttonLayout7: {
    height: 325,
    top: 331,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    borderRadius: 10,
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  buttonLayout6: {
    height: 285,
    top: 668,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    borderRadius: 10,
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  buttonLayout5: {
    top: 273,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    borderRadius: 10,
    height: "100%",
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  buttonLayout4: {
    height: 302,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    borderRadius: 10,
    top: 0,
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  buttonLayout3: {
    height: 275,
    top: 591,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    borderRadius: 10,
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  buttonLayout2: {
    height: 265,
    top: 314,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    borderRadius: 10,
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  sectionPosition: {
    height: 935,
    paddingTop: 16,
    gap: 16,
    paddingHorizontal: 16,
    left: 0,
    width: 402,
    position: "absolute",
  },
  containerPosition: {
    top: 179,
    width: 179,
    left: 0,
    position: "absolute",
  },
  buttonLayout1: {
    top: 297,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    borderRadius: 10,
    height: "100%",
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  buttonLayout: {
    top: 574,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    borderRadius: 10,
    height: "100%",
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
  },
  navLayout: {
    height: 77,
    left: 0,
    width: 402,
    position: "absolute",
  },
  buttonSpaceBlock: {
    paddingVertical: 8,
    height: 60,
    gap: 4,
    paddingHorizontal: 0,
    alignItems: "center",
    borderRadius: 10,
  },
  mianScreen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mianScreenChild: {
    top: 5371,
    left: 402,
    backgroundColor: "#f2f2f2",
    height: 5371,
    transform: [
      {
        rotate: "180deg",
      },
    ],
  },
  barsStatusBarDesignL: {
    marginLeft: -201,
    left: "50%",
    height: 47,
    top: 0,
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
  },
  border: {
    right: 3,
    bottom: "0%",
    borderRadius: 3,
    borderColor: "#000",
    borderWidth: 1,
    opacity: 0,
    width: 24,
    borderStyle: "solid",
    top: "0%",
    height: "100%",
    position: "absolute",
  },
  capIcon: {
    height: "35.54%",
    top: "32.48%",
    bottom: "31.98%",
    width: 1,
    opacity: 0,
    maxHeight: "100%",
  },
  capacity: {
    height: "65.29%",
    top: "17.72%",
    right: 5,
    bottom: "16.99%",
    borderRadius: 1,
    backgroundColor: "#000",
    width: 19,
    position: "absolute",
  },
  wifiIcon: {
    height: "96.72%",
    right: 32,
    bottom: "3.28%",
    width: 16,
    maxHeight: "100%",
    top: "0%",
    position: "absolute",
  },
  cellularConnectionIcon: {
    height: "93.44%",
    top: "2.95%",
    right: 53,
    bottom: "3.6%",
    width: 18,
    maxHeight: "100%",
    position: "absolute",
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
    lineHeight: 21,
    fontFamily: "Poppins-Medium",
    color: "#000",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
    position: "absolute",
  },
  header: {
    top: 47,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    elevation: 6,
    backgroundColor: "transparent",
    paddingTop: 12,
    paddingHorizontal: 16,
    height: 64,
    left: 0,
    width: 402,
    position: "absolute",
  },
  div: {
    height: 40,
    alignSelf: "stretch",
  },
  button: {
    width: 40,
    height: 40,
    left: 0,
    top: 0,
    position: "absolute",
  },
  icon: {
    // nodeWidth: 40,
    // nodeHeight: 40,
    borderRadius: 10,
  },
  container: {
    left: 282,
    width: 88,
    height: 40,
    top: 0,
    position: "absolute",
  },
  button3: {
    left: 48,
    width: 40,
    height: 40,
    top: 0,
    position: "absolute",
  },
  container2: {
    left: 52,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingLeft: 40,
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 8,
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 33554400,
    left: 0,
  },
  searchSpicesRecipes: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  searchIcon: {
    left: 12,
    width: 20,
    height: 20,
    top: 10,
    position: "absolute",
  },
  container3: {
    top: 111,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  imgIcon: {
    opacity: 0,
    top: 0,
  },
  container4: {
    top: 0,
  },
  h1: {
    top: 45,
    height: 36,
  },
  welcomeToAsian: {
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    lineHeight: 36,
    fontSize: 30,
    top: -2,
    color: "#fff",
    left: 0,
    position: "absolute",
  },
  p: {
    top: 89,
    height: 20,
    flexDirection: "row",
  },
  authenticFlavorsFrom: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "left",
    fontFamily: "Inter-Regular",
    flex: 1,
  },
  badge: {
    top: 125,
    backgroundColor: "#fdc700",
    width: 166,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    left: 24,
    paddingVertical: 2,
    paddingHorizontal: 8,
    overflow: "hidden",
  },
  offOnSelected: {
    color: "#101828",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
  },
  section: {
    top: 319,
    height: 300,
    paddingTop: 24,
    gap: 16,
    paddingHorizontal: 16,
    left: 0,
    width: 402,
    position: "absolute",
  },
  div2: {
    height: 28,
    alignSelf: "stretch",
  },
  h2: {
    width: 96,
    height: 28,
    flexDirection: "row",
  },
  categories: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 28,
    fontSize: 20,
    color: "#0a0a0a",
  },
  button4: {
    width: 63,
    height: 20,
  },
  seeAll: {
    color: "#f54900",
    left: -1,
    textAlign: "center",
  },
  chevronrightIcon: {
    left: 47,
    height: 16,
    width: 16,
  },
  div3: {
    height: 208,
    alignSelf: "stretch",
  },
  button5: {
    gap: 8,
    borderRadius: 14,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    alignItems: "center",
    left: 0,
    height: "100%",
    width: "100%",
    top: 0,
    position: "absolute",
  },
  span: {
    width: 41,
    height: 36,
  },
  text: {
    left: 6,
    color: "#0a0a0a",
    fontFamily: "Inter-Medium",
    lineHeight: 36,
    fontSize: 30,
    top: -2,
    textAlign: "center",
    fontWeight: "500",
    position: "absolute",
  },
  span2: {
    height: 15,
    width: 34,
  },
  spices: {
    left: -2,
  },
  button6: {
    left: 96,
    gap: 8,
    borderRadius: 14,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    alignItems: "center",
    height: "100%",
    width: "100%",
    top: 0,
    position: "absolute",
  },
  span3: {
    width: 41,
    flex: 1,
  },
  span4: {
    height: 30,
    width: 60,
  },
  spiceBlends: {
    left: -7,
  },
  button7: {
    left: 191,
    gap: 8,
    borderRadius: 14,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    alignItems: "center",
    height: "100%",
    width: "100%",
    top: 0,
    position: "absolute",
  },
  span6: {
    width: 32,
    height: 15,
  },
  herbs: {
    left: -1,
  },
  button8: {
    left: 287,
    gap: 8,
    borderRadius: 14,
    elevation: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    alignItems: "center",
    height: "100%",
    width: "100%",
    top: 0,
    position: "absolute",
  },
  span8: {
    width: 55,
    height: 15,
  },
  button9: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    left: 0,
  },
  riceGrains: {
    left: 10,
    color: "#364153",
    lineHeight: 15,
    top: -1,
    fontFamily: "Inter-Medium",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    position: "absolute",
  },
  button10: {
    left: 96,
    paddingBottom: 27,
    paddingTop: 12,
  },
  span12: {
    width: 21,
    height: 15,
  },
  button11: {
    left: 191,
    paddingBottom: 27,
    paddingTop: 12,
  },
  span14: {
    width: 66,
    height: 15,
  },
  button12: {
    left: 287,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  kitchenTools: {
    left: 7,
  },
  section2: {
    top: 635,
    height: 295,
    backgroundColor: "transparent",
  },
  div4: {
    height: 48,
    alignSelf: "stretch",
  },
  container5: {
    width: 198,
    height: 48,
  },
  h22: {
    height: 28,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  p2: {
    height: 20,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  watchCook: {
    color: "#4a5565",
    textAlign: "left",
    fontFamily: "Inter-Regular",
    flex: 1,
  },
  buttonIcon: {
    boxShadow:
      "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)",
  },
  div5: {
    gap: 12,
    height: 199,
    flexDirection: "row",
    overflow: "hidden",
    alignSelf: "stretch",
  },
  button13: {
    width: 112,
    height: 199,
    overflow: "hidden",
    borderRadius: 10,
  },
  div6: {
    height: 199,
    alignSelf: "stretch",
  },
  imgIcon2: {
    width: 112,
    height: 199,
    left: 0,
    top: 0,
    position: "absolute",
  },
  container6: {
    width: 112,
    height: 199,
    backgroundColor: "transparent",
    left: 0,
    top: 0,
    position: "absolute",
  },
  container7: {
    width: 112,
    height: 199,
    flexDirection: "row",
    left: 0,
    top: 0,
    position: "absolute",
  },
  container8: {
    left: 71,
    width: 35,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 6,
    top: 6,
    paddingVertical: 2,
    height: 20,
    borderRadius: 4,
  },
  text9: {
    lineHeight: 16,
    fontSize: 12,
    color: "#fff",
    textAlign: "left",
  },
  container9: {
    top: 135,
    paddingTop: 6,
    gap: 2,
    width: 112,
    paddingHorizontal: 6,
    height: 64,
    left: 0,
  },
  container10: {
    height: 16,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  imgIcon3: {
    height: 14,
    width: 14,
    borderRadius: 33554400,
  },
  span17: {
    width: 55,
    height: 16,
    flexDirection: "row",
    overflow: "hidden",
  },
  p3: {
    height: 16,
    overflow: "hidden",
    alignSelf: "stretch",
  },
  butterChickenRecipe: {
    width: 80,
    lineHeight: 16,
    fontSize: 12,
    color: "#fff",
    textAlign: "left",
    left: 0,
    top: 0,
    position: "absolute",
  },
  container11: {
    gap: 8,
    height: 16,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  span18: {
    width: 44,
    height: 16,
  },
  eyeIcon: {
    top: 2,
    position: "absolute",
    left: 0,
  },
  k: {
    left: 14,
    lineHeight: 16,
    fontSize: 12,
    color: "#fff",
    textAlign: "left",
    top: 0,
    position: "absolute",
  },
  span19: {
    width: 42,
    height: 16,
  },
  container14: {
    left: 73,
    paddingHorizontal: 6,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    top: 6,
    paddingVertical: 2,
    height: 20,
    borderRadius: 4,
  },
  span20: {
    width: 62,
    height: 16,
    flexDirection: "row",
    overflow: "hidden",
  },
  p5: {
    height: 16,
    flexDirection: "row",
    overflow: "hidden",
    alignSelf: "stretch",
  },
  span25: {
    width: 38,
    height: 16,
  },
  span26: {
    width: 60,
    height: 16,
    flexDirection: "row",
    overflow: "hidden",
  },
  masalaChaiTutorial: {
    width: 66,
    lineHeight: 16,
    fontSize: 12,
    color: "#fff",
    textAlign: "left",
    left: 0,
    top: 0,
    position: "absolute",
  },
  span31: {
    width: 43,
    height: 16,
  },
  section3: {
    top: 946,
    height: 670,
  },
  h23: {
    width: 118,
    height: 28,
    flexDirection: "row",
  },
  button18: {
    width: 80,
    height: 20,
  },
  seeMore: {
    left: -2,
    color: "#f54900",
    textAlign: "center",
  },
  chevronrightIcon2: {
    left: 64,
    height: 16,
    width: 16,
  },
  div12: {
    height: 310,
    alignSelf: "stretch",
  },
  button19: {
    overflow: "hidden",
    borderRadius: 10,
    left: 0,
    height: "100%",
    width: "100%",
    top: 0,
    position: "absolute",
  },
  imgIcon12: {
    top: 0,
  },
  container36: {
    left: 133,
    backgroundColor: "#fb2c36",
    width: 40,
  },
  text14: {
    lineHeight: 16,
    fontSize: 12,
    color: "#fff",
    textAlign: "left",
  },
  div14: {
    height: 106,
    alignSelf: "stretch",
  },
  h3: {
    top: 10,
    overflow: "hidden",
    height: 40,
  },
  organicTurmericPowder: {
    width: 109,
    color: "#0a0a0a",
    textAlign: "left",
    left: 0,
  },
  container37: {
    gap: 4,
    alignItems: "center",
  },
  span32: {
    height: 16,
    flexDirection: "row",
    width: 16,
  },
  text15: {
    color: "#4a5565",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
  },
  span33: {
    width: 28,
    height: 16,
    flexDirection: "row",
  },
  container38: {
    gap: 8,
  },
  span34: {
    height: 20,
  },
  text17: {
    color: "#f54900",
    lineHeight: 20,
    fontSize: 14,
    textAlign: "left",
  },
  span35: {
    width: 34,
    height: 16,
    flexDirection: "row",
  },
  text18: {
    textDecorationLine: "line-through",
  },
  button20: {
    paddingTop: 10,
    left: 191,
    overflow: "hidden",
    borderRadius: 10,
    height: "100%",
    width: "100%",
    top: 0,
    position: "absolute",
  },
  imgIcon13: {
    top: -10,
  },
  div16: {
    height: 86,
    alignSelf: "stretch",
  },
  h32: {
    height: 20,
    top: 10,
    flexDirection: "row",
    overflow: "hidden",
  },
  redChiliPowder: {
    fontFamily: "Inter-Medium",
    fontWeight: "500",
    lineHeight: 20,
    fontSize: 14,
    flex: 1,
  },
  container40: {
    gap: 4,
    alignItems: "center",
  },
  span36: {
    width: 17,
    height: 16,
    flexDirection: "row",
  },
  span37: {
    height: 16,
    flexDirection: "row",
    width: 26,
  },
  container41: {
    gap: 8,
    height: 20,
    alignItems: "center",
  },
  span39: {
    width: 30,
    height: 16,
    flexDirection: "row",
  },
  button21: {
    left: 0,
  },
  imgIcon14: {
    overflow: "hidden",
    maxWidth: "100%",
    width: "100%",
  },
  ceylonCinnamonSticks: {
    fontFamily: "Inter-Medium",
    fontWeight: "500",
    lineHeight: 20,
    fontSize: 14,
  },
  container43: {
    height: 20,
    alignItems: "center",
  },
  span42: {
    width: 38,
    height: 20,
    flexDirection: "row",
  },
  button22: {
    left: 191,
  },
  span44: {
    height: 16,
    flexDirection: "row",
    width: 24,
  },
  span45: {
    height: 20,
    flexDirection: "row",
    width: 40,
  },
  divParent: {
    top: 3515,
    left: 16,
    height: 1017,
  },
  div20: {
    height: 48,
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    left: 0,
    top: 0,
  },
  container47: {
    width: 172,
    height: 48,
  },
  div21: {
    top: 64,
    left: 0,
  },
  button24: {
    left: 0,
  },
  div23: {
    height: 126,
    alignSelf: "stretch",
  },
  electricSpiceGrinder: {
    width: 135,
    color: "#0a0a0a",
    textAlign: "left",
    left: 0,
  },
  spicemaster: {
    color: "#f54900",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
    flex: 1,
  },
  container49: {
    top: 74,
    gap: 4,
    alignItems: "center",
    height: 16,
    flexDirection: "row",
  },
  container50: {
    gap: 8,
  },
  span49: {
    width: 43,
    height: 20,
    flexDirection: "row",
  },
  span50: {
    height: 16,
  },
  button25: {
    left: 191,
  },
  imgIcon17: {
    height: 189,
    overflow: "hidden",
    alignSelf: "stretch",
  },
  button26: {
    left: 0,
  },
  commercialSpiceGrinder: {
    width: 114,
    color: "#0a0a0a",
    textAlign: "left",
    left: 0,
  },
  span55: {
    width: 21,
    height: 16,
    flexDirection: "row",
  },
  span56: {
    width: 42,
    height: 20,
    flexDirection: "row",
  },
  button27: {
    left: 191,
  },
  graniteMortar: {
    width: 150,
    color: "#0a0a0a",
    textAlign: "left",
    left: 0,
  },
  span60: {
    width: 37,
    height: 16,
    flexDirection: "row",
  },
  button28: {
    left: 0,
  },
  button29: {
    left: 191,
  },
  section4: {
    top: 4569,
    height: 630,
  },
  container62: {
    width: 156,
    height: 48,
  },
  tryTheseDelicious: {
    color: "#4a5565",
    textAlign: "left",
    fontFamily: "Inter-Regular",
  },
  div31: {
    height: 534,
    alignSelf: "stretch",
  },
  container63: {
    backgroundColor: "#f54900",
    width: 46,
    top: 6,
    paddingHorizontal: 6,
    left: 6,
    paddingVertical: 2,
    borderRadius: 8,
    height: 20,
    flexDirection: "row",
  },
  container64: {
    left: 116,
    width: 57,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 6,
    top: 6,
    paddingVertical: 2,
    height: 20,
    borderRadius: 8,
    flexDirection: "row",
  },
  div33: {
    height: 82,
    alignSelf: "stretch",
  },
  p16: {
    height: 16,
  },
  servings: {
    color: "#6a7282",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "left",
    flex: 1,
  },
  button32: {
    left: 191,
    overflow: "hidden",
    borderRadius: 10,
    height: "100%",
    width: "100%",
    top: 0,
    position: "absolute",
  },
  container67: {
    left: 137,
    paddingHorizontal: 6,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    top: 6,
    paddingVertical: 2,
    height: 20,
    borderRadius: 8,
  },
  button33: {
    left: 0,
  },
  span72: {
    height: 16,
  },
  button34: {
    left: 191,
  },
  section5: {
    top: 5236,
    height: 946,
    backgroundColor: "transparent",
  },
  container75: {
    width: 158,
    height: 48,
  },
  div41: {
    alignSelf: "stretch",
  },
  button36: {
    left: 0,
  },
  button37: {
    left: 191,
  },
  button38: {
    left: 0,
  },
  button39: {
    left: 191,
  },
  container85: {
    left: 135,
    width: 38,
  },
  span87: {
    width: 7,
    height: 16,
    flexDirection: "row",
  },
  button40: {
    left: 0,
  },
  button41: {
    left: 191,
  },
  sectionParent: {
    top: 1616,
    height: 1870,
    left: 0,
  },
  section6: {
    backgroundColor: "transparent",
    top: 0,
  },
  container95: {
    width: 241,
    height: 48,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  containerIcon6: {
    borderRadius: 14,
    width: 40,
    height: 40,
  },
  container96: {
    height: 48,
    flex: 1,
  },
  newArrivals: {
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 28,
    fontSize: 20,
    color: "#0a0a0a",
    flex: 1,
  },
  container97: {
    height: 839,
    alignSelf: "stretch",
  },
  button43: {
    overflow: "hidden",
    borderRadius: 10,
    left: 0,
    height: "100%",
    width: "100%",
    top: 0,
    position: "absolute",
  },
  container98: {
    height: 106,
  },
  turmericCurcuminCapsules: {
    width: 120,
    color: "#0a0a0a",
    textAlign: "left",
    left: 0,
  },
  container102: {
    left: 133,
    backgroundColor: "#fb2c36",
    width: 41,
  },
  container103: {
    top: 8,
    left: 8,
    backgroundColor: "#009966",
    width: 39,
    height: 19,
  },
  new: {
    fontSize: 10,
    lineHeight: 15,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    color: "#fff",
    textAlign: "left",
  },
  button44: {
    left: 191,
    overflow: "hidden",
    borderRadius: 10,
    height: "100%",
    width: "100%",
    top: 0,
    position: "absolute",
  },
  ashwagandhaRootCapsules: {
    width: 124,
    color: "#0a0a0a",
    textAlign: "left",
    left: 0,
  },
  button45: {
    left: 0,
  },
  container110: {
    height: 86,
  },
  button46: {
    left: 191,
  },
  imageChamomileHerbalTea: {
    overflow: "hidden",
    top: 0,
  },
  button47: {
    left: 0,
  },
  button48: {
    left: 191,
  },
  section7: {
    top: 935,
    backgroundColor: "#fff",
  },
  container129: {
    width: 212,
    height: 48,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  button52: {
    left: 0,
  },
  button53: {
    left: 191,
  },
  button54: {
    left: 0,
  },
  button55: {
    left: 191,
  },
  imageChamomileHerbalTea2: {
    overflow: "hidden",
  },
  navWrapper: {
    top: 798,
  },
  nav: {
    borderColor: "#e5e7eb",
    borderTopWidth: 1,
    paddingTop: 9,
    paddingHorizontal: 16,
    height: 77,
    borderStyle: "solid",
    top: 0,
    backgroundColor: "#fff",
  },
  div54: {
    paddingLeft: 7,
    paddingRight: 7,
    gap: 14,
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  button56: {
    width: 57,
  },
  homeIcon: {
    maxHeight: "100%",
    width: 24,
    flex: 1,
  },
  home: {
    color: "#f54900",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "center",
  },
  button57: {
    width: 82,
  },
  span100: {
    height: 16,
    flexDirection: "row",
    width: 58,
  },
  categories2: {
    color: "#4a5565",
    lineHeight: 16,
    fontSize: 12,
    textAlign: "center",
  },
  button58: {
    width: 52,
  },
  button59: {
    width: 49,
  },
  span102: {
    width: 25,
    height: 16,
    flexDirection: "row",
  },
  button60: {
    width: 59,
  },
  span103: {
    height: 16,
  },
}); */

/* import { useRouter } from "expo-router";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";

export default function HomeScreen() {
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
 */
