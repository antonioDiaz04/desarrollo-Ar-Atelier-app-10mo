import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, Animated, TouchableOpacity, ScrollView, StyleSheet, RefreshControl, Platform } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// ... (otras importaciones) ...
import Header from '~/components/Header';
import BottomNavBar from '~/components/BottomNavBar';
import Sidebar from '~/components/Sidebar';
import RentalProcessSection from '~/components/RentalProcessSection';
import { API_URL } from '@env';

console.log(API_URL);

// Definición de tipos y constantes (omitiendo por brevedad)

const HERO_HEIGHT = 350;

// ... (componente Home, estados, funciones showAlert, fetchDresses, onRefresh, animaciones Hero) ...

interface Dress {
    _id: string;
    nombre: string;
    precio_venta: number;
    precio_renta: number;
    opcionesTipoTransaccion: 'venta' | 'renta' | string;
    imagenes: string[];
    disponible_venta: boolean;
    disponible_renta: boolean;
    en_promocion: boolean;
    precio_promocion: number;
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const scrollY = useRef(new Animated.Value(0)).current;
    const errorOpacity = useRef(new Animated.Value(0)).current;
    const [rentCollection, setRentCollection] = useState<Dress[]>([]);
    const [salesCollection, setSalesCollection] = useState<Dress[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const showAlert = (message: string) => {
        setError(message);
        Animated.sequence([
            Animated.timing(errorOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(4000),
            Animated.timing(errorOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setError(null));
    };

    const fetchDresses = async () => {
        try {
            const response = await fetch(`${API_URL}/vestido`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Dress[] = await response.json();
            const rentItems = data.filter(dress => dress.opcionesTipoTransaccion === 'renta' || dress.disponible_renta);
            const salesItems = data.filter(dress => dress.opcionesTipoTransaccion === 'venta' || dress.disponible_venta);
            setRentCollection(rentItems);
            setSalesCollection(salesItems);
        } catch (err) {
            console.error("Error fetching dresses:", err);
            showAlert("No se pudieron cargar los vestidos. Inténtalo de nuevo.");
        }
    };

    useEffect(() => {
        const initialLoad = async () => {
            setLoading(true);
            await fetchDresses();
            setLoading(false);
        };
        initialLoad();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDresses();
        setRefreshing(false);
    };

    const itemCardShadowStyle = {
        shadowColor: '#888888',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    };
    const reviews = [
        { id: 'rev1', text: 'El vestido de mis sueños para mi evento. ¡Gracias, Atelier!', author: 'Sofía M.' },
        { id: 'rev2', text: 'Excelente servicio de renta y ajustes perfectos.', author: 'Isabella P.' },
        { id: 'rev3', text: 'Calidad superior y atención al detalle. 100% recomendado.', author: 'Valeria R.' },
    ];

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
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <Header />

            {/* Alerta de error flotante */}
            {error && (
                <Animated.View style={[styles.errorAlert, { opacity: errorOpacity }]}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => setError(null)} style={styles.closeButton}>
                        <Feather name="x-circle" size={24} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            )}

            <Animated.ScrollView
                className="flex-1"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#000"
                        colors={['#000']}
                    />
                }
            >
                {/* HERO SECTION (Mantenido) */}
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

                {/* --- */}

                {/* === SECCIÓN COLECCIÓN EN RENTA (TARJETA CONTENEDORA con overflow visible) === */}
                <View style={styles.mainCardStyle}>
                    {/* El header mantiene el padding para alinear el texto dentro de la tarjeta */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Colección en Renta</Text>
                        <TouchableOpacity onPress={() => navigate('/rent-collection')} style={styles.viewMoreButton}>
                            <Text style={styles.viewMoreText}>Ver más</Text>
                            <Feather name="chevron-right" size={18} color="#333333" />
                        </TouchableOpacity>
                    </View>

                    {/* El ScrollView ocupa todo el ancho, pero los márgenes se controlan en los ítems */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollViewNoPadding}>
                        {loading && rentCollection.length === 0 ? (
                            <Text style={styles.loadingText}>Cargando...</Text>
                        ) : (
                            rentCollection.map((dress, index) => (
                                <TouchableOpacity
                                    key={dress._id}
                                    // Se aplica el margen inicial solo al primer ítem (para alineación)
                                    style={[itemCardShadowStyle, styles.productCardContainer, index === 0 && styles.firstItemMargin]}
                                    onPress={() => navigate(`/product/${dress._id}`)}
                                >
                                    <Image source={{ uri: dress.imagenes[0] }} style={styles.cardImage} />
                                    <Text style={styles.cardTitle} numberOfLines={2}>{dress.nombre}</Text>
                                    <Text style={styles.cardPrice}>${dress.precio_renta} / día</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>

                {/* --- */}

                {/* === SECCIÓN COLECCIÓN EN VENTA (TARJETA CONTENEDORA con overflow visible) === */}
                <View style={styles.mainCardStyle}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Colección en Venta</Text>
                        <TouchableOpacity onPress={() => navigate('/sales-collection')} style={styles.viewMoreButton}>
                            <Text style={styles.viewMoreText}>Ver más</Text>
                            <Feather name="chevron-right" size={18} color="#333333" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollViewNoPadding}>
                        {loading && salesCollection.length === 0 ? (
                            <Text style={styles.loadingText}>Cargando...</Text>
                        ) : (
                            salesCollection.map((dress, index) => (
                                <TouchableOpacity
                                    key={dress._id}
                                    style={[itemCardShadowStyle, styles.productCardContainer, index === 0 && styles.firstItemMargin]}
                                    onPress={() => navigate(`/sales/${dress._id}`)}
                                >
                                    <Image source={{ uri: dress.imagenes[0] }} style={styles.cardImage} />
                                    <Text style={styles.cardTitle} numberOfLines={2}>{dress.nombre}</Text>
                                    <Text style={styles.cardPrice}>${dress.en_promocion ? dress.precio_promocion : dress.precio_venta}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>

                {/* --- */}

                <RentalProcessSection />

                {/* --- */}



                {/* --- */}

                {/* === SECCIÓN REVIEWS (TARJETA CONTENEDORA con overflow visible) === */}
                <View style={styles.mainCardStyle}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Lo que dicen de nosotros</Text>
                        <TouchableOpacity onPress={() => navigate('/sales-collection')} style={styles.viewMoreButton}>
                            <Text style={styles.viewMoreText}>Ver más</Text>
                            <Feather name="chevron-right" size={18} color="#333333" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollViewNoPadding}>
                        {reviews.map((review, index) => (
                            <View key={review.id} style={[styles.reviewCard, index === 0 && styles.firstItemMargin]}>
                                <Text style={styles.reviewText}>"{review.text}"</Text>
                                <Text style={styles.reviewAuthor}>- {review.author}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Espacio final */}
                <View style={{ height: 100 }} />

            </Animated.ScrollView>
            <BottomNavBar />
            <Sidebar />
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

export default Home;