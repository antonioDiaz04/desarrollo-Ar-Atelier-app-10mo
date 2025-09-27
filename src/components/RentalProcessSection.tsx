import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigate } from 'react-router-native';

const RentalProcessSection: React.FC = () => {
    const navigate = useNavigate();

    const rentalSteps = [
        {
            id: 1,
            icon: 'search',
            title: 'Elige tu Vestido',
            description: 'Explora nuestra colección y selecciona el vestido perfecto para tu evento.',
        },
        {
            id: 2,
            icon: 'calendar',
            title: 'Reserva la Fecha',
            description: 'Elige la fecha de tu evento y la duración de la renta.',
        },
        {
            id: 3,
            icon: 'credit-card',
            title: 'Confirma tu Reserva',
            description: 'Asegura tu vestido con un pago en línea de forma rápida y segura.',
        },
        {
            id: 4,
            icon: 'check-circle',
            title: '¡A Brillar!',
            description: 'Recoge tu vestido o te lo enviamos a domicilio para que luzcas radiante.',
        },
    ];

    return (
        <View className="p-6">
            <Text className="text-3xl font-bold text-gray-900 mb-8">
                Proceso de Renta
            </Text>
            <View className="flex-col">
                {rentalSteps.map((step) => (
                    <View key={step.id} className="flex-row items-center mb-6">
                        {/* Indicador de paso */}
                        <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-4">
                            <Text className="text-lg font-bold text-gray-700">{step.id}</Text>
                        </View>
                        <View className="flex-1 border-b border-gray-300 pb-6">
                            <Text className="text-xl font-semibold text-gray-800 mb-1">{step.title}</Text>
                            <Text className="text-sm text-gray-600 font-light">{step.description}</Text>
                        </View>
                    </View>
                ))}
            </View>
            {/* <TouchableOpacity 
                className="mt-6 bg-gray-900 rounded-lg py-4 px-6 self-center"
                onPress={() => navigate('/rent-collection')}
            >
                <Text className="text-white text-lg font-semibold">Explora la Colección</Text>
            </TouchableOpacity> */}
        </View>
    );
};

export default RentalProcessSection;