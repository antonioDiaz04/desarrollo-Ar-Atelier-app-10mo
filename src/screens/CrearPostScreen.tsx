import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useNavigate } from 'react-router-native';
import { 
  ArrowLeftIcon, 
  CameraIcon, 
  XMarkIcon, 
  PlusIcon, 
  PhotoIcon,
} from 'react-native-heroicons/outline';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';

// --- INTERFACES ---
interface PostFormData {
  imagenesUris: string[];
  descripcion: string;
  etiqueta: 'comprado' | 'rentado' | 'propio';
  tags: string[];
  collections: string[];
  shoppingLinks: { nombre: string; url: string }[];
}

// --- CONFIGURACIÓN ---
const API_URL = 'https://tu-backend.com/api/posts';
const ETIQUETAS: Array<PostFormData['etiqueta']> = ['propio', 'comprado', 'rentado'];
const COLECCIONES_PREDEFINIDAS = ['Verano', 'Invierno', 'Ocasiones', 'Trabajo', 'Casual'];

// --- FUNCIÓN SIMPLIFICADA DE PERMISOS ---
const requestPermission = async (type: 'camera' | 'gallery'): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const permissionType = type === 'camera' 
      ? PermissionsAndroid.PERMISSIONS.CAMERA 
      : Platform.Version >= 33 
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const result = await PermissionsAndroid.request(permissionType, {
      title: type === 'camera' ? "Permiso de Cámara" : "Permiso de Galería",
      message: `Necesitamos acceso a tu ${type === 'camera' ? 'cámara' : 'galería'} para subir fotos.`,
      buttonPositive: "OK",
      buttonNegative: "Cancelar",
    });

    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Error de permiso:', error);
    return false;
  }
};

