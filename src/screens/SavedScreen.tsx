import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PostCard } from '~/components/PostCard';
import { Guardado } from '~/types/types';
import axios from 'axios';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

const API_URL = 'http://192.168.1.2:4000/api/v1/posts';

export const SavedScreen: React.FC = () => {
  const navigation = useNavigation();
  const usuariaId = '67daf8baf4ed8050c7b7269a';
  
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarGuardados = async () => {
    try {
      const response = await axios.get<Guardado[]>(`${API_URL}/guardados/${usuariaId}`);
      const posts = response.data.map(g => g.postId).filter(Boolean); // ← ya viene populate
      setSavedPosts(posts);
    } catch (error) {
      console.error('Error cargando guardados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarGuardados();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarGuardados();
  };

  const handleUnsave = async (postId: string) => {
    try {
      await axios.delete(`${API_URL}/guardados`, { data: { postId, usuariaId } });
      setSavedPosts(prev => prev.filter(p => p._id !== postId));
    } catch (error) {
      console.error('Error quitando guardado:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2196f3" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">

      {/* 🔵 HEADER CON ALTURA 28 + BOTÓN ATRÁS */}
      <View className="bg-white h-28 px-4 pt-12 flex-row items-center shadow-sm">

        {/* Botón atrás */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full mr-2"
        >
          <ArrowLeftIcon size={26} color="#000" />
        </TouchableOpacity>

        <View>
          <Text className="text-2xl font-bold text-gray-900">Guardados</Text>
          <Text className="text-sm text-gray-600">{savedPosts.length} publicaciones</Text>
        </View>
      </View>

      {/* LISTA */}
      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="px-4">
            <PostCard 
              post={item}
              isSaved={true}
              onLike={() => {}} 
              onSave={() => handleUnsave(item._id)}
              onComment={() => {}}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-lg">No tienes publicaciones guardadas</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
};
