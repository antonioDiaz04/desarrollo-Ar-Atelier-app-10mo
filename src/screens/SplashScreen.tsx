import React, { useEffect, useState } from "react";
import { View, Text, Image, Animated } from "react-native";
import { useNavigate } from "react-router-native";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Inicia la animación de fundido
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Navega a la pantalla de "hero" después de 3 segundos
    const timer = setTimeout(() => {
      navigate("/hero");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, fadeAnim]);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Animated.View style={{ opacity: fadeAnim }} className="items-center">
        {/* Aquí puedes usar tu logo local */}
        <Image
          source={require("assets/logo-redondo-confondo.png")} // Asegúrate de que esta ruta sea correcta
          className="w-32 h-32 mb-4"
          resizeMode="contain"
        />
        <Text className="text-4xl font-extrabold text-black">
          rentaDetalle
        </Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;