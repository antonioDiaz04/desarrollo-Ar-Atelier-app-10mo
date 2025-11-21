import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { PostCard } from '~/components/PostCard';
import axios from 'axios';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useNavigate } from "react-router-native";

const API_URL = 'http://192.168.1.2:4000/api/v1/posts';

export const LikesScreen: React.FC = () => {
  const navigate = useNavigate();
  const usuariaId = '67daf8baf4ed8050c7b7269a';

  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarLikes = async () => {
    try {
      const response = await axios.get(`${API_URL}/likes/${usuariaId}`);
      const posts = response.data.map((like: any) => like.postId);
      setLikedPosts(posts);
    } catch (error) {
      console.error('Error cargando likes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarLikes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    cargarLikes();
  };

  const handleUnlike = async (postId: string) => {
    try {
      await axios.delete(`${API_URL}/likes`, { data: { postId, usuariaId } });
      setLikedPosts(prev => prev.filter(p => p._id !== postId));
    } catch (error) {
      console.error('Error quitando like:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      
      {/* HEADER CON BOTÓN REGRESAR */}
      <View className="bg-white p-4 shadow-sm flex-row items-center">
        <TouchableOpacity onPress={() => navigate(-1)} className="mr-3">
          <ArrowLeftIcon size={24} color="#000" />
        </TouchableOpacity>

        <View>
          <Text className="text-xl font-bold text-gray-900">Me gusta</Text>
          <Text className="text-sm text-gray-600">{likedPosts.length} publicaciones</Text>
        </View>
      </View>

      {/* LISTA DE POSTS */}
      <FlatList
        data={likedPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="px-4">
            <PostCard 
              post={item}
              isLiked={true}
              onLike={() => handleUnlike(item._id)}
              onSave={() => {}}
              onComment={() => {}}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-lg">Aún no has dado me gusta a nada</Text>
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