const CrearPostScreen: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostFormData>({
    imagenesUris: [],
    descripcion: '',
    etiqueta: 'propio',
    tags: [],
    collections: [],
    shoppingLinks: [],
  });
  const [loading, setLoading] = useState(false);
  const [modalTag, setModalTag] = useState({ visible: false, value: '' });
  const [modalLink, setModalLink] = useState({ visible: false, nombre: '', url: '' });

  // --- MANEJO DE IMÁGENES ---
  const handleImagePicker = useCallback(async (type: 'gallery' | 'camera') => {
    const hasPermission = await requestPermission(type);
    
    if (!hasPermission) {
      Alert.alert(
        'Permiso necesario',
        `Activa el permiso en Configuración > Aplicaciones > [TuApp] > Permisos.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a Configuración', onPress: () => PermissionsAndroid.openSettings() }
        ]
      );
      return;
    }

    const options = {
      mediaType: 'photo' as const,
      quality: 0.8,
      selectionLimit: type === 'gallery' ? 10 : 1,
    };

    const result: ImagePickerResponse = type === 'gallery' 
      ? await launchImageLibrary(options)
      : await launchCamera(options);

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', 'No se pudo acceder a la imagen');
      return;
    }

    if (result.assets?.length) {
      const uris = result.assets.map(a => a.uri!).filter(Boolean);
      setFormData(prev => ({ ...prev, imagenesUris: [...prev.imagenesUris, ...uris] }));
    }
  }, []);

  // --- RESTO DE LAS FUNCIONES (SIMPLIFICADAS) ---
  const handleRemoveImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenesUris: prev.imagenesUris.filter((_, i) => i !== index),
    }));
  }, []);

  const handleAddTag = useCallback(() => {
    if (modalTag.value.trim() && !formData.tags.includes(modalTag.value.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, modalTag.value.trim()],
      }));
      setModalTag({ visible: false, value: '' });
    }
  }, [modalTag.value, formData.tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }, []);

  const handleToggleCollection = useCallback((collection: string) => {
    setFormData(prev => ({
      ...prev,
      collections: prev.collections.includes(collection)
        ? prev.collections.filter(c => c !== collection)
        : [...prev.collections, collection],
    }));
  }, []);

  const handleAddLink = useCallback(() => {
    if (modalLink.nombre.trim() && modalLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        shoppingLinks: [...prev.shoppingLinks, { nombre: modalLink.nombre.trim(), url: modalLink.url.trim() }],
      }));
      setModalLink({ visible: false, nombre: '', url: '' });
    }
  }, [modalLink.nombre, modalLink.url]);

  const handleRemoveLink = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      shoppingLinks: prev.shoppingLinks.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (formData.imagenesUris.length === 0) {
      Alert.alert('Error', 'Selecciona al menos una imagen.');
      return;
    }

    setLoading(true);
    
    const data = new FormData();
    formData.imagenesUris.forEach((uri, index) => {
      data.append('imagenes', {
        uri: uri.startsWith('file://') ? uri : `file://${uri}`,
        name: `image_${index}.jpg`,
        type: 'image/jpeg',
      } as any);
    });
    
    data.append('descripcion', formData.descripcion);
    data.append('etiqueta', formData.etiqueta);
    data.append('tags', JSON.stringify(formData.tags));
    data.append('collections', JSON.stringify(formData.collections));
    data.append('shoppingLinks', JSON.stringify(formData.shoppingLinks));

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer TU_TOKEN_DE_AUTH' },
        body: data,
      });

      if (!response.ok) throw new Error('Error en la subida');
      
      Alert.alert('Éxito', 'Look publicado correctamente.');
      navigate(-1);
    } catch (error) {
      Alert.alert('Error', 'No se pudo publicar el look.');
    } finally {
      setLoading(false);
    }
  }, [formData, navigate]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="flex-row items-center justify-between mt-14 p-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => navigate(-1)} className="p-2">
          <ArrowLeftIcon size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Publicar look</Text>
        <TouchableOpacity 
          onPress={handleSubmit} 
          disabled={loading || formData.imagenesUris.length === 0}
          className={`px-4 py-1.5 rounded-full ${loading || formData.imagenesUris.length === 0 ? 'bg-gray-300' : 'bg-gray-900'}`}
        >
          <Text className="text-white text-sm font-medium">
            {loading ? 'Publicando' : 'Publicar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* IMÁGENES */}
        <View className="p-4 bg-white mb-3">
          <Text className="text-base font-semibold text-gray-900 mb-3">Imágenes</Text>
          
          {formData.imagenesUris.length > 0 && (
            <FlatList
              horizontal
              data={formData.imagenesUris}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View className="mr-3 relative">
                  <Image source={{ uri: item }} className="w-20 h-20 rounded-lg" />
                  <TouchableOpacity 
                    onPress={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-gray-900 rounded-full w-6 h-6 items-center justify-center"
                  >
                    <XMarkIcon size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
              className="mb-3"
            />
          )}
          
          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={() => handleImagePicker('gallery')}
              className="flex-1 flex-row items-center justify-center bg-gray-900 py-3 rounded-lg"
            >
              <PhotoIcon size={16} color="#FFFFFF" />
              <Text className="text-white text-sm font-medium ml-2">Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleImagePicker('camera')}
              className="flex-1 flex-row items-center justify-center border border-gray-300 py-3 rounded-lg"
            >
              <CameraIcon size={16} color="#111827" />
              <Text className="text-gray-900 text-sm font-medium ml-2">Cámara</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-xs text-gray-500 text-center mt-2">
            {formData.imagenesUris.length} imagen(es)
          </Text>
        </View>

        {/* DESCRIPCIÓN */}
        <View className="p-4 bg-white mb-3">
          <Text className="text-base font-semibold text-gray-900 mb-2">Descripción</Text>
          <TextInput
            placeholder="Describe tu estilo..."
            value={formData.descripcion}
            onChangeText={(text) => setFormData(prev => ({ ...prev, descripcion: text.substring(0, 300) }))}
            multiline
            maxLength={300}
            className="h-28 p-3 border border-gray-200 rounded-lg text-gray-900 text-sm"
            style={{ textAlignVertical: 'top' as const }}
          />
          <Text className="text-xs text-gray-400 text-right mt-1">
            {formData.descripcion.length}/300
          </Text>
        </View>

        {/* TIPO */}
        <View className="p-4 bg-white mb-3">
          <Text className="text-base font-semibold text-gray-900 mb-2">Tipo de look</Text>
          <View className="flex-row gap-2">
            {ETIQUETAS.map((etiqueta) => (
              <TouchableOpacity
                key={etiqueta}
                onPress={() => setFormData(prev => ({ ...prev, etiqueta }))}
                className={`flex-1 py-2 rounded-lg items-center ${
                  formData.etiqueta === etiqueta ? 'bg-gray-900' : 'bg-gray-100'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  formData.etiqueta === etiqueta ? 'text-white' : 'text-gray-700'
                }`}>
                  {etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ETIQUETAS */}
        <View className="p-4 bg-white mb-3">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-semibold text-gray-900">Etiquetas</Text>
            <TouchableOpacity 
              onPress={() => setModalTag(prev => ({ ...prev, visible: true }))}
              className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full"
            >
              <PlusIcon size={14} color="#111827" />
              <Text className="text-gray-900 text-xs font-medium ml-1">Agregar</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <View key={index} className="bg-gray-100 rounded-full px-3 py-1.5 flex-row items-center">
                <Text className="text-gray-700 text-xs">#{tag}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)} className="ml-2">
                  <XMarkIcon size={12} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ))}
            {formData.tags.length === 0 && (
              <Text className="text-gray-400 text-xs italic">Sin etiquetas</Text>
            )}
          </View>
        </View>

        {/* COLECCIONES */}
        <View className="p-4 bg-white mb-3">
          <Text className="text-base font-semibold text-gray-900 mb-2">Colecciones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {COLECCIONES_PREDEFINIDAS.map((collection) => (
              <TouchableOpacity
                key={collection}
                onPress={() => handleToggleCollection(collection)}
                className={`px-4 py-2 rounded-full ${
                  formData.collections.includes(collection) 
                    ? 'bg-gray-900' 
                    : 'bg-gray-100 border border-gray-200'
                }`}
              >
                <Text className={`text-xs font-medium ${
                  formData.collections.includes(collection) ? 'text-white' : 'text-gray-700'
                }`}>
                  {collection}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ENLACES DE COMPRA */}
        <View className="p-4 bg-white mb-20">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-semibold text-gray-900">Enlaces</Text>
            <TouchableOpacity 
              onPress={() => setModalLink(prev => ({ ...prev, visible: true }))}
              className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full"
            >
              <PlusIcon size={14} color="#111827" />
              <Text className="text-gray-900 text-xs font-medium ml-1">Agregar</Text>
            </TouchableOpacity>
          </View>
          
          {formData.shoppingLinks.length > 0 ? (
            formData.shoppingLinks.map((link, index) => (
              <View key={index} className="bg-gray-50 p-3 rounded-lg mb-2 flex-row items-center justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-gray-900 text-sm font-medium">{link.nombre}</Text>
                  <Text className="text-gray-500 text-xs" numberOfLines={1}>{link.url}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveLink(index)}>
                  <XMarkIcon size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-gray-400 text-xs italic">Sin enlaces de compra</Text>
          )}
        </View>
      </ScrollView>

      {/* MODALES */}
      {/* Modal Tags */}
      <Modal animationType="fade" transparent visible={modalTag.visible} onRequestClose={() => setModalTag(prev => ({ ...prev, visible: false }))}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-5 w-11/12 max-w-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Nueva etiqueta</Text>
            <TextInput
              placeholder="Ej: vintage, verano..."
              value={modalTag.value}
              onChangeText={(text) => setModalTag(prev => ({ ...prev, value: text }))}
              className="p-3 border border-gray-200 rounded-lg text-gray-900 text-sm mb-4"
              autoFocus
            />
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setModalTag(prev => ({ ...prev, visible: false, value: '' }))} className="flex-1 py-2 border border-gray-300 rounded-lg">
                <Text className="text-gray-700 text-center text-sm font-medium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddTag} disabled={!modalTag.value.trim()} className={`flex-1 py-2 rounded-lg ${!modalTag.value.trim() ? 'bg-gray-300' : 'bg-gray-900'}`}>
                <Text className="text-white text-center text-sm font-medium">Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Links */}
      <Modal animationType="fade" transparent visible={modalLink.visible} onRequestClose={() => setModalLink(prev => ({ ...prev, visible: false, nombre: '', url: '' }))}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-5 w-11/12 max-w-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Enlace de compra</Text>
            <TextInput placeholder="Producto" value={modalLink.nombre} onChangeText={(text) => setModalLink(prev => ({ ...prev, nombre: text }))} className="p-3 border border-gray-200 rounded-lg text-gray-900 text-sm mb-3" />
            <TextInput placeholder="URL" value={modalLink.url} onChangeText={(text) => setModalLink(prev => ({ ...prev, url: text }))} className="p-3 border border-gray-200 rounded-lg text-gray-900 text-sm mb-4" keyboardType="url" autoCapitalize="none" />
            <View className="flex-row gap-3">
              <TouchableOpacity onPress={() => setModalLink(prev => ({ ...prev, visible: false, nombre: '', url: '' }))} className="flex-1 py-2 border border-gray-300 rounded-lg">
                <Text className="text-gray-700 text-center text-sm font-medium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddLink} disabled={!modalLink.nombre.trim() || !modalLink.url.trim()} className={`flex-1 py-2 rounded-lg ${!modalLink.nombre.trim() || !modalLink.url.trim() ? 'bg-gray-300' : 'bg-gray-900'}`}>
                <Text className="text-white text-center text-sm font-medium">Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CrearPostScreen;