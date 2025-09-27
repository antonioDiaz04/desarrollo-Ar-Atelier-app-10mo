// App.tsx
import React from "react";
import { NativeRouter, Routes, Route } from "react-router-native";
import { View } from "react-native";
import { SidebarProvider } from "./src/components/SidebarContext";
import AuthOptions from "./src/components/AuthOptions";

// added
import "./global.css"
import Sidebar from "~/components/Sidebar";
import NotFound from "~/components/NotFound";
import SearchScreen from "~/components/SearchScreen";

const App: React.FC = () => {
  return (
    <SidebarProvider>
      <NativeRouter>
        <Sidebar />
        <View style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<AuthOptions />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </View>
      </NativeRouter>
    </SidebarProvider>

  );
};

export default App;