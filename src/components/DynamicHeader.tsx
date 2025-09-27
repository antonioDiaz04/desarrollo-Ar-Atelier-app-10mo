// src/components/DynamicHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import {  } from "react-native-heroicons/outline";

type DynamicHeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

const DynamicHeader: React.FC<DynamicHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <View
      className="flex-row items-center bg-white shadow-md"
      style={{ paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12,paddingVertical: 30, minHeight: 50 }}
    >
      {showBackButton && (
        <TouchableOpacity
          onPress={onBackPress}
          style={{ marginRight: 16, padding: 8 }}
        >
          <ArrowLeftIcon size={28} color="#333" />
        </TouchableOpacity>
      )}
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "#333" }}>
        {title}
      </Text>
    </View>
  );
};

export default DynamicHeader;
