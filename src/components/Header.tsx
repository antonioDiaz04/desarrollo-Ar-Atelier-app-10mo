// Header.tsx
import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { 
  Bars3Icon, 
  HeartIcon,       // Para "Me Gusta"
  BookmarkIcon,    // Para "Guardados"
  // Otras opciones si prefieres:
  // UserIcon,     // Para "Mi Perfil"
  // ShoppingBagIcon, // Para "Mis Compras"
} from "react-native-heroicons/outline";
import { useSidebar } from "./SidebarContext";
import { useNavigate } from "react-router-native";

const HEADER_HEIGHT = 60;

const Header: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        height: HEADER_HEIGHT + 20,
        backgroundColor: '#FFFF',
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 28, paddingBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={toggleSidebar} style={{ padding: 8 }}>
                <Bars3Icon size={28} color="#333" />
              </TouchableOpacity>
              <Text
                style={{
                  marginLeft: 16,
                  color: "#000",
                  fontSize: 24,
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                Atelier
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              
              {/* RUTA A ME GUSTA */}
              <TouchableOpacity onPress={() => navigate("/likes")} style={{ padding: 8 }}>
                <HeartIcon size={26} color="#EC4899" />
              </TouchableOpacity>
              
              {/* RUTA A GUARDADOS */}
              <TouchableOpacity onPress={() => navigate("/saved")} style={{ padding: 8 }}>
                <BookmarkIcon size={26} color="#3B82F6" />
              </TouchableOpacity>
             
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Header;