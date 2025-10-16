import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import {
  ArrowLeftIcon,
  StarIcon,
  ShoppingBagIcon,
  CalendarIcon,
  TagIcon,
  SwatchIcon,
  CubeIcon,
} from "react-native-heroicons/outline";
import { useNavigate, useParams } from "react-router-native";

import { API_URL } from "@env";

const { width } = Dimensions.get("window");

// Definición de la interfaz (se mantiene igual)
interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  color: string;
  opcionesTipoTransaccion: "venta" | "renta" | string;
  talla: string;
  tallas_disponibles: string[];
  estilo: string;
  temporada: string[];
  precio_venta?: number;
  precio_renta?: number;
  precioActual: number;
  precioAnterior: number;
  en_oferta: boolean;
  en_promocion: boolean;
  imagenes: string[];
  rating_promedio: number;
  review_count: number;
  condicion: string;
  tipoCuello: string;
  tipoCola: string;
  tipoCapas: string;
  tipoHombro: string;
  disponible: boolean;
  disponible_venta: boolean;
  disponible_renta: boolean;
}

// --- Componente para las Fichas de Características (Chips) ---
interface FeatureChipProps {
  label: string;
  value: string;
  icon: React.ElementType;
}

const FeatureChip: React.FC<FeatureChipProps> = ({ label, value, icon: Icon }) => (
  <View className="flex-row items-center bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2">
    <Icon size={16} color="#4B5563" />
    <Text className="text-xs font-semibold text-gray-700 ml-1">
      {label}: **{value}**
    </Text>
  </View>
);
// -----------------------------------------------------------

const ProductDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) {
        setError("ID de producto no proporcionado.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/producto/byId/${id}`);
        if (!response.ok) {
          throw new Error("No se pudo cargar la información del producto.");
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Hubo un problema al cargar los detalles del producto.");
        Alert.alert("Error", "No se pudo cargar el producto. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading || error || !product) {
    return (
      <View style={styles.centeredContainer}>
        {loading ? (
          <>
            <ActivityIndicator size="large" color="#3B82F6" testID="activity-indicator" />
            <Text style={styles.loadingText}>Cargando detalles...</Text>
          </>
        ) : (
          <>
            <Text style={styles.errorText}>{error || "Producto no encontrado."}</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigate(-1)}>
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  // --- Contenedor Principal (Flexbox) para el diseño con Sticky Footer ---
  return (
    <View className="flex-1 bg-gray-50"> 
      
      {/* Contenido Desplazable */}
      {/* Usamos el paddingBottom del StyleSheet para asegurar espacio para el Footer */}
      <ScrollView contentContainerStyle={styles.scrollPadding} className="flex-1"> 
        
        {/* Carrusel de Imágenes con Header Absoluto */}
        <View className="relative">
          {/* Botón de Volver ABSOLUTO */}
          <TouchableOpacity
            onPress={() => navigate(-1)}
            className="absolute top-10 left-4 z-10 p-2 rounded-full bg-white/70 shadow-lg"
          >
            <ArrowLeftIcon size={28} color="#333" />
          </TouchableOpacity>

          {/* Carrusel */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {product.imagenes.map((img, index) => (
              <TouchableOpacity key={index} activeOpacity={0.9}>
                <Image
                  source={{ uri: img }}
                  style={{ width, height: 400 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Información del Producto */}
        <View className="p-4 bg-white rounded-t-xl -mt-4 shadow-xl">
          
          {/* Nombre y precio */}
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-2xl font-extrabold text-gray-900 flex-1 pr-4">
              {product.nombre}
            </Text>
            <View className="items-end">
              {product.en_promocion && (
                <Text style={styles.oldPrice}>
                  ${product.precioAnterior}
                </Text>
              )}
              <Text style={product.en_promocion ? styles.promoPrice : styles.currentPrice} className="text-3xl">
                ${product.precioActual}
              </Text>
            </View>
          </View>

          {/* Reseñas */}
          <View className="flex-row items-center mb-4">
            <StarIcon size={20} color="#fbbf24" />
            <Text className="ml-1 text-gray-700 font-semibold">
              {product.rating_promedio}
            </Text>
            <Text className="text-gray-500"> ({product.review_count} reseñas)</Text>
          </View>

          {/* Descripción */}
          <Text className="text-gray-600 mb-6 leading-6">{product.descripcion}</Text>

          {/* Características CLAVE (Fichas/Chips) */}
          <Text className="text-lg font-bold text-gray-800 mb-3">Detalles Clave</Text>
          <View className="flex-row flex-wrap mb-6">
            <FeatureChip label="Talla" value={product.talla} icon={TagIcon} />
            <FeatureChip label="Color" value={product.color} icon={SwatchIcon} />
            <FeatureChip label="Condición" value={product.condicion} icon={CubeIcon} />
            <FeatureChip label="Estilo" value={product.estilo} icon={CubeIcon} />
          </View>

          {/* Detalles Completos */}
          <View className="bg-gray-100 rounded-lg p-4 mb-4">
              <Text className="text-base font-semibold text-gray-700 mb-2">Más Especificaciones</Text>
              <Text className="text-gray-600 mb-1">• Tipo de transacción: {product.opcionesTipoTransaccion}</Text>
              <Text className="text-gray-600 mb-1">• Temporada: {product.temporada.join(", ")}</Text>
              <Text className="text-gray-600 mb-1">• Cuello: {product.tipoCuello}</Text>
              <Text className="text-gray-600 mb-1">• Cola: {product.tipoCola}</Text>
              <Text className="text-gray-600 mb-1">• Hombro: {product.tipoHombro}</Text>
          </View>
          
        </View>
        
      </ScrollView>

      {/* --- Sticky Footer (Barra de Acción Fija y BLANCA) --- */}
      {/* CLAVE: bg-white, bottom-0, y pb-12 para compensar la barra de sistema. */}
      <View className="absolute bottom-0 left-0 right-0 p-4 pt-3 border-t border-gray-200 bg-white shadow-2xl pb-12">
        <TouchableOpacity
          className={`${product.opcionesTipoTransaccion === 'renta' ? 'bg-blue-600' : 'bg-green-600'} rounded-xl p-4 flex-row justify-center items-center shadow-lg`}
        >
          {/* Ícono dinámico */}
          {product.opcionesTipoTransaccion === 'renta' ? (
            <CalendarIcon size={24} color="white" />
          ) : (
            <ShoppingBagIcon size={24} color="white" />
          )}
          <Text className="text-white text-center font-bold text-lg ml-3">
            {product.opcionesTipoTransaccion === 'renta' ? 'Rentar Ahora' : 'Comprar Ahora'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* --------------------------------------------- */}
    </View>
  );
};

const styles = StyleSheet.create({
  // Ajuste CLAVE: El padding debe ser suficiente para que el último contenido NO quede
  // debajo del footer (que ahora es más alto debido al pb-12).
  scrollPadding: {
    paddingBottom: 120, 
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  // Estilos de precios
  oldPrice: {
    fontSize: 18,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  promoPrice: {
    fontSize: 32,
    fontWeight: 'extrabold',
    color: '#10B981',
  },
});

export default ProductDetailScreen;