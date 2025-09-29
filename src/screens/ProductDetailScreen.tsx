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
import { ArrowLeftIcon, StarIcon } from "react-native-heroicons/outline";
// import ImageViewing from "react-native-image-viewing";
import { useNavigate, useParams } from "react-router-native";

const { width } = Dimensions.get("window");
// Pantalla Detalle Vestido
// Definición de la interfaz para los datos del vestido (versión final)
interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  color: string;
  opcionesTipoTransaccion: 'venta' | 'renta' | string;
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

const ProductDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

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
        // Ajusta esta URL si la ruta para el detalle de venta es diferente
        const response = await fetch(`http://192.168.0.104:4000/api/v1/producto/byId/${id}`);
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

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error || "Producto no encontrado."}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigate(-1)}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-100 mr-4"
        >
          <ArrowLeftIcon size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Detalle del Vestido</Text>
      </View>

      {/* Carrusel */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {product.imagenes.map((img, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => {
              setStartIndex(index);
              setViewerVisible(true);
            }}
          >
            <Image
              source={{ uri: img }}
              style={{ width, height: 400 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Info */}
      <View className="p-4">
        {/* Nombre y precio */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-bold text-gray-800 flex-1 pr-2">
            {product.nombre}
          </Text>
          <View className="items-end">
            {product.en_promocion && (
                <Text style={styles.oldPrice}>
                  ${product.precioAnterior}
                </Text>
            )}
            <Text style={product.en_promocion ? styles.promoPrice : styles.currentPrice}>
              ${product.precioActual}
            </Text>
          </View>
        </View>

        {/* Reseñas */}
        <View className="flex-row items-center mb-4">
          <StarIcon size={20} color="#fbbf24" />
          <Text className="ml-1 text-gray-700">
            {product.rating_promedio} ({product.review_count} reseñas)
          </Text>
        </View>

        {/* Descripción */}
        <Text className="text-gray-600 mb-4">{product.descripcion}</Text>

        {/* Características */}
        <View className="bg-white rounded-lg shadow p-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Características</Text>
          <Text className="text-gray-700 mb-1">Talla: {product.talla}</Text>
          <Text className="text-gray-700 mb-1">Color: {product.color}</Text>
          <Text className="text-gray-700 mb-1">Tipo de transacción: {product.opcionesTipoTransaccion}</Text>
          <Text className="text-gray-700 mb-1">Condición: {product.condicion}</Text>
          <Text className="text-gray-700 mb-1">Estilo: {product.estilo}</Text>
          <Text className="text-gray-700 mb-1">Temporada: {product.temporada.join(", ")}</Text>
          <Text className="text-gray-700 mb-1">Cuello: {product.tipoCuello}</Text>
          <Text className="text-gray-700 mb-1">Cola: {product.tipoCola}</Text>
          <Text className="text-gray-700 mb-1">Capas: {product.tipoCapas}</Text>
          <Text className="text-gray-700 mb-1">Hombro: {product.tipoHombro}</Text>
        </View>

        {/* Botón de acción dinámico */}
        <TouchableOpacity
          className={`${product.opcionesTipoTransaccion === 'renta' ? 'bg-blue-600' : 'bg-green-600'} rounded-lg p-4`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {product.opcionesTipoTransaccion === 'renta' ? 'Rentar Ahora' : 'Comprar Ahora'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Visor de imágenes */}
      {/* <ImageViewing */}
        images={product.imagenes.map((uri) => ({ uri }))}
        imageIndex={startIndex}
        visible={isViewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  oldPrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  promoPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
});

export default ProductDetailScreen;