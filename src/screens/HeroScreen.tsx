import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useNavigate } from "react-router-native";

const HeroScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleNext = () => navigate("/auth");

  return (
    <ImageBackground
      source={{ uri: "https://i.pinimg.com/736x/41/32/6c/41326cc40ff460ccf700aab0abbc926e.jpg" }} // imagen de fondo
      className="flex-1"
      resizeMode="cover"
    >
      {/* Overlay sutil para que el texto resalte */}
      <View className="flex-1 bg-[#fbf9dd]">
       

        {/* Contenido principal */}
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-gray-900 text-4xl font-extrabold text-center mb-3">
            Encuentra tu vestido ideal
          </Text>

          <Text className="text-gray-600 text-base text-center leading-6 mb-10">
            Renta o compra vestidos elegantes para cada ocasión especial.
          </Text>

          <TouchableOpacity
            onPress={handleNext}
            className="bg-gray-900 px-8 py-3 rounded-full shadow-lg"
          >
            <Text className="text-white text-lg font-semibold">
              Continuar →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HeroScreen;
