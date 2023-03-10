import { AdMobInterstitial, AdMobRewarded } from "expo-ads-admob";
import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import styled from "styled-components/native";
import colors from "../colors";
import { useDB } from "../context";

const View = styled.View`
  flex: 1;
  background-color: ${colors.bgColor};
  padding: 0px 30px;
`;
const Title = styled.Text`
  color: ${colors.textColor};
  margin: 50px 0px;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
`;

const TextInput = styled.TextInput`
  background-color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 18px;
`;

const Btn = styled.TouchableOpacity`
  width: 100%;
  margin-top: 15px;
  padding: 10px 20px;
  align-items: center;
  border-radius: 20px;
  background-color: ${colors.btnColor};
`;

const BtnText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 500;
`;

const Emotions = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
  justify-content: space-around;
`;

const Emotion = styled.TouchableOpacity`
  background-color: white;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
  border-width: ${(props) => (props.selected ? "2px" : "0px")};
  border-color: rgba(0, 0, 0, 0.5);
`;

const EmotionText = styled.Text`
  font-size: 24px;
`;

const emtions = ["😄", "🥲", "😡", "🤔", "🥰"];

const Write = ({ navigation: { goBack }, route }) => {
  const realm = useDB();
  const [selectedEmotion, setEmotion] = useState(null);
  const [feelings, setFeelings] = useState("");
  const [edit, setEdit] = useState(false);
  const onChangeText = (text) => setFeelings(text);
  const onEmtionPress = (face) => setEmotion(face);
  const onSubmit = async () => {
    if (feelings === "" || selectedEmotion === null) {
      return Alert.alert("Please complete form");
    }
    realm.write(() => {
      const feeling = realm.create("Feeling", {
        _id: Date.now(),
        emotion: selectedEmotion,
        message: feelings,
      });
      goBack();
    });
  };
  const onEdit = async () => {
    if (feelings === "" || selectedEmotion === null) {
      return Alert.alert("Please complete form");
    }
    await AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/1712485313"); // Test ID, Replace with your-admob-unit-id
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
    AdMobRewarded.removeAllListeners();
    AdMobRewarded.addEventListener("rewardedVideoUserDidEarnReward", () => {
      AdMobRewarded.addEventListener("rewardedVideoDidDismiss", () => {
        realm.write(() => {
          const feeling = realm.objectForPrimaryKey("Feeling", route.params.id);
          feeling.emotion = selectedEmotion;
          feeling.message = feelings;
        });
      });
      goBack();
    });
  };
  useEffect(() => {
    if (route.params) {
      realm.write(() => {
        const feeling = realm.objectForPrimaryKey("Feeling", route.params.id);
        setEmotion(feeling.emotion);
        setFeelings(feeling.message);
      });
      setEdit(true);
    } else return;
  }, []);
  return (
    <View>
      <Title>How do you feel today?</Title>
      <Emotions>
        {emtions.map((emtion, index) => (
          <Emotion
            selected={emtion === selectedEmotion}
            onPress={() => onEmtionPress(emtion)}
            key={index}
          >
            <EmotionText>{emtion}</EmotionText>
          </Emotion>
        ))}
      </Emotions>
      <TextInput
        returnKeyLabel="done"
        onSubmitEditing={edit ? onEdit : onSubmit}
        onChangeText={onChangeText}
        value={feelings}
        placeholder="Write your feelings..."
      />
      <Btn onPress={edit ? onEdit : onSubmit}>
        <BtnText>Save</BtnText>
      </Btn>
    </View>
  );
};

export default Write;
