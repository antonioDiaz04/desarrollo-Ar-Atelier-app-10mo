import React from "react";
import { View, Text,Image, TouchableOpacity, ScrollView } from "react-native";
import DynamicHeader from "~/components/DynamicHeader";
import { useNavigate } from "react-router-native";

// 2. Importaciones de íconos (ejemplo con 'react-native-heroicons')
import { EnvelopeIcon, PhoneIcon, UserIcon } from 'react-native-heroicons/outline'; 

import {
  Bars3Icon,
  BellIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import BottomNavBar from "~/components/BottomNavBar";

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <View className="flex-1 bg-gray-100">
      <DynamicHeader
        title="Mi Perfil"
        showBackButton={true}
        onBackPress={() => navigate("/home")}
      />
      <ScrollView className="p-4">

        <View className="bg-white rounded-lg p-6 mb-4 shadow-md">
          {/* Sección de la foto de perfil y el nombre */}
          <View className="flex-row items-center mb-6">
            <Image
              source={{ uri: 'https://ejemplo.com/foto-de-perfil.jpg' }} // Reemplaza con la URL real de la foto
              className="w-20 h-20 rounded-full mr-4 border-2 border-gray-300"
            />
            <View>
              <Text className="text-2xl font-bold text-gray-900">Ana García</Text>
              <Text className="text-sm text-gray-500">Desarrolladora de software</Text>
            </View>
          </View>

          {/* Información de contacto */}
          <View className="space-y-3 border-t pt-4 border-gray-200">
            <View className="flex-row items-center">
              <EnvelopeIcon size={20} color="#4B5563" className="mr-3" />
              <Text className="text-base text-gray-700">ana.garcia@ejemplo.com</Text>
            </View>

            <View className="flex-row items-center">
              <PhoneIcon size={20} color="#4B5563" className="mr-3" />
              <Text className="text-base text-gray-700">+34 123 456 789</Text>
            </View>

            <View className="flex-row items-center">
              <UserIcon size={20} color="#4B5563" className="mr-3" />
              <Text className="text-base text-gray-700">Mujer</Text>
            </View>
          </View>

          {/* Botón de editar perfil (opcional) */}
          <TouchableOpacity
            onPress={() => navigate("/EditProfile")}
            className="mt-6 border border-gray-300 rounded-full py-2 px-4 self-start"
          >
            <Text className="text-sm font-semibold text-gray-700">Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Notificaciones */}
        <TouchableOpacity
          onPress={() => navigate("/Notifications")}
          className="flex-row items-center bg-white rounded-lg p-4 mb-4 shadow-md"
        >
          <View className="mr-4">
            <BellIcon size={24} color="#4B5563" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">Notificaciones</Text>
            <Text className="text-sm text-gray-500">Configurar alertas y sonidos</Text>
          </View>
        </TouchableOpacity>

        {/* Mis Pedidos */}
        <TouchableOpacity
          onPress={() => navigate("/Orders")}
          className="flex-row items-center bg-white rounded-lg p-4 mb-4 shadow-md"
        >
          <View className="mr-4">
            <ShoppingCartIcon size={24} color="#4B5563" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">Mis Pedidos</Text>
            <Text className="text-sm text-gray-500">Ver historial y seguimiento</Text>
          </View>
        </TouchableOpacity>

        

        {/* Información adicional */}
        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-lg font-semibold mb-2 text-gray-800">
            Actualizar Datos
          </Text>
          <Text className="text-gray-600 mb-4">
            Puedes actualizar tus datos de contacto y preferencias desde aquí.
          </Text>
          <TouchableOpacity
            onPress={() => navigate("/EditProfile")}
            className="bg-blue-600 rounded-md py-2"
          >
            <Text className="text-white text-center font-semibold">Ir a Actualizar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      <BottomNavBar />

    </View>
  );
};

export default ProfileScreen;
