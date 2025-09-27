// src/components/CollectionsSection.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigate } from 'react-router-native';

const cardShadowStyle = {
  shadowColor: '#888888',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.6,
  shadowRadius: 5,
  elevation: 5,
};

const CollectionsSection: React.FC<{ title: string; data: any[]; navigateTo: string }> = ({ title, data, navigateTo }) => {
  const navigate = useNavigate();
  return (
    <View className="my-4">
      <View className="flex-row items-center justify-between mb-4 px-4">
        <Text className="text-3xl font-bold text-[#222222]">{title}</Text>
        <TouchableOpacity onPress={() => navigate(navigateTo)} className="flex-row items-center">
          <Text className="text-[#333333] font-semibold mr-1">Ver más</Text>
          <Feather name="chevron-right" size={18} color="#333333" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-2">
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[cardShadowStyle, { borderWidth: 0.5, borderColor: '#DDDDDD' }]}
            className="bg-white rounded-lg mr-4 w-44 p-2 items-center"
          >
            <Image source={{ uri: item.image }} className="w-40 h-40 rounded-lg mb-2" />
            <Text className="font-semibold text-[#333333] text-center">{item.name}</Text>
            <Text className="text-[#333333] font-bold mt-1 text-lg">${item.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CollectionsSection;