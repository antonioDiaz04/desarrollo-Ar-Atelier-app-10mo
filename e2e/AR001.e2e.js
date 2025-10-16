// e2e/AR001.e2e.js
describe('AR001 – Inicio de sesión con credenciales válidas', () => {

  beforeAll(async () => {
    await device.launchApp({ permissions: { camera: 'YES' } });
  });

  it('debe autenticar y mostrar catálogo ', async () => {
    // Paso 1 – entrada de datos
    await element(by.label('input_email')).typeText('usuario@gmail.com');
    await element(by.label('input_password')).typeText('********');

    // Paso 2 – acción
    await element(by.label('btn_login')).tap();

    // Paso 3 – verificación
    await expect(element(by.label('rv_dresses'))).toBeVisible();
  });
});