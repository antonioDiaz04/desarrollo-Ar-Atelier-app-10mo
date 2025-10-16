import React from "react";
// import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Bars3Icon, BellIcon, ShoppingCartIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useSidebar } from "./SidebarContext";
import { useNavigate } from "react-router-native";
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, SafeAreaView, Image, Animated, TouchableOpacity, ScrollView, StyleSheet, RefreshControl, Platform } from 'react-native';

const HERO_HEIGHT = 350;

// Ya no se requiere la prop 'scrollY'
const HeroImage: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  // Animaciones Hero (omitidas por brevedad)
  const circle1Transform = [
    { translateY: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: [0, 40], extrapolate: 'clamp' }) },
    { rotate: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: ['0deg', '45deg'], extrapolate: 'clamp' }) },
    { scale: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: [1, 0.8], extrapolate: 'clamp' }) }
  ];
  const circle2Transform = [
    { translateY: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: [0, -20], extrapolate: 'clamp' }) },
    { rotate: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: ['0deg', '-30deg'], extrapolate: 'clamp' }) },
    { scale: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: [1, 0.9], extrapolate: 'clamp' }) }
  ];
  const circle3Transform = [
    { translateY: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: [0, 60], extrapolate: 'clamp' }) },
    { rotate: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: ['0deg', '60deg'], extrapolate: 'clamp' }) },
    { scale: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: [1, 0.7], extrapolate: 'clamp' }) }
  ];
  const circle4Transform = [
    { translateY: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: [0, -30], extrapolate: 'clamp' }) },
    { rotate: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: ['0deg', '-15deg'], extrapolate: 'clamp' }) },
    { scale: scrollY.interpolate({ inputRange: [0, HERO_HEIGHT], outputRange: [1, 0.95], extrapolate: 'clamp' }) }
  ];

  return (
    <View style={{ height: HERO_HEIGHT }}>
      <LinearGradient
        colors={['#FCFBEF', '#FFF']}
        locations={[0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {/* Círculos animados... */}
      <Animated.View style={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: '#dfdacf', opacity: 0.2, transform: circle1Transform, }} />
      <Animated.View style={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#dfdacf', opacity: 0.2, transform: circle2Transform, }} />
      <Animated.View style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: '#dfdacf', opacity: 0.2, transform: circle3Transform, }} />
      <Animated.View style={{ position: 'absolute', bottom: -20, right: -20, width: 70, height: 70, borderRadius: 35, backgroundColor: '#cdccbc', opacity: 0.2, transform: circle4Transform, }} />

      <View
        className="flex-1 flex-row items-center justify-between px-6"
        style={{ paddingTop: 40 }}
      >
        <View className="flex-1 z-10 pr-4">
          <Text className="text-5xl font-serif tracking-widest text-gray-900 mb-3">
            Atelier
          </Text>
          <Text className="text-xl italic text-gray-700 font-light mb-6">
            Renta y venta de vestidos exclusivos
          </Text>

          <TouchableOpacity className="bg-gray-900 p-3 rounded-full shadow-md self-start mb-6">
            <Text className="text-white text-base font-semibold uppercase tracking-wide">Explorar colección
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-end z-10">
          <Image
            source={{ uri: 'https://res.cloudinary.com/dvvhnrvav/image/upload/v1746397789/shlcavwsffgxemctxdml.png' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ------------------------------------------
  // ESTILOS CLAVE PARA EL EFECTO: TARJETA + SCROLL DESBORDANTE
  // ------------------------------------------
  mainCardStyle: {
    // Define la tarjeta (card) con el fondo, sombra y margen exterior
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16, // Margen exterior que define el ancho de la "tarjeta"
    marginBottom: 24, // Espacio entre cards
    paddingTop: 16, 
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, 
    shadowRadius: 8,
    elevation: 5,
    // CLAVE: Usa 'visible' en iOS para que los elementos del carrusel sobresalgan.
    // En Android, esto puede no funcionar, por lo que el enfoque anterior (tarjeta rota) es más seguro.
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden', 
  },
  scrollViewNoPadding: {
    // El ScrollView no tiene padding horizontal, permitiendo que sus hijos se desborden
    paddingVertical: 8,
    // Importante: en el caso de Android, si 'overflow: hidden' está en el padre, este margen negativo
    // puede ayudar a que los ítems se vean un poco más grandes, aunque no desborden completamente.
    marginHorizontal: Platform.OS === 'android' ? -16 : 0, 
  },
  firstItemMargin: {
    // Compensación para que el primer elemento se alinee con el margen del texto.
    marginLeft: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 16, // <-- Mantiene el padding del texto DENTRO del card
  },
  sectionTitleHeaderPadding: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  // ------------------------------------------
  // ESTILOS GENERALES (Mantenidos)
  // ------------------------------------------
  sectionContainer: {
    marginBottom: 32,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
  },
  sectionTitlePadded: {
    paddingHorizontal: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  productCardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginRight: 16, 
    width: 176,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#DDDDDD',
    padding: 8,
  },
  serviceCard: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginRight: 16,
    padding: 16,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginRight: 16,
    padding: 16,
    width: 288,
  },
  cardImage: {
    width: 160,
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  // ... (resto de los estilos de tipografía, botones, hero, etc.)
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#333333',
    fontWeight: '600',
    marginRight: 4,
  },
  cardTitle: {
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  cardPrice: {
    color: '#333333',
    fontWeight: 'bold',
    marginTop: 4,
    fontSize: 16,
  },
  serviceImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  serviceText: {
    fontWeight: '600',
    textAlign: 'center',
    color: '#333333',
  },
  reviewText: {
    color: '#333333',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'right',
  },
  heroImage: {
    width: 208,
    height: 250,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  errorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  errorAlert: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#ff6347',
    borderRadius: 8,
    padding: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    width: '100%',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});
export default HeroImage;