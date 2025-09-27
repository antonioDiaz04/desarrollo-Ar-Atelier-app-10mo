import React from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useNavigate } from "react-router-native";
import { AtSymbolIcon, UserCircleIcon, AcademicCapIcon, ArrowLeftIcon, QrCodeIcon } from "react-native-heroicons/outline";

const AuthOptions: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Botón de retroceso en la parte superior */}
      <View className="p-4">
        <TouchableOpacity onPress={handleBack} className="p-2">
          <ArrowLeftIcon size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Contenido principal centrado */}
      <View className="flex-1 items-center justify-center p-6">
        
        {/* Sección de imagen */}
        <View className="w-full max-w-sm aspect-square mb-2">
          <Image
            source={{ uri: 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1746397789/shlcavwsffgxemctxdml.png' }}
            className="w-full h-full rounded-3xl"
            resizeMode="cover"
          />
        </View>

        {/* Sección de texto y botones */}
        <View className="w-full items-center">
          <Text className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
            ¡Bienvenido!
          </Text>
          <Text className="text-base text-gray-500 mb-8 text-center max-w-xs">
            Elige una opción para continuar.
          </Text>

          {/* Botones de autenticación con mejor jerarquía */}
          <View className="w-full space-y-4">
            {/* Botón principal: Continuar con correo */}
            <TouchableOpacity
              className="w-full h-14 flex-row items-center justify-center px-5 bg-black rounded-lg"
              onPress={() => navigate("/login")}
            >
              <AtSymbolIcon color="white" size={20} />
              <Text className="ml-3 text-base font-semibold text-white">
                Continuar con correo
              </Text>
            </TouchableOpacity>
            
            {/* Separador */}
            <View className="flex-row items-center my-2">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-sm text-gray-500">o</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Botones secundarios */}
            <TouchableOpacity
              className="w-full h-14 flex-row items-center justify-center px-5 mb-4 bg-white rounded-lg border border-gray-300"
              onPress={() => navigate("/google-login")}
            >
              <AcademicCapIcon color="black" size={20} />
              <Text className="ml-3 text-base font-medium text-gray-800">
                Continuar con Google
              </Text>
            </TouchableOpacity>

            {/* Botón para escanear QR */}
            <TouchableOpacity
              className="w-full h-14 flex-row items-center justify-center px-5 mb-4 bg-white rounded-lg border border-gray-300"
              onPress={() => navigate("/scan-qr")}
            >
              <QrCodeIcon color="black" size={20} />
              <Text className="ml-3 text-base font-medium text-gray-800">
                Continuar con QR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full h-14 flex-row items-center justify-center px-5 mb-4 bg-white rounded-lg border border-gray-300"
              onPress={() => navigate("/register")}
            >
              <UserCircleIcon color="black" size={20} />
              <Text className="ml-3 text-base font-medium text-gray-800">
                Crear una nueva cuenta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthOptions;