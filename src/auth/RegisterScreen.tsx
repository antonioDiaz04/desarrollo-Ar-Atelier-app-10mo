import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigate } from "react-router-native";

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert("Por favor, llena todos los campos.");
      return;
    }
    console.log("Registrando usuario:", { name, email, password });
    alert("¡Registro exitoso!");
    navigate("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 48 }}>
        <TouchableOpacity 
          onPress={() => navigate(-1)} 
          className="absolute top-12 left-6 z-10 p-2"
        >
          <Feather name="chevron-left" size={28} color="#000" />
        </TouchableOpacity>

        <View className="items-center mb-8">
          <Text className="text-4xl font-extrabold text-black mb-2">Crea tu cuenta</Text>
          <Text className="text-base text-stone-600">Únete a nuestra comunidad hoy mismo.</Text>
        </View>

        <View className="mb-4">
          <View className="flex-row items-center bg-white rounded-lg border border-stone-300 px-4 mb-4">
            <Feather name="user" size={20} color="#a1a1aa" />
            <TextInput
              className="ml-3 flex-1 h-14 text-stone-900"
              placeholder="Nombre completo"
              placeholderTextColor="#a1a1aa"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="flex-row items-center bg-white rounded-lg border border-stone-300 px-4 mb-4">
            <Feather name="mail" size={20} color="#a1a1aa" />
            <TextInput
              className="ml-3 flex-1 h-14 text-stone-900"
              placeholder="Correo electrónico"
              placeholderTextColor="#a1a1aa"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="flex-row items-center bg-white rounded-lg border border-stone-300 px-4 mb-6">
            <Feather name="lock" size={20} color="#a1a1aa" />
            <TextInput
              className="ml-3 flex-1 h-14 text-stone-900"
              placeholder="Contraseña"
              placeholderTextColor="#a1a1aa"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          className="bg-black rounded-lg py-4 mb-4"
          onPress={handleRegister}
        >
          <Text className="text-white text-center font-bold text-lg">Registrarme</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-2" onPress={() => navigate("/login")}>
          <Text className="text-center text-stone-600">
            ¿Ya tienes una cuenta? <Text className="font-semibold text-black">Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
        
        {/* Aquí se agrega el enlace de "Olvidaste la contraseña" */}
        <TouchableOpacity className="self-center mt-4" onPress={() => navigate("/forgot-password")}>
          <Text className="text-center text-stone-600">
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;