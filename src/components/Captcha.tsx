import React from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator } from 'react-native';

interface CaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ siteKey, onVerify }) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://www.google.com/recaptcha/api.js"></script>
        <style>
          body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        </style>
      </head>
      <body>
        <div class="g-recaptcha" data-sitekey="${siteKey}" data-callback="onSuccess"></div>
        <script>
          function onSuccess(token) {
            window.ReactNativeWebView.postMessage(token);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" />}
        source={{ html }}
        onMessage={(event) => onVerify(event.nativeEvent.data)}
      />
    </View>
  );
};

export default Captcha;
