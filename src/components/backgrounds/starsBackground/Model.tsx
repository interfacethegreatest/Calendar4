import { Trail, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

function ShootingStar() {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 2
    ref.current.position.set(Math.sin(t) * 4, Math.atan(t) * Math.cos(t / 2) * 2, Math.cos(t) * 4)
  })
  return (
    <Trail width={1.25} length={2} color={new THREE.Color(2, 1, 10)} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.07]} />
        <meshBasicMaterial color={[10, 1, 10]} toneMapped={true} />
      </mesh>
    </Trail>
  )
}

function Model() {
  const stars = useRef();
  useFrame(() =>{
    stars.current.rotation.x = stars.current.rotation.y += 0.00025
  })
  return (
    <group>
      <mesh>
        <ambientLight intensity={1}/>
        {/*<ShootingStar/>*/}
        <Stars color="red" radius={200} count={7500} factor={4} fade ref={stars} />
        <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={1} />
        </EffectComposer>
      </mesh>
    </group>
  );
}

export default React.memo(Model);