// src/components/TestimonialsSection.tsx

import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const TestimonialsSection: React.FC<{ reviews: any[] }> = ({ reviews }) => {
  return (
    <View className="mb-28">
      <Text className="text-3xl font-bold text-[#222222] mb-4 px-4">Lo que dicen de nosotros</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 pb-10">
        {reviews.map((review) => (
          <View key={review.id} className="bg-white rounded-lg shadow-md mr-4 p-4 w-72">
            <Text className="text-[#333333] italic mb-2">"{review.text}"</Text>
            <Text className="font-bold text-[#333333] text-right">- {review.author}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TestimonialsSection;