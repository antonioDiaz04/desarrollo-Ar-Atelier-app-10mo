import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigate } from "react-router-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

const OrdersScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Header con botón de regresar */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => navigate("/perfil")}
          className="p-2 rounded-full bg-gray-100 mr-4"
        >
          <ArrowLeftIcon size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Mis Pedidos</Text>
      </View>

      {/* Pedidos definidos manualmente */}
      <View className="bg-white rounded-lg p-4 mb-4 shadow">
        <Text className="font-semibold text-gray-800">Camiseta Roja</Text>
        <Text className="text-gray-600">Estado: Enviado</Text>
        <Text className="text-gray-500 text-sm">Fecha: 2025-08-10</Text>
      </View>

      <View className="bg-white rounded-lg p-4 mb-4 shadow">
        <Text className="font-semibold text-gray-800">Zapatillas Running</Text>
        <Text className="text-gray-600">Estado: En proceso</Text>
        <Text className="text-gray-500 text-sm">Fecha: 2025-08-20</Text>
      </View>

      <View className="bg-white rounded-lg p-4 mb-4 shadow">
        <Text className="font-semibold text-gray-800">Gorra Azul</Text>
        <Text className="text-gray-600">Estado: Entregado</Text>
        <Text className="text-gray-500 text-sm">Fecha: 2025-07-30</Text>
      </View>
    </ScrollView>
  );
};

export default OrdersScreen;
