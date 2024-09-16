import React, { useEffect } from 'react';
import style from './styles.module.css';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import dynamic from 'next/dynamic';
const Sun = dynamic(() => import('../../../../public/media/sun/Sun'), { ssr: false });
export default function GlobeScene() {
    return (
      <Canvas id={style.globeCanvas}>
        <ambientLight intensity={6} />
        <OrbitControls enableZoom={false} />
        <Suspense>
          <Sun/>
        </Suspense>
        <Environment preset='sunset'/>
      </Canvas>
    );
  }