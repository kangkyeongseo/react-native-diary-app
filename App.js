import Realm from "realm";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Navigator from "./navigator";
import { ActivityIndicator } from "react-native";
import styled from "styled-components";
import colors from "./colors";
import { DBContext } from "./context";
import { setTestDeviceIDAsync } from "expo-ads-admob";

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.bgColor};
`;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [realm, setRealm] = useState(null);
  const realmLoading = async () => {
    const connection = await Realm.open({
      path: "diaryDB",
      schema: [FeelingSchema],
    });
    setRealm(connection);
    setLoading(false);
    await setTestDeviceIDAsync("EMULATOR");
  };
  useEffect(() => {
    realmLoading();
  }, []);
  return loading ? (
    <Loader>
      <ActivityIndicator color="black" size="large" />
    </Loader>
  ) : (
    <DBContext.Provider value={realm}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
