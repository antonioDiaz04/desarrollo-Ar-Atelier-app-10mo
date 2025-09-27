import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigate } from "react-router-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

const EditProfileScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Header con botón de regresar */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => navigate("/perfil")}
          className="p-2 rounded-full bg-gray-100 mr-4"
        >
          <ArrowLeftIcon size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Editar Perfil</Text>
      </View>

      {/* Formulario */}
      <View className="mb-4">
        <Text className="mb-1 text-gray-700 font-semibold">Nombre Completo</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Juan Pérez"
        />
      </View>

      <View className="mb-4">
        <Text className="mb-1 text-gray-700 font-semibold">Correo Electrónico</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="ejemplo@email.com"
          keyboardType="email-address"
        />
      </View>

      <View className="mb-4">
        <Text className="mb-1 text-gray-700 font-semibold">Teléfono</Text>
        <TextInput
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="+52 123 456 7890"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity className="bg-blue-600 rounded p-3 mt-6">
        <Text className="text-white text-center font-bold">Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;
