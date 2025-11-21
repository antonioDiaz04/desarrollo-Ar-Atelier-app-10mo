// App.tsx
import React from "react";
import { NativeRouter, Routes, Route } from "react-router-native";
import { View } from "react-native";
import { SidebarProvider } from "./src/components/SidebarContext";
import AuthOptions from "./src/components/AuthOptions";
import "./global.css"
import Sidebar from "~/components/Sidebar";
import NotFound from "~/components/NotFound";
import SearchScreen from "~/components/SearchScreen";
import LoginScreen from "~/auth/LoginScreen";
import RegisterScreen from "~/auth/RegisterScreen";
import Home from "~/screens/Home";
import ProductDetailScreen from "~/screens/ProductDetailScreen";
import CrearPostScreen from "~/screens/CrearPostScreen";
import { ProfileScreen } from "~/screens/ProfileScreen";
import { LikesScreen } from "~/screens/LikesScreen";       // ← NUEVO
import { SavedScreen } from "~/screens/SavedScreen";       // ← NUEVO

const App: React.FC = () => {
  return (
    <SidebarProvider>
      <NativeRouter>
        <Sidebar />
        <View style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<AuthOptions />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/home" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetailScreen />} />
            <Route path="/create-post" element={<CrearPostScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/likes" element={<LikesScreen />} />      {/* ← NUEVO */}
            <Route path="/saved" element={<SavedScreen />} />      {/* ← NUEVO */}
            <Route path="/search" element={<SearchScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </View>
      </NativeRouter>
    </SidebarProvider>
  );
};

export default App;