// src/components/ServicesSection.tsx

import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

const ServicesSection: React.FC<{ services: any[] }> = ({ services }) => {
  return (
    <View className="mb-8">
      <Text className="text-3xl font-bold text-[#222222] mb-4 px-4">Nuestros Servicios</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-2">
        {services.map((service) => (
          <View key={service.id} className="bg-gray-200 rounded-lg mr-4 p-4 w-40 items-center justify-center">
            <Image source={{ uri: service.icon }} className="w-16 h-16 rounded-full mb-2" />
            <Text className="font-semibold text-center text-[#333333]">{service.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ServicesSection;