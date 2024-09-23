import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import OptionCard from "../../components/CreateTrip/OptionCard";
import { Colors } from "../../constants/Colors";
import { SelectBudgetOptions } from "../../constants/Options";
import { CreateTripContext } from "../../context/CreateTripContext";
import { auth } from "../../configs/FirebaseConfig"; // Import Firebase auth

export default function SelectBudget() {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  const onClickContinue = async () => {
    if (!selectedOption) {
      ToastAndroid.show("Select Your Budget", ToastAndroid.LONG);
      return;
    }

    // Navigate to the next screen
    router.push("/create-trip/generate-trip");
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, [navigation]);

  useEffect(() => {
    selectedOption &&
      setTripData({
        ...tripData,
        budget: selectedOption?.title,
      });
  }, [selectedOption]);

  return (
    <View
      style={{
        paddingTop: 75,
        padding: 25,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 35,
          marginTop: 20,
        }}
      >
        Budget
      </Text>
      <View>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            marginTop: 20,
            fontSize: 21,
            marginBottom: 25,
          }}
        >
          Choose spending habits for your trip
        </Text>
      </View>

      <FlatList
        data={SelectBudgetOptions}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ marginVertical: 10 }}
            onPress={() => setSelectedOption(item)}
          >
            <OptionCard option={item} selectedOption={selectedOption} />
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={onClickContinue}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            color: Colors.WHITE,
            fontFamily: "outfit",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
