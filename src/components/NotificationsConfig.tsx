import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { useNavigate } from "react-router-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

const NotificationsConfig: React.FC = () => {
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [emailEnabled, setEmailEnabled] = React.useState(false);

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Header con botón de regresar */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => navigate("/perfil")}
          className="p-2 rounded-full bg-gray-100 mr-4"
        >
          <ArrowLeftIcon size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Notificaciones</Text>
      </View>

      {/* Configuración de notificaciones */}
      <View className="flex-row justify-between items-center mb-4 px-4 py-3 bg-white rounded shadow">
        <Text className="text-gray-800 font-semibold">Notificaciones Push</Text>
        <Switch value={pushEnabled} onValueChange={setPushEnabled} />
      </View>

      <View className="flex-row justify-between items-center px-4 py-3 bg-white rounded shadow">
        <Text className="text-gray-800 font-semibold">Notificaciones por Email</Text>
        <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
      </View>
    </View>
  );
};

export default NotificationsConfig;
