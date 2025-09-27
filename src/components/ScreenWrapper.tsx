import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type ScreenWrapperProps = {
  showHeader?: boolean;
  title?: string;
  onBack?: () => void;
  children: React.ReactNode;
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  showHeader = true,
  title,
  onBack,
  children,
}) => {
  return (
    <View style={{ flex: 1 }}>
      {showHeader && (
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backText}>Atrás</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ScreenWrapper;
