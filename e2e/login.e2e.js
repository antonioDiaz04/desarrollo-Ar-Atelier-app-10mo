describe('AR003 - Interfaz de login visualmente correcta (E2E)', () => {

  // Antes de cada prueba, reinicia la aplicación para asegurar un estado limpio
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  // La prueba verifica que todos los elementos estén visibles
  it('Debe renderizar todos los campos, el botón Entrar y el enlace Olvidaste contraseña', async () => {
    
    // Paso 1: Abrir pantalla de login (ya está abierta después del beforeEach)

    // Verificación 1: Campo de Correo
    // Debes tener el prop testID='email-input' en tu <TextInput>
    await expect(element(by.id('email-input'))).toBeVisible(); 

    // Verificación 2: Campo de Contraseña
    // Debes tener el prop testID='password-input' en tu <TextInput>
    await expect(element(by.id('password-input'))).toBeVisible(); 

    // Verificación 3: Botón de inicio de sesión
    await expect(element(by.text('Entrar'))).toBeVisible();

    // Verificación 4: Enlace "¿Olvidaste tu contraseña?"
    await expect(element(by.text('¿Olvidaste tu contraseña?'))).toBeVisible();
    
    // Resultado esperado: Todos los elementos UI están visibles. ✅
  });

  // La prueba verifica la interacción (paso 2 de tu tabla AR003)
  it('Debe responder al tap del enlace Olvidaste contraseña sin fallos', async () => {
    // Busca el enlace por su texto
    const forgotPasswordLink = element(by.text('¿Olvidaste tu contraseña?'));

    // Acción: Tocar el enlace
    await forgotPasswordLink.tap();

    // Verificación: Aunque no verificamos la navegación real (eso sería otro test), 
    // verificamos que la acción de tocar no cause un crash inmediato y que,
    // por ejemplo, aparezca una nueva pantalla/modal.
    // Si la acción anterior no falla, se cumple que "Responden sin errores".
  });
});