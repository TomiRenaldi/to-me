import * as THREE from "three";
import React, { Suspense, useEffect, useState, forwardRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, GodRays, Bloom } from "@react-three/postprocessing";

export default function TomeText() {
  return (
    <Canvas
      shadows
      gl={{ alpha: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 3, 100], fov: 15 }}
    >
      <color attach="background" args={["black"]} />
      <fog attach="fog" args={["black", 15, 20]} />
      <Suspense fallback={null}>
        <TextScreen />
        <ambientLight intensity={0.5} />
        <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 20]} />
          <MeshReflectorMaterial
            blur={[400, 100]}
            resolution={512}
            mixBlur={1}
            depthScale={1}
            mixStrength={15}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            minDepthThreshold={0.85}
            metalness={0.9}
            roughness={0.9}
          />
        </mesh>
        <Intro />
      </Suspense>
    </Canvas>
  );
}

const Emitter = forwardRef((props, forwardRef) => {
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: "/ward.mp4",
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    })
  );
  useEffect(() => void video.play(), [video]);
  return (
    <Text
      ref={forwardRef}
      font="/Inter-Bold.woff"
      fontSize={2}
      letterSpacing={-0.06}
      {...props}
    >
      to-me
      <meshBasicMaterial toneMapped={false}>
        <videoTexture
          attach="map"
          args={[video]}
          encoding={THREE.sRGBEncoding}
        />
      </meshBasicMaterial>
    </Text>
  );
});

function TextScreen() {
  const [material, set] = useState();
  return (
    <>
      <Emitter ref={set} />
      {material && (
        <EffectComposer disableNormalPass multisampling={8}>
          <GodRays sun={material} exposure={0.05} decay={0.9} blur />
          <Bloom
            luminanceThreshold={0}
            mipmapBlur
            luminanceSmoothing={0.0}
            intensity={1}
          />
        </EffectComposer>
      )}
    </>
  );
}

function Intro() {
  const [vec] = useState(() => new THREE.Vector3());
  return useFrame((state) => {
    state.camera.position.lerp(
      vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14),
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });
}