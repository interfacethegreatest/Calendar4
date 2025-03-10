'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Model from './Model';
import { Environment } from '@react-three/drei';

export default function Scene() {
  return (
    <Canvas style={{ zIndex: '0', position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%' }}>
      <directionalLight intensity={3} position={[0, 3, 2]} />
      <Environment preset='city' />
      <Model />
    </Canvas>
  );
}
