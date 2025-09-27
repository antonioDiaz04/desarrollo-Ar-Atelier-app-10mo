import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { ChevronRightIcon } from 'react-native-heroicons/outline';
import { useNavigate } from 'react-router-native';
import DynamicHeader from '~/components/DynamicHeader';
import BottomNavBar from '~/components/BottomNavBar';

// ... (interfaces y datos de ejemplo aquí)
interface Rent {
  id: string;
  name: string;
  status: 'En curso' | 'Finalizada';
  rentalDate: string;
  returnDate: string;
  price: string;
  image: string;
  details: string;
}

interface Purchase {
  id: string;
  name: string;
  status: 'Recibido' | 'Comprado';
  purchaseDate: string;
  price: string;
  image: string;
  details: string;
}

type Product = Rent | Purchase;

// src/components/HistoryScreen.tsx

// ... (todas tus importaciones y código existente)

const rents: Rent[] = [
  {
    id: 'rent-101',
    name: 'Vestido "Étoile" Clásico',
    status: 'En curso',
    rentalDate: '15/08/2024',
    returnDate: '22/08/2024',
    price: '$120.00',
    image: 'https://placehold.co/400x400/98C1D9/FFFFFF?text=Renta+Etoile',
    details: 'Para el evento del 20 de agosto.',
  },
  {
    id: 'rent-102',
    name: 'Vestido de Noche "Aurora"',
    status: 'En curso',
    rentalDate: '20/08/2024',
    returnDate: '27/08/2024',
    price: '$80.00',
    image: 'https://placehold.co/400x400/D4B7D4/FFFFFF?text=Renta+Aurora',
    details: 'Pendiente de devolución.',
  },
  {
    id: 'rent-103',
    name: 'Vestido "Soirée"',
    status: 'Finalizada',
    rentalDate: '01/07/2024',
    returnDate: '08/07/2024',
    price: '$95.00',
    image: 'https://placehold.co/400x400/D9BF98/FFFFFF?text=Renta+Soiree',
    details: 'Devuelto y revisado el 10 de julio.',
  },
  {
    id: 'rent-104',
    name: 'Vestido de Gala "Prestige"',
    status: 'Finalizada',
    rentalDate: '10/06/2024',
    returnDate: '17/06/2024',
    price: '$150.00',
    image: 'https://placehold.co/400x400/C4E7A1/FFFFFF?text=Renta+Prestige',
    details: 'Devolución sin incidentes. Recibido el 18 de junio.',
  },
];

const purchases: Purchase[] = [
  {
    id: 'purchase-201',
    name: 'Vestido "Princesse"',
    status: 'Recibido',
    purchaseDate: '12/08/2024',
    price: '$299.00',
    image: 'https://placehold.co/400x400/F08080/FFFFFF?text=Venta+Princesse',
    details: 'Entregado en tu domicilio el 18 de agosto.',
  },
  {
    id: 'purchase-202',
    name: 'Vestido "Majestic"',
    status: 'Comprado',
    purchaseDate: '05/08/2024',
    price: '$450.00',
    image: 'https://placehold.co/400x400/ADD8E6/FFFFFF?text=Venta+Majestic',
    details: 'En proceso de envío.',
  },
];

// Variables para tabs
type TabKey = 'current' | 'past' | 'purchases';

const tabLabels: Record<TabKey, string> = {
  current: 'Rentas Actuales',
  past: 'Rentas Pasadas',
  purchases: 'Compras',
};

const screenWidth = Dimensions.get('window').width;

const HistoryScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('current');
  const tabTranslate = useRef(new Animated.Value(0)).current;

  // Anima el indicador debajo de la tab activa
  useEffect(() => {
    const tabIndex = Object.keys(tabLabels).indexOf(activeTab);
    Animated.spring(tabTranslate, {
      toValue: (screenWidth - 32) / 3 * tabIndex,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const getFilteredItems = (): Product[] => {
    switch (activeTab) {
      case 'current':
        return rents.filter((r) => r.status === 'En curso');
      case 'past':
        return rents.filter((r) => r.status === 'Finalizada');
      case 'purchases':
        return purchases;
      default:
        return [];
    }
  };

  const handleViewDetails = (item: Product) => {
    navigate('/details', { state: { itemData: item } });
  };

  const filteredItems = getFilteredItems();

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <DynamicHeader
        title="Historial"
        showBackButton={true}
        onBackPress={() => navigate(-1)}
      />

      {/* ⚠️ TABS CONTENEDOR MODIFICADO ⚠️ */}
      <View
        className="flex-row mx-4 mt-4 rounded-xl relative h-12"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 4,
          backgroundColor: '#fff',
        }}
      >
        {/* INDICADOR ANIMADO: Se mantiene, pero ahora es un indicador de texto */}
        <Animated.View
          className="absolute h-full w-1/3 rounded-xl"
          style={{
            backgroundColor: 'transparent', // ✨ Fondo transparente ✨
            transform: [{ translateX: tabTranslate }],
          }}
        />

        {Object.entries(tabLabels).map(([key, label]) => {
          const keyTyped = key as TabKey;
          const active = activeTab === keyTyped;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveTab(keyTyped)}
              className="flex-1 justify-center items-center z-10"
            >
              <Text
                className="font-semibold text-base"
                style={{
                  color: active ? '#111827' : '#6B7280', // ✨ Cambio de color de texto ✨
                  fontWeight: active ? 'bold' : 'normal',
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* LISTA DE ITEMS */}
      <ScrollView
        style={{ paddingHorizontal: 16, marginTop: 16 }}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {filteredItems.length === 0 ? (
          <Text
            style={{
              textAlign: 'center',
              marginTop: 80,
              color: '#9CA3AF',
              fontSize: 16,
            }}
          >
            No hay elementos en esta categoría.
          </Text>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleViewDetails(item)}
              className="flex-row bg-white rounded-xl mb-4 p-3 shadow-md items-center"
            >
              <Image
                source={{ uri: item.image }}
                className="w-16 h-16 rounded-xl mr-3 bg-gray-200"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text
                  className="text-base font-bold text-gray-900"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text
                  className="mt-1 text-xs font-semibold"
                  style={{
                    color:
                      item.status === 'En curso' ||
                        item.status === 'Recibido' ||
                        item.status === 'Comprado'
                        ? '#10B981' // verde
                        : '#EF4444', // rojo
                  }}
                >
                  {item.status}
                </Text>
              </View>
              <ChevronRightIcon size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <BottomNavBar />

    </View>
  );
};

export default HistoryScreen;