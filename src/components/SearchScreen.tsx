import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-native';
import BottomNavBar from './BottomNavBar';

// Interfaces for type-checking
interface Product {
  id: string;
  name: string;
  type: 'rent' | 'sale';
  price: number;
  image: string;
}

interface QuickLink {
  id: string;
  title: string;
  path: string;
  icon: keyof typeof Feather.glyphMap;
}

// Datos de ejemplo con tipado
const allProducts: Product[] = [
  { id: 'rent-1', name: 'Vestido de Noche Aurora', type: 'rent', price: 80, image: 'https://placehold.co/400x400/D4B7D4/FFFFFF?text=Vestido+Aurora' },
  { id: 'rent-2', name: 'Vestido "Étoile" Clásico', type: 'rent', price: 120, image: 'https://placehold.co/400x400/98C1D9/FFFFFF?text=Vestido+Etoile' },
  { id: 'sale-1', name: 'Vestido "Princesse"', type: 'sale', price: 299, image: 'https://placehold.co/400x400/F08080/FFFFFF?text=Vestido+Princesse' },
  { id: 'sale-2', name: 'Vestido de Fiesta', type: 'sale', price: 150, image: 'https://placehold.co/400x400/B0E0E6/FFFFFF?text=Vestido+Fiesta' },
  { id: 'rent-3', name: 'Vestido Largo Rojo', type: 'rent', price: 95, image: 'https://placehold.co/400x400/FF6347/FFFFFF?text=Vestido+Rojo' },
];

const quickLinks: QuickLink[] = [
  { id: 'link-1', title: 'Rentas y Ventas', path: '/rent-collection', icon: 'shopping-bag' },
  { id: 'link-2', title: 'Políticas de Renta', path: '/policies', icon: 'file-text' },
  { id: 'link-3', title: 'Notificaciones', path: '/notifications', icon: 'bell' },
  { id: 'link-4', title: 'Contacto', path: '/contact', icon: 'mail' },
];

const popularProducts: Product[] = [
  { id: 'pop-1', name: 'Vestido "Soirée"', type: 'rent', price: 95, image: 'https://placehold.co/400x400/D9BF98/FFFFFF?text=Soiree' },
  { id: 'pop-2', name: 'Vestido de Gala "Prestige"', type: 'rent', price: 150, image: 'https://placehold.co/400x400/C4E7A1/FFFFFF?text=Prestige' },
  { id: 'pop-3', name: 'Vestido "Majestic"', type: 'sale', price: 450, image: 'https://placehold.co/400x400/ADD8E6/FFFFFF?text=Majestic' },
];

const SearchScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async (): Promise<void> => {
    try {
      const storedHistory = await AsyncStorage.getItem('searchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory) as string[]);
      }
    } catch (error) {
      console.error('Failed to load search history', error);
    }
  };

  const saveSearchHistory = async (history: string[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save search history', error);
    }
  };

  const handleSearch = (text: string): void => {
    setSearchText(text);
    if (text.length > 0) {
      const filteredProducts = allProducts.filter(p =>
        p.name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]);
    }
  };

  const addToHistory = (query: string): void => {
    if (query && !searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory.slice(0, 4)];
      setSearchHistory(newHistory);
      saveSearchHistory(newHistory);
    }
  };

  const handleSearchSubmit = (): void => {
    if (searchText.length > 0 && searchResults.length > 0) {
      addToHistory(searchText);
    }
  };

  const handleHistoryPress = (query: string): void => {
    setSearchText(query);
    handleSearch(query);
    addToHistory(query);
  };

  const clearHistory = async (): Promise<void> => {
    Alert.alert(
      'Limpiar Historial',
      '¿Estás seguro de que quieres borrar tu historial de búsqueda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            setSearchHistory([]);
            await AsyncStorage.removeItem('searchHistory');
          },
        },
      ]
    );
  };

  const renderProduct = (product: Product, index: number) => (
    <TouchableOpacity
      key={index} // Mejor usar product.id si es estable
      onPress={() => navigate(`/product/${product.id}?type=${product.type}`)}
      className="flex-row items-center p-3 border-b border-gray-200"
    >
      <Image source={{ uri: product.image }} className="w-16 h-16 rounded-lg mr-4" />
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">{product.name}</Text>
        <Text className="text-sm text-gray-500">
          {product.type === 'rent' ? `Renta: $${product.price}/día` : `Venta: $${product.price}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const showInitialView = searchText.length === 0;
  const showResults = searchResults.length > 0;
  const showNoResults = searchText.length > 0 && searchResults.length === 0;

  return (
    <View className="flex-1 mt-10 bg-gray-50">
      {/* HEADER DE BÚSQUEDA */}
      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity onPress={() => navigate(-1)} className="p-1">
            <Feather name="arrow-left" size={24} color="#6B7280" />
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center h-12 px-4 rounded-full bg-gray-100">
            <Feather name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Buscar vestidos, accesorios..."
              value={searchText}
              onChangeText={handleSearch}
              onSubmitEditing={handleSearchSubmit}
              autoFocus
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')} className="p-1">
                <Feather name="x-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* VISTA INICIAL: HISTORIAL, SUGERENCIAS Y PRODUCTOS POPULARES */}
        {showInitialView && (
          <View className="p-4">
            {searchHistory.length > 0 && (
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-bold text-gray-800">Búsquedas Recientes</Text>
                  <TouchableOpacity onPress={clearHistory}>
                    <Text className="text-sm text-red-500">Limpiar</Text>
                  </TouchableOpacity>
                </View>
                {searchHistory.map((query, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleHistoryPress(query)}
                    className="flex-row items-center py-2"
                  >
                    <Feather name="clock" size={16} color="#6B7280" />
                    <Text className="ml-2 text-base text-gray-600">{query}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-2">Sugerencias Rápidas</Text>
              {quickLinks.map(link => (
                <TouchableOpacity
                  key={link.id}
                  onPress={() => navigate(link.path)}
                  className="flex-row items-center py-2"
                >
                  <Feather name={link.icon} size={16} color="#4B5563" />
                  <Text className="ml-2 text-base text-gray-700">{link.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View>
              <Text className="text-lg font-bold text-gray-800 mb-2">Productos Populares</Text>
              {popularProducts.map((product) => renderProduct(product, popularProducts.indexOf(product)))}
            </View>
          </View>
        )}

        {/* VISTA DE RESULTADOS */}
        {showResults && (
          <View className="p-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">Productos ({searchResults.length})</Text>
            {searchResults.map((product, index) => renderProduct(product, index))}
          </View>
        )}

        {/* VISTA SIN RESULTADOS */}
        {showNoResults && (
          <View className="p-4">
            <View className="items-center justify-center mt-20">
              <Feather name="frown" size={48} color="#9CA3AF" />
              <Text className="mt-4 text-gray-500 text-lg text-center">
                No se encontraron resultados para "{searchText}".
              </Text>
            </View>
            
            {/* Mantener sugerencias visibles cuando no hay resultados */}
            <View className="mt-8 pt-4 border-t border-gray-200">
              <Text className="text-lg font-bold text-gray-800 mb-2">Intenta buscar en:</Text>
              {quickLinks.map(link => (
                <TouchableOpacity
                  key={link.id}
                  onPress={() => navigate(link.path)}
                  className="flex-row items-center py-2"
                >
                  <Feather name={link.icon} size={16} color="#4B5563" />
                  <Text className="ml-2 text-base text-gray-700">{link.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <BottomNavBar />

    </View>
  );
};

export default SearchScreen;