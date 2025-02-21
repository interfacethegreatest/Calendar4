import React, { useEffect } from 'react';
import style from './styles.module.css';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import dynamic from 'next/dynamic';
const Moon = dynamic(() => import('../../../../public/media/moon/Moon'), { ssr: false });
export default function GlobeScene() {
    return (
      <Canvas id={style.globeCanvas}>
        <ambientLight intensity={6} />
        <OrbitControls enableZoom={false} />
        <Suspense>
          <Moon/>
        </Suspense>
        <Environment preset='sunset'/>
      </Canvas>
    );
  }