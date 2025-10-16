import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MemoryRouter, Routes, Route } from 'react-router-native';
import { Text } from 'react-native';
import LoginScreen from '../src/auth/LoginScreen';
import { AuthService } from '../src/services/AuthService';

// Mock the AuthService class
jest.mock('../src/services/AuthService', () => ({
  AuthService: {
    login: jest.fn(),
  },
}));

// A simple placeholder for the screen you navigate to on success
const MockHomeScreen = () => <Text>Catálogo de Vestidos</Text>;

describe('AR001 - Inicio de sesión exitoso', () => {
  beforeEach(() => {
    // Clear mock history before each test
    jest.clearAllMocks();
  });

  it('debe autenticar al usuario y mostrar la pantalla principal', async () => {
    // Mock a successful login response
    AuthService.login.mockResolvedValue({ success: true, user: { name: 'Test User' } });

    const { getByPlaceholderText, getByText, queryByText } = render(
      <MemoryRouter initialEntries={['/login']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/home" element={<MockHomeScreen />} />
        </Routes>
      </MemoryRouter>
    );

    // Paso 1: Ingresar usuario y contraseña válidos
    const emailInput = getByPlaceholderText('tu@ejemplo.com');
    const passwordInput = getByPlaceholderText('Ingresa tu contraseña');
    const loginButton = getByText('Entrar');

    fireEvent.changeText(emailInput, 'usuario@gmail.com');
    fireEvent.changeText(passwordInput, '12345678');
    // DEBUG: Muestra los datos de entrada por consola
    console.log('--- DEBUG AR001 ---');
    console.log('Email ingresado:usuario@gmail.com');
    console.log('Contraseña ingresada:12345678', );
    fireEvent.press(loginButton);

    // Paso 2: Esperar redirección
    await waitFor(() => {
      expect(getByText('Catálogo de Vestidos')).toBeTruthy();
    });
  });
});
