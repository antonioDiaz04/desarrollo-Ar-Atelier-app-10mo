import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigate, useLocation } from 'react-router-native';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  PlusIcon, 
  BellIcon, 
  UserIcon 
} from "react-native-heroicons/outline";
import { LinearGradient } from 'expo-linear-gradient';

// --- Paleta de Colores ---
const COLORS = {
    active: '#000000',
    inactive: '#A0A0A0',
    background: '#FFFFFF',
    gradientStart: '#FF6B6B',
    gradientEnd: '#9B59B6',
};

const BottomNavBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = (path: string) => {
        if (location.pathname === '/' && path === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const NavItem: React.FC<{ path: string; Icon: React.ElementType }> = ({ path, Icon }) => {
        const isActive = getActiveTab(path);
        const iconColor = isActive ? COLORS.active : COLORS.inactive;

        return (
            <TouchableOpacity onPress={() => navigate(path)} style={styles.navItem}>
                <Icon size={26} color={iconColor} />
                <View style={[styles.activeDot, { backgroundColor: isActive ? COLORS.active : 'transparent' }]} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                {/* Sección Izquierda */}
                <View style={styles.navSection}>
                    <NavItem path="/" Icon={HomeIcon} />
                    <NavItem path="/search" Icon={MagnifyingGlassIcon} />
                </View>

                {/* Botón Central */}
                <TouchableOpacity style={styles.addButton} onPress={() => navigate('/create-post')}>
                    <LinearGradient
                        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                        start={{ x: 0.1, y: 0.2 }}
                        end={{ x: 0.9, y: 1.0 }}
                        style={styles.gradient}
                    >
                        <PlusIcon size={30} color={COLORS.background} />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Sección Derecha */}
                <View style={styles.navSection}>
                    <NavItem path="/likes" Icon={BellIcon} />      {/* ← Actualizado */}
                    <NavItem path="/profile" Icon={UserIcon} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    navBar: {
        flexDirection: 'row',
        height: 65,
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 32.5,
        marginHorizontal: 20,
        marginBottom: Platform.OS === 'ios' ? 40 : 40,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.02,
        shadowRadius: 18,
        elevation: 10,
    },
    navSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    navItem: {
        alignItems: 'center',
        padding: 10,
    },
    activeDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        marginTop: 6,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        transform: [{ translateY: -22 }],
        shadowColor: '#A0609A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
    },
    gradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BottomNavBar;