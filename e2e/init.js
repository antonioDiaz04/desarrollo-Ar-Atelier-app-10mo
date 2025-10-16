// dentro de e2e/init.js (hooks de Detox)
afterEach(async function () {
  if (this.currentTest.state === 'failed') {
    await device.takeScreenshot(`FAIL-${this.currentTest.title}`);
  }
});