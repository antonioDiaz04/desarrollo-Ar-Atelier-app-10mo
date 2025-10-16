import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Platform, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

const AR_HTML_CONTENT = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.3.2/aframe/build/aframe-ar.min.js"></script>
    <style>
      body { 
        margin: 0; 
        overflow: hidden; 
        background: #000;
      }
      .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-family: Arial;
      }
    </style>
  </head>
  <body>
    <div id="loading" class="loading">Cargando RA...</div>
    <a-scene 
        embedded 
        vr-mode-ui="enabled: false" 
        arjs='sourceType: webcam; debugUIEnabled: false; sourceWidth: 640; sourceHeight: 480;'>
      <a-marker preset='hiro'>
        <a-box 
          position='0 0.5 0' 
          material='color: #00ffaa;' 
          scale="0.5 0.5 0.5" 
          animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear;">
        </a-box>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>

    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const scene = document.querySelector('a-scene');

        scene.addEventListener('loaded', function() {
          console.log('Scene loaded');
        });

        scene.addEventListener('arjs-video-loaded', function() {
          document.getElementById('loading').style.display = 'none';
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage("AR_LOADED");
          }
          console.log('AR video stream started!');
        });

        // Fallback: después de 10s
        setTimeout(function() {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage("AR_LOADED");
          }
        }, 10000);
      });
    </script>
  </body>
</html>
`;

const ARProductViewer = () => {
  const [isCameraPermissionReady, setIsCameraPermissionReady] = useState(false);
  const [isARContentReady, setIsARContentReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const showLoading = !isCameraPermissionReady || !isARContentReady;

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Permiso de Cámara para RA",
            message: "Necesitamos tu permiso para usar la cámara y mostrar la Realidad Aumentada.",
            buttonNeutral: "Preguntar más tarde",
            buttonNegative: "Cancelar",
            buttonPositive: "Aceptar"
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Permiso de cámara concedido");
          setIsCameraPermissionReady(true);
          setPermissionDenied(false);
        } else {
          console.log("Permiso de cámara denegado");
          setPermissionDenied(true);
          setIsCameraPermissionReady(false);
        }
      } else {
        // iOS: asumimos que los permisos están en Info.plist
        console.log("Plataforma iOS - permisos concedidos");
        setIsCameraPermissionReady(true);
        setPermissionDenied(false);
      }
    } catch (err) {
      console.warn("Error al solicitar permiso:", err);
      setPermissionDenied(true);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    console.log("Mensaje del WebView:", message);

    if (message === "AR_LOADED") {
      setIsARContentReady(true);
    }
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
  };

  if (permissionDenied) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Permiso de cámara denegado. La RA no puede funcionar sin acceso a la cámara.
        </Text>
        <TouchableOpacity onPress={requestCameraPermission}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isCameraPermissionReady && (
        <WebView
          originWhitelist={['*']}
          source={{ html: AR_HTML_CONTENT }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onMessage={handleWebViewMessage}
          onError={handleWebViewError}
          onHttpError={handleWebViewError}
          style={styles.webview}
          startInLoadingState={true}
          geolocationEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#00ffaa" />
              <Text style={styles.loadingText}>Cargando realidad aumentada...</Text>
            </View>
          )}
        />
      )}

      {showLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00ffaa" />
          <Text style={styles.loadingText}>
            {!isARContentReady ? "Inicializando motor 3D y cámara..." : "Preparando..."}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 99,
  },
  loadingText: { color: '#00ffaa', marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ff4444', textAlign: 'center', marginHorizontal: 20, fontSize: 16 },
  retryText: { color: '#00ffaa', marginTop: 20, fontSize: 16, fontWeight: 'bold' }
});

export default ARProductViewer;
