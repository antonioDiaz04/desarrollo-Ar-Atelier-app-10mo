import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { useNavigate } from 'react-router-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '~/components/Header';
import BottomNavBar from '~/components/BottomNavBar';
import { BlurView } from "expo-blur";

// --- DIMENSIONES Y CONSTANTES ---
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLUMN_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - 48 - COLUMN_GAP) / 2;
const CARD_MARGIN = 8;

// --- INTERFACES Y DATOS DINÁMICOS ---
interface ApiPost {
    _id: string;
    usuariaId: {
        _id: string;
        nombre: string;
        fotoDePerfil: string;
    };
    imagenUrl: string;
    descripcion: string;
    etiqueta: string;
    aprobado: boolean;
    fecha: string;
    __v?: number;
}

interface Post {
    _id: string;
    user_id: string;
    user_name: string;
    user_avatar: string;
    image_url: string;
    description: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    user_has_liked: boolean;
    user_has_saved: boolean;
    category?: string;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    aspectRatio?: number;
    etiqueta?: string;
}

interface Clip {
    id: string;
    title: string;
    user_name: string;
    user_avatar: string;
    thumbnail: string;
    duration: string;
    views: number;
    likes: number;
    is_live?: boolean;
}

// --- SERVICIO API ---
const API_BASE_URL = 'http://192.168.1.2:4000/api/v1';
const apiService = {
    getApprovedPosts: async (): Promise<ApiPost[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/aprobados`, {
                cache: "no-store"
            });
            if (!response.ok) throw new Error(`Error fetching posts: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    },

    getUnapprovedPosts: async (): Promise<ApiPost[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/no-aprobados`);
            if (!response.ok) throw new Error('Error fetching unapproved posts');
            return await response.json();
        } catch (error) {
            console.error('Error fetching unapproved posts:', error);
            return [];
        }
    },

    likePost: async (postId: string, usuariaId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, usuariaId }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error liking post:', error);
            return false;
        }
    },

    unlikePost: async (postId: string, usuariaId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/unlike`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, usuariaId }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error unliking post:', error);
            return false;
        }
    },

    savePost: async (postId: string, usuariaId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/guardar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, usuariaId }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error saving post:', error);
            return false;
        }
    },

    unsavePost: async (postId: string, usuariaId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/quitar-guardado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, usuariaId }),
            });
            return response.ok;
        } catch (error) {
            console.error('Error unsaving post:', error);
            return false;
        }
    }
};

// --- FUNCIÓN PARA TRANSFORMAR DATOS DE API ---
const transformApiPostToAppPost = (apiPost: ApiPost): Post => {
    const sizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    
    const categoryMap: { [key: string]: string } = {
        'comprado': 'Purchased',
        'rentado': 'Rented',
        'propio': 'Own Style'
    };

    return {
        _id: apiPost._id,
        user_id: apiPost.usuariaId._id,
        user_name: apiPost.usuariaId.nombre,
        user_avatar: apiPost.usuariaId.fotoDePerfil,
        image_url: apiPost.imagenUrl,
        description: apiPost.descripcion,
        likes_count: Math.floor(Math.random() * 500) + 50,
        comments_count: Math.floor(Math.random() * 50) + 5,
        created_at: apiPost.fecha,
        user_has_liked: false,
        user_has_saved: false,
        category: categoryMap[apiPost.etiqueta] || 'Style',
        size: randomSize,
        aspectRatio: 0.75 + Math.random() * 0.5,
        etiqueta: apiPost.etiqueta
    };
};

// Datos estáticos para clips
const staticClips: Clip[] = [
    {
        id: 'clip1',
        title: 'Behind The Scenes SS24',
        user_name: 'ATELIER Official',
        user_avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&h=150&fit=crop&crop=face',
        thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop',
        duration: '2:45',
        views: 15234,
        likes: 2341,
        is_live: false
    },
    {
        id: 'clip2',
        title: 'Model Diaries: Backstage',
        user_name: 'Fashion Week',
        user_avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
        thumbnail: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=600&fit=crop',
        duration: '1:23',
        views: 8921,
        likes: 1567,
        is_live: true
    }
];

