import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { HeartIcon, ChatBubbleOvalLeftIcon, BookmarkIcon } from "react-native-heroicons/outline";
import { Post } from '../types/types';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string) => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onSave, 
  onComment, 
  isLiked = false, 
  isSaved = false 
}) => {
  return (
    <View className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
      {/* Header de usuario */}
      <View className="flex-row items-center p-3">
        <Image 
          source={{ uri: post.usuariaId?.fotoDePerfil || 'https://via.placeholder.com/40' }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-semibold text-gray-900">
            {post.usuariaId?.nombre || 'Usuario'}
          </Text>
          <Text className="text-xs text-gray-500">
            {new Date(post.fecha).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>

      {/* Imagen del post */}
      <Image 
        source={{ uri: post.imagenUrl }}
        className="w-full h-96"
        resizeMode="cover"
      />

      {/* Contenido */}
      <View className="p-4">
        <Text className="text-base text-gray-800 mb-2">{post.descripcion}</Text>
        {post.etiqueta && (
          <Text className="text-sm text-pink-600 font-medium">#{post.etiqueta}</Text>
        )}
      </View>

      {/* Acciones */}
      <View className="flex-row items-center justify-around py-2 border-t border-gray-100">
        <TouchableOpacity 
          onPress={() => onLike(post._id)}
          className="flex-row items-center space-x-2 px-4 py-2"
        >
          <HeartIcon 
            size={24} 
            color={isLiked ? '#e91e63' : '#666'} 
            fill={isLiked ? '#e91e63' : 'none'} 
          />
          <Text className="text-gray-600">Me gusta</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onComment(post._id)}
          className="flex-row items-center space-x-2 px-4 py-2"
        >
          <ChatBubbleOvalLeftIcon size={24} color="#666" />
          <Text className="text-gray-600">Comentar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onSave(post._id)}
          className="flex-row items-center space-x-2 px-4 py-2"
        >
          <BookmarkIcon 
            size={24} 
            color={isSaved ? '#2196f3' : '#666'} 
            fill={isSaved ? '#2196f3' : 'none'} 
          />
          <Text className="text-gray-600">Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};