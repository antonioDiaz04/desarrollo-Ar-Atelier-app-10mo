import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  SafeAreaView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigate } from "react-router-native";
import {
  AtSymbolIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  QrCodeIcon
} from "react-native-heroicons/outline";
import FadeInView from "~/global/animation/FadeInView";

const patternImage = require("../../assets/images/pattern.png");

const AuthOptions: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <View className="flex-1">
      {/* Imagen de fondo con opacidad */}
      <ImageBackground
        source={patternImage}
        resizeMode="cover"
        className="flex-1"
        imageStyle={{ tintColor: '#333', opacity: 0.8 }}
      />

      {/* Contenido completamente opaco encima */}
      <SafeAreaView className="absolute inset-0 bg-transparent">



        {/* Contenido principal */}
        <View className="flex-1 items-center justify-center p-6">

          <View className="w-full max-w-sm aspect-square mb-2">
            <FadeInView delay={200} className="w-full max-w-sm aspect-square mb-2">

              <Image
                source={{ uri: 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1746397789/shlcavwsffgxemctxdml.png' }}
                className="w-full h-full rounded-2xl"
                resizeMode="contain"
                style={{
                  flex: 1,
                  tintColor: '#444', // 
                  opacity: 0.9,
                  resizeMode: 'contain',
                }}

              />
            </FadeInView>
            X
          </View>


          {/* Sección de texto y botones */}
          <View className="w-full items-center">
            <FadeInView delay={300}>

              <Text className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
                ¡Bienvenido!
              </Text>
            </FadeInView>
            <FadeInView delay={400}>
              <Text className="text-base text-gray-700 mb-8 text-center max-w-xs">
                Elige una opción para continuar.
              </Text>
            </FadeInView>


            <View className="w-full space-y-4">

              <FadeInView delay={500} className="w-full space-y-4 mb-4">

                {/* Botón con degradado de negros */}
                <TouchableOpacity
                  className="w-full h-14 rounded-lg shadow-lg overflow-hidden"
                  onPress={() => navigate("/login")}
                >
                  <LinearGradient
                    colors={['#2D3748', '#1A202C', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="flex-1 flex-row items-center justify-center px-5"
                  >
                    <AtSymbolIcon color="white" size={20} />
                    <Text className="ml-3 text-base font-semibold text-white">
                      Continuar con correo
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </FadeInView>



              {/* Separador */}
              <View className="flex-row items-center my-2">
                <View className="flex-1 h-px bg-gray-400" />
                <Text className="mx-4 text-sm text-gray-700 font-medium">o</Text>
                <View className="flex-1 h-px bg-gray-400" />
              </View>
              <FadeInView delay={200} className="w-full space-y-4 mb-4">

                <TouchableOpacity
                  className="w-full h-14 flex-row items-center justify-center px-5 bg-white rounded-lg border border-gray-400 shadow-sm"
                  onPress={() => navigate("/scan-qr")}
                >
                  <QrCodeIcon color="black" size={20} />
                  <Text className="ml-3 text-base font-medium text-gray-800">
                    Continuar con QR
                  </Text>
                </TouchableOpacity>
              </FadeInView>

              <FadeInView delay={200} className="w-full space-y-4 mb-4">

                <TouchableOpacity
                  className="w-full h-14 mt-2 flex-row items-center justify-center px-5 bg-white rounded-lg border border-gray-400 shadow-sm"
                  onPress={() => navigate("/register")}
                >
                  <UserCircleIcon color="black" size={20} />
                  <Text className="ml-3 text-base font-medium text-gray-800">
                    Crear una nueva cuenta
                  </Text>
                </TouchableOpacity>
              </FadeInView>

            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AuthOptions;