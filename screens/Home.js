import React from "react";
import styled from "styled-components/native";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Text = styled.Text``;
const Btn = styled.TouchableOpacity``;
const BtnText = styled.Text``;

const Home = ({ navigation: { navigate } }) => {
  return (
    <View>
      <Btn onPress={() => navigate("Write")}>
        <BtnText>Write</BtnText>
      </Btn>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
