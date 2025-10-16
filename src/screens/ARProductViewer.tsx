import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { PerspectiveCamera, Scene, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { Camera } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function ARProductViewer() {
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    })();
  }, []);

  if (!hasPermission) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#00ffaa" /></View>;
  }

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // Crear un cubo simple
    const geometry = new BoxGeometry(0.5, 0.5, 0.5);
    const material = new MeshBasicMaterial({ color: 0x00ffaa });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} type={Camera.Constants.Type.back} />
      <GLView style={styles.glview} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { ...StyleSheet.absoluteFillObject },
  glview: { ...StyleSheet.absoluteFillObject },
});
