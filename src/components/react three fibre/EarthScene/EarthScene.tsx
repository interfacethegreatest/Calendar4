import React, { useEffect } from 'react';
import style from './styles.module.css';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import dynamic from 'next/dynamic';
const Earth = dynamic(() => import('../../../../public/media/earth/Earth'), { ssr: false });
export default function GlobeScene() {
    return (
      <Canvas id={style.globeCanvas}>
        <OrbitControls enableZoom={false} />
        <Suspense>
          <Earth/>
        </Suspense>
        <Environment preset='city'/>
      </Canvas>
    );
  }