import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useNavigate } from "react-router-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";

const rentalProduct = {
  id: "687c14af555de7433ad30a85",
  nombre: "Fucsia Chic",
  descripcion:
    "Vestido corto elegante, perfecto para eventos de noche. Color fucsia con detalles delicados.",
  color: "fucsia",
  talla: "M",
  material: "seda",
  precio_renta: 350,
  disponible_renta: true,
  imagenes: [
    "https://res.cloudinary.com/dynqgfhxr/image/upload/v1742928530/ProductosAtelier/tzvcdlw0qaqhexjpr1x9.avif",
    "https://res.cloudinary.com/dynqgfhxr/image/upload/v1742928532/ProductosAtelier/g1rys87q22uavl4hdwoi.webp",
  ],
};

const rentalInfo = {
  fecha_inicio: "2025-08-20",
  fecha_fin: "2025-08-27",
  fecha_actual: "2025-08-24",
  dias_restantes: 3,
  liquidacion: false,
  multa: false,
  notas: "Recuerda limpiar el vestido antes de la devolución",
};

const RentalDetailScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 mr-4"
        >
          <ArrowLeftIcon size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Detalle de Renta</Text>
      </View>

      {/* Producto */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {rentalProduct.imagenes.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            className="w-72 h-96 rounded-lg mr-4"
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View className="bg-white rounded-lg p-4 shadow mb-4">
        <Text className="text-2xl font-bold text-gray-800 mb-2">{rentalProduct.nombre}</Text>
        <Text className="text-gray-600 mb-2">{rentalProduct.descripcion}</Text>
        <Text className="text-gray-700 font-semibold">Color: {rentalProduct.color}</Text>
        <Text className="text-gray-700 font-semibold">Talla: {rentalProduct.talla}</Text>
        <Text className="text-gray-700 font-semibold">Material: {rentalProduct.material}</Text>
        <Text className="text-blue-600 font-bold mt-2">Precio de Renta: ${rentalProduct.precio_renta}</Text>
      </View>

      {/* Información de Renta */}
      <View className="bg-white rounded-lg p-4 shadow mb-4">
        <Text className="text-lg font-bold text-gray-800 mb-2">Información de Renta</Text>
        <Text className="text-gray-700">Fecha Inicio: {rentalInfo.fecha_inicio}</Text>
        <Text className="text-gray-700">Fecha Fin: {rentalInfo.fecha_fin}</Text>
        <Text className="text-gray-700">Hoy: {rentalInfo.fecha_actual}</Text>
        <Text className="text-red-600 font-semibold">
          Te faltan {rentalInfo.dias_restantes} días para entregar el vestido
        </Text>

        {rentalInfo.liquidacion && (
          <Text className="text-green-600 mt-2 font-semibold">Liquidación disponible</Text>
        )}
        {rentalInfo.multa && (
          <Text className="text-red-600 mt-2 font-semibold">¡Tienes multa pendiente!</Text>
        )}
        {rentalInfo.notas && (
          <Text className="text-gray-500 mt-2 italic">Notas: {rentalInfo.notas}</Text>
        )}

        {/* Mini Calendario */}
        <Calendar
          markingType={"period"}
          markedDates={{
            [rentalInfo.fecha_inicio]: { startingDay: true, color: "#3B82F6", textColor: "white" },
            [rentalInfo.fecha_fin]: { endingDay: true, color: "#3B82F6", textColor: "white" },
            [rentalInfo.fecha_actual]: { color: "#FBBF24", textColor: "white" },
          }}
        />
      </View>
    </ScrollView>
  );
};

export default RentalDetailScreen;
