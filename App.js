import Realm from "realm";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Navigator from "./navigator";
import { ActivityIndicator } from "react-native";
import styled from "styled-components";
import colors from "./colors";

const FeelingSchema = {
  name: "Fealing",
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
  const realmLoading = async () => {
    const realm = await Realm.open({
      path: "diaryDB",
      schema: [FeelingSchema],
    });
    setLoading(false);
  };
  useEffect(() => {
    realmLoading();
  }, []);
  return loading ? (
    <Loader>
      <ActivityIndicator color="black" size="large" />
    </Loader>
  ) : (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
