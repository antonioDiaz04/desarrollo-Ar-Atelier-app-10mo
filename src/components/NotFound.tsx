import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigate } from 'react-router-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <TouchableOpacity
        onPress={() => navigate(-1)}
        className="absolute top-12 left-4 p-2 bg-gray-200 rounded-full"
      >
        <ArrowLeftIcon size={24} color="#4B5563" />
      </TouchableOpacity>

      <View className="items-center">
        <Text className="text-4xl font-bold text-red-500 mb-2">
          404
        </Text>
        <Text className="text-xl text-gray-700 text-center">
          Página no encontrada
        </Text>
        <Text className="text-sm text-gray-500 mt-2 text-center">
          La ruta a la que intentas acceder no existe.
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigate('/home')}
        className="mt-8 px-6 py-3 bg-indigo-600 rounded-lg shadow-md"
      >
        <Text className="text-lg font-semibold text-white">
          Ir a la página de inicio
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotFound;