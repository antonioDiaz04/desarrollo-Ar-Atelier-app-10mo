import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Bars3Icon, BellIcon, ShoppingCartIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useSidebar } from "./SidebarContext";
import { useNavigate } from "react-router-native";

const HEADER_HEIGHT = 60;

// Ya no se requiere la prop 'scrollY'
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
        backgroundColor: '#FCFBEF', // Color de fondo sólido desde el inicio
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <TouchableOpacity onPress={() => navigate("/search")} style={{ padding: 8 }}>
                <MagnifyingGlassIcon size={26} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate("/Notifications")} style={{ padding: 8, position: "relative" }}>
                <BellIcon size={26} color="#333" />
                <View
                  style={{
                    position: "absolute",
                    top: -2,
                    right: 0,
                    width: 16,
                    height: 16,
                    backgroundColor: "#EC4899",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>3</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity  onPress={() => navigate("/Orders")} style={{ padding: 8, position: "relative" }}>
                <ShoppingCartIcon size={26} color="#333" />
                <View
                  style={{
                    position: "absolute",
                    top: -2,
                    right: 0,
                    width: 16,
                    height: 16,
                    backgroundColor: "#8B5CF6",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>1</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Header;