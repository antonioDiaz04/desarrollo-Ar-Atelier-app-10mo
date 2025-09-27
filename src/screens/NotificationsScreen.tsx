import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigate } from "react-router-native";
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  ClockIcon,
  TagIcon,
} from "react-native-heroicons/outline";

const notifications = [
  {
    id: "1",
    type: "compra",
    title: "Compra Exitosa",
    description: "¡Has comprado el Vestido de Noche Meirius!",
    time: "Hace 2 horas",
    icon: <ShoppingCartIcon size={24} color="#3B82F6" />,
    detailRoute: "/product/67e05c9a8bbb15e17ae334ca", // id del producto
  },
  {
    id: "2",
    type: "renta",
    title: "Renta Activa",
    description: "Tu renta del vestido Fucsia Chic está activa hasta 30/08/2025.",
    time: "Hace 1 día",
    icon: <ClockIcon size={24} color="#F59E0B" />,
    detailRoute: "rentaDetalle/687c14af555de7433ad30a85",
  },
  {
    id: "3",
    type: "recordatorio",
    title: "Recordatorio de Evento",
    description: "No olvides devolver el vestido Sueño Violeta antes del 28/08/2025.",
    time: "Hace 3 días",
    icon: <ClockIcon size={24} color="#EF4444" />,
    detailRoute: "/product/687c0c74555de7433ad30a52",
  },
  {
    id: "4",
    type: "promocion",
    title: "Liquidación Especial",
    description: "Algunos vestidos están en promoción por tiempo limitado.",
    time: "Hace 1 semana",
    icon: <TagIcon size={24} color="#10B981" />,
    detailRoute: "/promotions", // podría ser una pantalla general de promociones
  },
];

const NotificationsScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => navigate("/home")}
          className="p-2 rounded-full bg-gray-100 mr-4"
        >
          <ArrowLeftIcon size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Notificaciones</Text>
      </View>

      {/* Notificaciones */}
      {notifications.map((notif) => (
        <TouchableOpacity
          key={notif.id}
          onPress={() => navigate(notif.detailRoute)}
          className="flex-row items-center bg-white rounded-lg p-4 mb-4 shadow"
        >
          <View className="mr-4">{notif.icon}</View>
          <View className="flex-1">
            <Text className="font-semibold text-gray-800">{notif.title}</Text>
            <Text className="text-gray-600">{notif.description}</Text>
            <Text className="text-gray-400 text-sm mt-1">{notif.time}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default NotificationsScreen;