// --- COMPONENTE HERO SECTION ---
const HeroSection = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1.1)).current;
    const textSlideAnim = useRef(new Animated.Value(80)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true
            }),
            Animated.timing(textSlideAnim, {
                toValue: 0,
                duration: 1200,
                delay: 600,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    return (
        // CAMBIOS CLAVE: Reduje de h-screen a h-[70vh] y añadí my-12 para margen vertical
        <View className="h-[50vh] flex-row bg-white mt-12 mx-0 rounded-2xl overflow-hidden">
            {/* Contenedor del texto a la izquierda */}
            <Animated.View 
                style={[
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: textSlideAnim }]
                    }
                ]} 
                className="flex-1 justify-center px-8" // Reduje el padding horizontal de px-10 a px-8
            >
                <Text className="text-black text-5xl font-light tracking-widest mb-5">
                    ATELIER
                </Text>
                
                <Text className="text-gray-800 text-2xl font-light tracking-widest mb-3">
                    venta y renta de vestidos
                </Text>
                
                <Text className="text-gray-600 text-sm font-light tracking-wider">
                    La esencia de la elegancia moderna
                </Text>
            </Animated.View>

            {/* Contenedor de la imagen a la derecha */}
            <View className="flex-1 relative">
                {/* CAMBIO CLAVE: La imagen ahora tiene h-[90%] y rounded-lg para no ocupar todo */}
                <Animated.Image
                    source={{ uri: 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1746397789/shlcavwsffgxemctxdml.png' }}
                    style={[
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                    className="w-full h-[90%] rounded-lg self-center" // Añadí self-center y h-[90%]
                    resizeMode="cover"
                />
            </View>
        </View>
    );
};

// --- COMPONENTE POST CARD - 2 COLUMNAS, IMÁGENES COMPLETAS ---
const PostCard: React.FC<{
    post: Post;
    onLike: (id: string) => void;
    onSave: (id: string) => void;
    onComment: (id: string) => void;
    onShare: (id: string) => void;
    onProfilePress: (userId: string) => void;
}> = ({ post, onLike, onSave, onComment, onShare, onProfilePress }) => {
    const [isLiked, setIsLiked] = useState(post.user_has_liked);
    const [isSaved, setIsSaved] = useState(post.user_has_saved);
    const [isDoubleTap, setIsDoubleTap] = useState(false);
    const [imageHeight, setImageHeight] = useState(CARD_WIDTH * 1.2); // Altura inicial estándar
    const lastTapRef = useRef<number | null>(null);

    // Función de fecha ultra compacta
    const getTimeAgo = () => {
        const diff = Math.floor((Date.now() - new Date(post.created_at).getTime()) / 1000);
        if (diff < 60) return 'ahora';
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
        return `${Math.floor(diff / 604800)} sem`;
    };

    const handleLike = async () => {
        setIsLiked(!isLiked);
        await onLike(post._id);
    };

    const handleSave = async () => {
        setIsSaved(!isSaved);
        await onSave(post._id);
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTapRef.current && (now - lastTapRef.current) < 500) {
            setIsDoubleTap(true);
            if (!isLiked) handleLike();
            setTimeout(() => setIsDoubleTap(false), 600);
        }
        lastTapRef.current = now;
    };

    // Calcular altura real de la imagen cuando carga
    const handleImageLoad = (event: any) => {
        const { width, height } = event.nativeEvent.source;
        if (width && height) {
            const aspectRatio = height / width;
            setImageHeight(CARD_WIDTH * aspectRatio);
        }
    };

    return (
        <View style={{ 
            width: CARD_WIDTH, 
            marginBottom: 16, 
            backgroundColor: '#FFFFFF', 
            borderRadius: 16, 
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
        }}>
            
            {/* HEADER COMPACTO */}
            <View className="flex-row items-center justify-between p-3 pb-2">
                <TouchableOpacity onPress={() => onProfilePress(post.user_id)} className="flex-row items-center flex-1">
                    <Image source={{ uri: post.user_avatar }} className="w-6 h-6 rounded-full bg-gray-200" />
                    <View className="ml-2 flex-1">
                        <Text className="text-[10px] font-semibold text-gray-900" numberOfLines={1}>
                            {post.user_name}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                            {post.category && (
                                <Text className="text-[8px] text-gray-500 uppercase tracking-wider">
                                    {post.category}
                                </Text>
                            )}
                            <Text className="text-[8px] text-gray-400">• {getTimeAgo()}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className="p-1">
                    <Feather name="more-horizontal" size={13} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            {/* IMAGEN COMPLETA SIN RECORTES */}
            <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap}>
                <View className="relative">
                    <Image
                        source={{ uri: post.image_url }}
                        style={{ height: imageHeight, width: CARD_WIDTH }}
                        className="bg-gray-100"
                        resizeMode="contain"
                        onLoad={handleImageLoad}
                    />

                    {/* Animación doble tap */}
                    {isDoubleTap && (
                        <View className="absolute inset-0 items-center justify-center">
                            <Feather name="heart" size={40} color="#EF4444" />
                        </View>
                    )}

                    {/* Actions overlay compacto */}
                    <BlurView intensity={20} tint="dark" className="absolute bottom-2 right-2 rounded-full overflow-hidden">
                        <View className="flex-row bg-white/15 p-1 gap-0.5">
                            <TouchableOpacity onPress={handleLike} className="p-1.5">
                                <Feather name="heart" size={11} color={isLiked ? "#EF4444" : "#FFFFFF"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onComment(post._id)} className="p-1.5">
                                <Feather name="message-circle" size={11} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onShare(post._id)} className="p-1.5">
                                <Feather name="send" size={11} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </View>
            </TouchableOpacity>

            {/* INFO COMPACTA */}
            <View className="p-3 pt-2">
                <Text className="text-[10px] font-semibold text-gray-900 mb-1">
                    {post.likes_count + (isLiked ? 1 : 0)} me gusta
                </Text>
                
                {post.description && (
                    <Text className="text-[10px] text-gray-700 leading-3.5" numberOfLines={2}>
                        <Text className="font-semibold">{post.user_name} </Text>
                        {post.description}
                    </Text>
                )}
                
                {post.comments_count > 0 && (
                    <TouchableOpacity onPress={() => onComment(post._id)} className="mt-1">
                        <Text className="text-[9px] text-gray-500">
                            Ver {post.comments_count} comentarios
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

// --- COMPONENTE PROMO CARD - SITIO WEB ---
const PromoCard: React.FC = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://proyecto-atr.vercel.app/').catch(err => 
      console.error('Error al abrir URL:', err)
    );
  };

  return (
    <Animated.View 
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
      className="mx-5"
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={handleVisitWebsite}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View
          className="bg-white rounded-2xl overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 6,
            borderWidth: 1,
            borderColor: '#f3f4f6',
          }}
        >
          <View className="flex-row items-center justify-between p-5">
            {/* Contenido */}
            <View className="flex-1 pr-4">
              <Text className="text-gray-900 text-xs font-semibold tracking-wider mb-1.5">
                EXPLORA MÁS
              </Text>
              
              <Text className="text-gray-900 text-lg font-bold mb-1.5">
                Descubre looks en nuestro sitio
              </Text>
              
              <Text className="text-gray-600 text-sm font-light mb-4">
                Encuentra tu estilo perfecto en la colección completa
              </Text>

              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1.5">
                  <Feather name="external-link" size={14} color="#000000" />
                  <Text className="text-gray-900 text-xs font-medium">
                    Visitar sitio web
                  </Text>
                </View>
                
                <View className="w-px h-4 bg-gray-300" />
                
                <View className="bg-gray-900 px-2.5 py-1 rounded-full">
                  <Text className="text-white text-xs font-semibold">
                    Colección 2024
                  </Text>
                </View>
              </View>
            </View>

            {/* Preview del sitio web */}
            <View className="relative">
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&h=250&fit=crop" }}
                className="w-20 h-16 rounded-lg"
                resizeMode="cover"
              />
              <View className="absolute bottom-1 right-1 bg-gray-900/80 rounded-full p-1.5">
                <Feather name="external-link" size={10} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};


