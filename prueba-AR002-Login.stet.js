import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MemoryRouter, Routes, Route } from 'react-router-native';
import { Text } from 'react-native';
import LoginScreen from './src/auth/LoginScreen';
import { AuthService } from './src/services/AuthService';

// Mock the AuthService class
jest.mock('../src/services/AuthService', () => ({
  AuthService: {
    login: jest.fn(),
  },
}));

// A simple placeholder for the screen you navigate to on success
const MockHomeScreen = () => <Text>Catálogo de Vestidos</Text>;

describe('AR002 - Validación de autenticación fallida', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  it(' mostrar un mensaje de error y permanecer en la pantalla de login con credenciales incorrectas', async () => {
    
    // Configuración del Mock para FALLO
    AuthService.login.mockResolvedValue({ success: false, error: 'Correo o contraseña incorrectos' });

    const { getByPlaceholderText, getByText, queryByText } = render(
      <MemoryRouter initialEntries={['/login']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/home" element={<MockHomeScreen />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Datos de entrada del caso AR002
    const EMAIL_INCORRECTO = 'usuario@gmail.com';
    const PASSWORD_INCORRECTA = 'ContraseñaIncorrecta123';

    // Paso 1: Ingresar usuario y contraseña inválidos
    const emailInput = getByPlaceholderText('tu@ejemplo.com');
    const passwordInput = getByPlaceholderText('Ingresa tu contraseña');
    const loginButton = getByText('Entrar');

    fireEvent.changeText(emailInput, EMAIL_INCORRECTO);
    fireEvent.changeText(passwordInput, PASSWORD_INCORRECTA);

    // DEBUG: Muestra los datos de entrada por consola
    console.log('--- DEBUG AR002 ---');
    console.log('Email ingresado:', EMAIL_INCORRECTO);
    console.log('Contraseña ingresada:', PASSWORD_INCORRECTA);
   
    
    fireEvent.press(loginButton);

    // Paso 2: Esperar el mensaje de error y verificar que NO hay redirección.
    await waitFor(() => {
      // Verificación A: El sistema debe mostrar el mensaje de error.
      expect(getByText('Correo o contraseña incorrectos')).toBeTruthy();

      // Verificación B: La pantalla principal NO debe ser visible.
      expect(queryByText('Catálogo de Vestidos')).toBeNull();
    });
  });
});