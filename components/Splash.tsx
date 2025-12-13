import React, { useEffect } from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

type Props = {
  onFinish: () => void;
};

export function Splash({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // avisa que a splash acabou
    }, 4000); // tempo da animação

    return () => clearTimeout(timer);
  }, []);

  return (
    
    <View style={styles.container}>
      <LottieView
        source={require("../assets/images/splash.json")}
        autoPlay
        loop={false} 
        style={{ width: 250, height: 250 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EA1D2C", 
    justifyContent: "center",
    alignItems: "center",
  },
});
