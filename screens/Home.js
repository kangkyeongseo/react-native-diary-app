import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";
import { useDB } from "../context";
import { FlatList, LayoutAnimation, TouchableOpacity } from "react-native";
import { AdMobBanner } from "expo-ads-admob";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0px 50px;
  padding-top: 100px;
  background-color: ${colors.bgColor};
`;
const Title = styled.Text`
  width: 100%;
  color: ${colors.textColor};
  font-size: 38px;
`;

const Btn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 50px;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.btnColor};
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
`;

const Record = styled.View`
  background-color: ${colors.cardColor};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-radius: 10px;
`;

const Emotion = styled.Text`
  font-size: 20px;
  margin-right: 10px;
`;

const Message = styled.Text`
  font-size: 18px;
  font-weight: 400;
`;

const Column = styled.View`
  flex-direction: row;
`;

const Seperator = styled.View`
  height: 10px;
`;

const Home = ({ navigation: { navigate } }) => {
  const realm = useDB();
  const [feelings, setFeelings] = useState([]);
  useEffect(() => {
    const data = realm.objects("Feeling");
    data.addListener((data, changes) => {
      LayoutAnimation.spring();
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setFeelings(data.sorted("_id", true));
    });
    return () => {
      data.removeAllListeners();
    };
  }, []);
  const onDelete = (id) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey("Feeling", id);
      realm.delete(feeling);
    });
  };
  const onEdit = (id) => {
    navigate("Write", { id: id });
  };
  return (
    <View>
      <Title>My Journal</Title>
      <AdMobBanner
        bannerSize="largeBanner"
        adUnitID="ca-app-pub-3940256099942544/2934735716" // Test ID, Replace with your-admob-unit-id
      />
      <FlatList
        style={{ width: "100%", marginVertical: 100 }}
        data={feelings}
        contentContainerStyle={{ paddingVertical: 10 }}
        keyExtractor={(feeling) => feeling._id + ""}
        ItemSeparatorComponent={Seperator}
        renderItem={({ item }) => (
          <Record>
            <Column>
              <Emotion>{item.emotion}</Emotion>
              <Message>{item.message}</Message>
            </Column>
            <Column>
              <TouchableOpacity
                onPress={() => onEdit(item._id)}
                style={{ marginRight: 5 }}
              >
                <Ionicons name="pencil" size={18} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(item._id)}>
                <Ionicons name="trash" size={18} />
              </TouchableOpacity>
            </Column>
          </Record>
        )}
      />
      <Btn onPress={() => navigate("Write")}>
        <Ionicons name="add" color="white" size={40} />
      </Btn>
    </View>
  );
};

export default Home;
