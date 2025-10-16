import React from "react";
import { useNavigate, useLocation } from "react-router-native";
import { View, Text, TouchableOpacity } from "react-native";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  ClockIcon, // Se agregó el ícono de reloj
} from "react-native-heroicons/outline";

// Navegación Nav-Bar
const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar tab activo según la ruta
  const getActiveTabFromPath = () => {
    if (location.pathname.includes("/Historial")) return "historial";
    if (location.pathname.includes("/search")) return "search";
    if (location.pathname.includes("/perfil")) return "perfil";
    if (location.pathname.includes("/cart")) return "cart";
    return "home";
  };

  const activeTab = getActiveTabFromPath();

  const getIconColor = (tabName: string) =>
    activeTab === tabName ? "#44443c" : "#6B7280";

  const getBackgroundColor = (tabName: string) =>
    activeTab === tabName ? "#fbf9dd" : "transparent";

  return (
    <View style={{ position: "absolute", bottom: 50, left: 10, right: 10, zIndex: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "white",
          paddingVertical: 10,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => navigate("/Historial")}
          style={{
            alignItems: "center",
            padding: 8,
            borderRadius: 12,
            backgroundColor: getBackgroundColor("historial"),
          }}
        >
          <ClockIcon size={24} color={getIconColor("historial")} />
          <Text style={{ color: getIconColor("historial"), fontSize: 12, marginTop: 2 }}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate("/search")}
          style={{
            alignItems: "center",
            padding: 8,
            borderRadius: 12,
            backgroundColor: getBackgroundColor("search"),
          }}
        >
          <MagnifyingGlassIcon size={24} color={getIconColor("search")} />
          <Text style={{ color: getIconColor("search"), fontSize: 12, marginTop: 2 }}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate("/home")}
          style={{
            alignItems: "center",
            padding: 8,
            borderRadius: 12,
            backgroundColor: getBackgroundColor("home"),
          }}
        >
          <HomeIcon size={24} color={getIconColor("home")} />
          <Text style={{ color: getIconColor("home"), fontSize: 12, marginTop: 2 }}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate("/ar-viewer")}
          style={{
            alignItems: "center",
            padding: 8,
            borderRadius: 12,
            backgroundColor: getBackgroundColor("cart"),
          }}
        >
          <ShoppingCartIcon size={24} color={getIconColor("cart")} />
          <Text style={{ color: getIconColor("cart"), fontSize: 12, marginTop: 2 }}>probar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate("/perfil")}
          style={{
            alignItems: "center",
            padding: 8,
            borderRadius: 12,
            backgroundColor: getBackgroundColor("perfil"),
          }}
        >
          <UserIcon size={24} color={getIconColor("perfil")} />
          <Text style={{ color: getIconColor("perfil"), fontSize: 12, marginTop: 2 }}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNavBar;