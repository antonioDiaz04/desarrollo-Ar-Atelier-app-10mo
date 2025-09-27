import React, { useRef, useEffect, useState } from "react";
import { View, Text, Animated, TouchableWithoutFeedback, Dimensions, SafeAreaView, TouchableOpacity, Image, ScrollView } from "react-native";
import { useSidebar } from "./SidebarContext";
import {
    HomeIcon,
    StarIcon,
    HeartIcon,
    ShoppingCartIcon,
    UserIcon,
    TruckIcon,
    CreditCardIcon,
    QuestionMarkCircleIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ShoppingBagIcon,
    TagIcon,
    InformationCircleIcon, BuildingStorefrontIcon
} from "react-native-heroicons/outline";
import { ArrowRightOnRectangleIcon as ArrowRightOnRectangleIconSolid } from "react-native-heroicons/solid";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from "react-router-native";
const { width } = Dimensions.get("window");

const Sidebar: React.FC = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const slideX = useRef(new Animated.Value(-width * 0.75)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
    const [user, setUser] = useState<{ nombre: string; email: string; fotoDePerfil: string } | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const loadUser = async () => {
            // const userData = await AsyncStorage.getItem('user');
            // if (userData) setUser(JSON.parse(userData));
        };
        loadUser();
    }, []);




    useEffect(() => {
        if (isSidebarOpen) {
            Animated.parallel([
                Animated.timing(slideX, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideX, {
                    toValue: -width * 0.75,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isSidebarOpen]);

    const handleLogout = async () => {

        toggleSidebar(); // Cierra el sidebar
        try {
            // await AsyncStorage.removeItem('user');
            // await AsyncStorage.removeItem('token');
            navigate('/login'); // Redirige a la pantalla de login
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        }
    };
    const darkTextColor = "#4A433D";
    const lightHeaderColor = "#FCFBEF";

    const navItems = [
        { label: "Inicio", icon: <HomeIcon size={20} color={darkTextColor} />, path: "/home" },
        { label: "Nuevos Productos", icon: <StarIcon size={20} color={darkTextColor} />, path: "/new-arrivals" },
        { label: "Ofertas", icon: <TagIcon size={20} color={darkTextColor} />, path: "/offers" },
    ];

    const accountItems = [
        { label: "Mi Perfil", icon: <UserIcon size={20} color={darkTextColor} />, path: "/profile" },
        { label: "Mis Pedidos", icon: <ShoppingBagIcon size={20} color={darkTextColor} />, path: "/orders" },
        { label: "Favoritos", icon: <HeartIcon size={20} color={darkTextColor} />, path: "/wishlist" },
    ];

    const moreItems = [
        { label: "Acerca de Atelier", icon: <InformationCircleIcon size={20} color={darkTextColor} />, path: "/about" },
        { label: "Ver Tienda Oficial", icon: <BuildingStorefrontIcon size={20} color={darkTextColor} />, path: "/official-store" },
        { label: "Ayuda y Soporte", icon: <QuestionMarkCircleIcon size={20} color={darkTextColor} />, path: "/help" },
    ];

    const categories = [
        { label: "Hombres", path: "/category/men" },
        { label: "Mujeres", path: "/category/women" },
        { label: "Niños", path: "/category/kids" },
    ];

    return (
        <>
            {isSidebarOpen && (
                <TouchableWithoutFeedback onPress={toggleSidebar}>
                    <Animated.View
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            opacity: backdropOpacity,
                            zIndex: 49,
                        }}
                    />
                </TouchableWithoutFeedback>
            )}

            <Animated.View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: width * 0.75,
                    height: "100%",
                    backgroundColor: "#FFFFFF",
                    transform: [{ translateX: slideX }],
                    zIndex: 50,
                }}
            >
                <SafeAreaView className="flex-1">
                    {/* Header de Perfil */}
                    <View style={{ backgroundColor: lightHeaderColor }} className="p-6 flex-row pt-14 items-center justify-between">
                        <View className="flex-row items-center">
                            <Image
                                source={{ uri: user?.fotoDePerfil || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
                                className="w-12 h-12 rounded-full border-1"
                                style={{ borderColor: '#4A433D' }}
                            />
                            <View className="ml-4">
                                <Text style={{ color: '#4A433D' }} className="text-lg font-semibold">
                                    {user?.nombre || 'Usuario Demo'}
                                </Text>
                                {user?.email && (
                                    <Text className="text-gray-600 text-sm">
                                        {user.email}
                                    </Text>
                                )}
                                <TouchableOpacity onPress={() => {
                                    toggleSidebar();
                                    navigate('/profile')
                                }}>
                                    <Text className="text-blue-600 text-sm mt-1">
                                        Ver perfil
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                    {/* Cuerpo del Sidebar con Scroll */}
                    <ScrollView className="flex-1 p-6 space-y-6 bg-[#FCFBEF]">
                        {/* Sección: Navegación Principal */}
                        <View>
                            <Text style={{ color: darkTextColor }} className="text-sm font-bold mb-3">NAVEGACIÓN</Text>
                            {navItems.map((item) => (
                                <TouchableOpacity
                                    key={item.label}
                                    className="flex-row items-center py-2"
                                    onPress={toggleSidebar}
                                >
                                    {item.icon}
                                    <Text className="ml-3 text-base" style={{ color: darkTextColor }}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Sección: Categorías */}
                        <View>
                            <TouchableOpacity onPress={() => setIsCategoriesExpanded(!isCategoriesExpanded)} className="flex-row items-center justify-between">
                                <Text style={{ color: darkTextColor }} className="text-sm font-bold">CATEGORÍAS</Text>
                                {isCategoriesExpanded ? (
                                    <ChevronUpIcon size={16} color={darkTextColor} />
                                ) : (
                                    <ChevronDownIcon size={16} color={darkTextColor} />
                                )}
                            </TouchableOpacity>
                            {isCategoriesExpanded && (
                                <View className="mt-3 ml-4 space-y-2">
                                    {categories.map((item) => (
                                        <TouchableOpacity
                                            key={item.label}
                                            onPress={toggleSidebar}
                                            className="py-1"
                                        >
                                            <Text style={{ color: darkTextColor }} className="text-sm">{item.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Sección: Mi Cuenta */}
                        <View>
                            <Text style={{ color: darkTextColor }} className="text-sm font-bold mb-3">MI CUENTA</Text>
                            {accountItems.map((item) => (
                                <TouchableOpacity
                                    key={item.label}
                                    className="flex-row items-center py-2"
                                    onPress={toggleSidebar}
                                >
                                    {item.icon}
                                    <Text className="ml-3 text-base" style={{ color: darkTextColor }}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Sección: Información y Soporte */}
                        <View>
                            <Text style={{ color: darkTextColor }} className="text-sm font-bold mb-3">INFORMACIÓN Y SOPORTE</Text>
                            {moreItems.map((item) => (
                                <TouchableOpacity
                                    key={item.label}
                                    className="flex-row items-center py-2"
                                    onPress={toggleSidebar}
                                >
                                    {item.icon}
                                    <Text className="ml-3 text-base" style={{ color: darkTextColor }}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Botón de Cerrar Sesión (ahora dentro del ScrollView) */}
                        <View className="pt-40">
                            <TouchableOpacity
                                className="flex-row items-center justify-center py-3 bg-white rounded-lg shadow-sm border border-black"
                                onPress={handleLogout

                                }
                            >
                                <ArrowRightOnRectangleIconSolid size={20} color="black" />
                                <Text className="ml-3 text-black text-base font-semibold">Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Animated.View>
        </>
    );
};

export default Sidebar;