// --- ALGORITMO DE MAMPOSTERÍA ---
const MasonryLayout = ({ posts, onLike, onSave }: { posts: Post[]; onLike: (id: string) => void; onSave: (id: string) => void }) => {
    const [columns, setColumns] = useState<Post[][]>([[], []]);

    useEffect(() => {
        const distributePosts = () => {
            const leftColumn: Post[] = [];
            const rightColumn: Post[] = [];
            let leftHeight = 0;
            let rightHeight = 0;

            posts.forEach((post) => {
                const postHeight = getPostHeight(post);

                if (leftHeight <= rightHeight) {
                    leftColumn.push(post);
                    leftHeight += postHeight + CARD_MARGIN * 2;
                } else {
                    rightColumn.push(post);
                    rightHeight += postHeight + CARD_MARGIN * 2;
                }
            });

            setColumns([leftColumn, rightColumn]);
        };

        distributePosts();
    }, [posts]);

    const getPostHeight = (post: Post) => {
        const baseHeight = CARD_WIDTH;
        switch (post.size) {
            case 'small': return baseHeight * 0.8;
            case 'medium': return baseHeight * 1.1;
            case 'large': return baseHeight * 1.4;
            case 'xlarge': return baseHeight * 1.7;
            default: return baseHeight;
        }
    };

    return (
        <View className="flex-row justify-between px-5 pt-2">
            {columns.map((column, columnIndex) => (
                <View key={columnIndex} className="flex-1 mx-1">
                    {column.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onLike={onLike}
                            onSave={onSave}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

// --- COMPONENTE PRINCIPAL ---
const Home: React.FC = () => {
    const navigate = typeof useNavigate === 'function' ? useNavigate() : (path: string) => console.log('Navigate to:', path);
    const [posts, setPosts] = useState<Post[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const currentUserId = '67daf51df4ed8050c7b72619';

    const fetchAllData = async () => {
        try {
            setError(null);
            setLoading(true);
            const apiPosts = await apiService.getApprovedPosts();
            const transformedPosts = apiPosts.map(transformApiPostToAppPost);
            setPosts(transformedPosts);
        } catch (err) {
            setError('Error al cargar los posts');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchAllData();
        setRefreshing(false);
    }, []);

    const handleLikePost = useCallback(async (postId: string) => {
        const post = posts.find(p => p._id === postId);
        if (!post) return;

        const success = post.user_has_liked
            ? await apiService.unlikePost(postId, currentUserId)
            : await apiService.likePost(postId, currentUserId);

        if (success) {
            setPosts(prev => prev.map(p =>
                p._id === postId ? {
                    ...p,
                    user_has_liked: !p.user_has_liked,
                    likes_count: p.user_has_liked ? p.likes_count - 1 : p.likes_count + 1
                } : p
            ));
        }
    }, [posts, currentUserId]);

    const handleSavePost = useCallback(async (postId: string) => {
        const post = posts.find(p => p._id === postId);
        if (!post) return;

        const success = post.user_has_saved
            ? await apiService.unsavePost(postId, currentUserId)
            : await apiService.savePost(postId, currentUserId);

        if (success) {
            setPosts(prev => prev.map(p =>
                p._id === postId ? { ...p, user_has_saved: !p.user_has_saved } : p
            ));
        }
    }, [posts, currentUserId]);

    const ListHeader = () => (
        <>
            <HeroSection />
             <PromoCard />
            <MasonryLayout
                posts={posts}
                onLike={handleLikePost}
                onSave={handleSavePost}
            />
        </>
    );

    if (loading) {
        return (
            <View className="flex-1 bg-white">
                <Header />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#8B4513" />
                    <Text className="mt-4 text-gray-500 text-base">Cargando contenido...</Text>
                </View>
                <BottomNavBar />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-white">
                <Header />
                <View className="flex-1 justify-center items-center p-10">
                    <Text className="text-gray-500 text-base text-center mb-5">{error}</Text>
                    <TouchableOpacity 
                        onPress={fetchAllData}
                        className="bg-[#8B4513] px-6 py-3 rounded-lg"
                    >
                        <Text className="text-white text-base font-semibold">Reintentar</Text>
                    </TouchableOpacity>
                </View>
                <BottomNavBar />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <Header />

            <FlatList
                data={[1]}
                keyExtractor={(item, index) => String(index)}
                renderItem={() => null}
                ListHeaderComponent={ListHeader}
                ListFooterComponent={<View className="h-32" />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#8B4513"
                    />
                    
                }
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            />
         

            <BottomNavBar />
        </View>
    );
};

export default Home;