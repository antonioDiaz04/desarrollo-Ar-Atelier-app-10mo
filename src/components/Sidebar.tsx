import React, { useRef, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Animated, 
    TouchableWithoutFeedback, 
    Dimensions, 
    SafeAreaView, 
    TouchableOpacity, 
    Image, 
    ScrollView,
    StyleSheet
} from 'react-native';
import { useSidebar } from './SidebarContext'; // Asumo que este hook existe en tu proyecto
import { Feather } from '@expo/vector-icons'; // Usamos Feather para consistencia
import { useNavigate } from 'react-router-native';

const { width } = Dimensions.get('window');

// --- Paleta de Colores y Estilos ---
const COLORS = {
    background: '#FFFFFF',
    textPrimary: '#121212',
    textSecondary: '#6C6C6C',
    border: '#EAEAEA',
    accent: '#FF3B30',
};

const Sidebar: React.FC = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const slideX = useRef(new Animated.Value(-width * 0.8)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const [user, setUser] = useState<{ nombre: string; email: string; fotoDePerfil: string } | null>(null);
    const navigate = useNavigate();

    // Simulación de carga de usuario (reemplaza con tu lógica real)
    useEffect(() => {
        setUser({
            nombre: 'Usuario Demo',
            email: 'demo@email.com',
            fotoDePerfil: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        });
    }, []);

    useEffect(() => {
        const toValue = isSidebarOpen ? 0 : -width * 0.8;
        Animated.parallel([
            Animated.timing(slideX, {
                toValue,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: isSidebarOpen ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isSidebarOpen]);

    const handleNavigation = (path: string) => {
        toggleSidebar();
        navigate(path);
    };

    const handleLogout = () => {
        toggleSidebar();
        console.log("Cerrando sesión...");
        navigate('/login');
    };

    // --- Definición de los items del menú ---
    const activityItems = [
        { label: "Mis Posts", icon: "edit-3", path: "/my-posts" },
        { label: "Guardados", icon: "bookmark", path: "/saved" },
    ];

    const accountItems = [
        { label: "Ajustes", icon: "settings", path: "/settings" },
        { label: "Ayuda", icon: "help-circle", path: "/help" },
    ];

    return (
        <>
            {isSidebarOpen && (
                <TouchableWithoutFeedback onPress={toggleSidebar}>
                    <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
                </TouchableWithoutFeedback>
            )}

            <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideX }] }]}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.contentWrapper}>
                        {/* Header de Perfil */}
                        <View style={styles.profileHeader}>
                            <Image
                                source={{ uri: user?.fotoDePerfil }}
                                style={styles.avatar}
                            />
                            <View style={styles.profileTextContainer}>
                                <Text style={styles.userName}>{user?.nombre || 'Bienvenido'}</Text>
                                <TouchableOpacity onPress={() => handleNavigation('/profile')}>
                                    <Text style={styles.viewProfileLink}>Ver perfil</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Cuerpo del Sidebar con Scroll */}
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            {/* Sección: Mi Actividad */}
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>MI ACTIVIDAD</Text>
                                {activityItems.map((item) => (
                                    <TouchableOpacity key={item.label} style={styles.menuItem} onPress={() => handleNavigation(item.path)}>
                                        <Feather name={item.icon as any} size={22} color={COLORS.textSecondary} style={styles.menuIcon} />
                                        <Text style={styles.menuText}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Sección: Cuenta */}
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>CUENTA</Text>
                                {accountItems.map((item) => (
                                    <TouchableOpacity key={item.label} style={styles.menuItem} onPress={() => handleNavigation(item.path)}>
                                        <Feather name={item.icon as any} size={22} color={COLORS.textSecondary} style={styles.menuIcon} />
                                        <Text style={styles.menuText}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                        
                        {/* Footer con botón de Cerrar Sesión */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <Feather name="log-out" size={22} color={COLORS.accent} style={styles.menuIcon} />
                                <Text style={[styles.menuText, { color: COLORS.accent }]}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 49,
    },
    sidebarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width * 0.8,
        height: '100%',
        backgroundColor: COLORS.background,
        zIndex: 50,
    },
    safeArea: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    profileTextContainer: {
        marginLeft: 16,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    viewProfileLink: {
        fontSize: 14,
        color: '#007AFF', // Un azul estándar para links
        marginTop: 4,
    },
    scrollContent: {
        padding: 24,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        letterSpacing: 1,
        marginBottom: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    menuIcon: {
        marginRight: 20,
    },
    menuText: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    footer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
});

export default Sidebar;