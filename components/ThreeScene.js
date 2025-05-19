import React, { Suspense, useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ url, onModelLoad, ...props }) => {
  if (!url) return null;
  const { scene } = useGLTF(url);
  const copiedScene = useMemo(() => scene.clone(), [scene]);
  useEffect(() => {
    if (onModelLoad) onModelLoad(copiedScene);
  }, [copiedScene, onModelLoad]);
  return <primitive object={copiedScene} {...props} />;
};

const Avatar = ({ url, onLoaded }) => {
  if (!url) return null;
  return (
    <Suspense fallback={<ModelSpinner />}>
      <Center>
        <Model url={url} onModelLoad={onLoaded} />
      </Center>
    </Suspense>
  );
};

const Clothing = ({ url, visible, color, onLoaded, positionOffset = [0, 0, 0], scaleFactor = 1 }) => {
  if (!url) return null;
  const clothingRef = useRef();

  useEffect(() => {
    if (clothingRef.current) {
      clothingRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (!child.material.isCloned) {
            child.material = child.material.clone();
            child.material.isCloned = true; 
          }
          child.material.color.set(color);
          child.material.needsUpdate = true;
        }
      });
    }
  }, [color]);

  return (
    <Suspense fallback={<ModelSpinner position={[0, 0.5, 0]} />}>
      <group
        ref={clothingRef}
        visible={visible}
        position={positionOffset}
        scale={scaleFactor}
      >
        <Model url={url} onModelLoad={onLoaded} />
      </group>
    </Suspense>
  );
};

const ModelSpinner = (props) => {
  const ref = useRef();
  useFrame((state, delta) => (ref.current.rotation.y += delta * 2));
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="orange" wireframe />
    </mesh>
  );
};

const ThreeScene = forwardRef((props, ref) => {
  const {
    avatarUrl,
    clothingUrl,
    isClothingVisible,
    clothingColor,
    onAvatarLoad,
    onClothingLoad,
    clothingPositionOffset, 
    clothingScaleFactor    
  } = props;

  const avatarGroupRef = useRef();
  useImperativeHandle(ref, () => ({
    resetScene: () => {
  
      console.log("ThreeScene.resetScene() called via ref.");
      if (avatarGroupRef.current) {
       
      }
    }
  }), []);

  return (
    <Canvas style={{ background: '#e0e0e0' }} camera={{ position: [0, 1, 3], fov: 50 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <Environment preset="city" />

      <group ref={avatarGroupRef}>
        {avatarUrl && <Avatar url={avatarUrl} onLoaded={onAvatarLoad} />}
        {avatarUrl && clothingUrl && (
          <Clothing
            url={clothingUrl}
            visible={isClothingVisible}
            color={clothingColor}
            onLoaded={onClothingLoad}
            positionOffset={clothingPositionOffset} 
            scaleFactor={clothingScaleFactor}       
          />
        )}
      </group>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} target={[0, 0.8, 0]} />
    </Canvas>
  );
});

ThreeScene.displayName = 'ThreeScene';
export default ThreeScene;